# Contrato de métricas de producto

Este documento es la definición **autoritativa** de lo que mide C++ CETI. Si un
número del panel interno (`/app/admin`) no cuadra con lo que dice aquí, el bug
está en el código o en este documento — no en la interpretación de quien lee.

Escrito para que dentro de dos años se pueda responder, sin depender de la
memoria de nadie: *¿qué significaba exactamente esta métrica cuando la
medimos?*

---

## 1. Principios

1. **Las tablas de dominio mandan.** Los envíos calificados
   (`UserExerciseAttempt`, `UserPracticeAttempt`), los aprobados
   (`UserExerciseCompletion`, `UserPracticeCompletion`), el progreso
   (`UserStepProgress`, `UserLessonProgress`), las pistas (`UserHintViewed`) y
   los reportes (`BugReport`, `Feedback`) **no se duplican** como eventos.
2. **`ProductEvent` sólo existe para lo que no se puede inferir** de lo
   anterior: vistas, primera interacción, intentos en pasos interactivos,
   respuestas reveladas y compilaciones sin calificar.
3. **El reloj es del servidor.** `occurredAt`, `startedAt`, `lastPingAt`,
   `endedAt` los pone PostgreSQL (`now()`), nunca el navegador.
4. **Idempotencia donde puede haber duplicados.** Cada evento que un
   re-render, un doble click o un reintento podrían repetir lleva `dedupeKey`
   con UNIQUE `(userId, dedupeKey)`.
5. **Minimización de datos.** Ver §9.

---

## 2. Taxonomía de eventos

Enum cerrado `ProductEventName`. Contrato de `props` en
`src/lib/analytics/events.ts` (validado con Zod en el servidor).

| Evento | Cuándo se emite | Quién lo emite | `dedupeKey` | `props` |
|---|---|---|---|---|
| `lesson_view` | Se montó el reproductor de una lección | Cliente | `lesson_view:{sessionId}` | — |
| `lesson_engaged` | Primera interacción real de esa visita (avanzar de paso, contestar, escribir código, compilar) | Cliente | `lesson_engaged:{sessionId}` | `trigger` |
| `lesson_step_view` | El alumno llegó a un paso | Cliente | `lesson_step_view:{sessionId}:{stepId}` | `stepType`, `stepIndex` |
| `lesson_step_attempt` | Envió una respuesta en un paso interactivo | Cliente | `…:{sessionId}:{stepId}:{attemptNumber}` | `stepType`, `attemptNumber`, `correct` |
| `lesson_step_answer_revealed` | Pidió ver la respuesta/solución | Cliente | `…:{sessionId}:{stepId}` | `stepType`, `failedAttempts` |
| `practice_view` | Se montó un ejercicio de práctica | Cliente | `practice_view:{sessionId}` | — |
| `practice_engaged` | Primera interacción real en la práctica | Cliente | `practice_engaged:{sessionId}` | `trigger` |
| `code_run` | Compiló/ejecutó **sin** calificar | **Servidor** (`/api/run`) | ninguno (cada run es un run) | `outcome`, `errorCategory?` |

Notas:

- `lesson_step_attempt` **no** se emite para retos de código: esos envíos ya
  viven en `UserExerciseAttempt`. Lo que sí se emite para un reto es
  `lesson_step_answer_revealed` cuando el alumno pide la solución.
- `attemptNumber` es un ordinal dentro de la visita (1 = primer intento).
  Sirve para el dedupe: un reintento de red con el mismo ordinal cuenta una vez.
- Todos los eventos guardan `contentRevision` (§7), resuelta **en el servidor**
  leyendo el recurso.
- El servidor descarta el evento (y lo registra en el log) si la
  `StudySession` no es del usuario o si el paso no pertenece a la lección
  declarada.

---

## 3. `StudySession` — qué es y qué NO es

Una `StudySession` es **una visita continua a un recurso** (una lección o un
ejercicio de práctica), no un login ni un día de uso.

Ciclo de vida (`src/lib/analytics/study-session.ts`):

| Fase | Mecanismo |
|---|---|
| Abrir | El reproductor la abre al montarse, con un `clientKey` único por montaje. UNIQUE `(userId, clientKey)` ⇒ StrictMode/reintentos/doble montaje no duplican sesiones. |
| Latir | Cada **30 s**, y **sólo si** la pestaña está visible **y** hubo teclado/mouse/scroll en los últimos **60 s**. |
| Cerrar | Al desmontar o en `pagehide` (`sendBeacon`). Idempotente: `WHERE endedAt IS NULL`. |
| Huérfanas | Si nadie cerró, el barrido las cierra **en `lastPingAt`** con `endedReason = 'expired'` tras **5 min** sin latidos. Se ejecuta al abrir la siguiente sesión del mismo usuario. |

### Tiempo

- **`startedAt` → `endedAt` es TIEMPO DE PARED. No es tiempo de estudio.**
- **`engagedMs` es tiempo activo aproximado**: la suma de los huecos entre
  latidos consecutivos, cada uno acotado a **60 s** en SQL
  (`LEAST(now() - lastPingAt, 60s)`). El nombre dice "engaged", no "estudiado",
  a propósito.

Qué implica esto en la práctica:

- Una pestaña abierta 40 minutos con el alumno ausente 35 suma ≈ 5 minutos, no 40.
- Una sesión abandonada **no crece para siempre**: sin latidos no hay crédito,
  y el barrido la cierra en su último latido.
- Leer sin tocar nada durante más de 60 s deja de acumular tiempo. Es una
  **subestimación deliberada**: preferimos medir de menos que inflar.
- El crédito se aplica en una sola sentencia SQL, así que dos latidos
  concurrentes no pueden pisarse.

---

## 4. Usuario activo

**Activo = hizo algo, no que entró.** Un login no cuenta; abrir una lección
tampoco (`lesson_view` está excluido a propósito).

Cuenta como actividad significativa (`ACTIVE_EVENT_NAMES` en
`src/features/analytics/queries.ts`):

- `lesson_engaged`, `practice_engaged`
- `lesson_step_attempt`, `lesson_step_answer_revealed`
- `code_run`
- un envío calificado (`UserExerciseAttempt` / `UserPracticeAttempt`)

Derivadas:

- **Nuevos registros**: `user.createdAt` dentro de la ventana.
- **Primera actividad**: usuarios cuya primera actividad significativa (de
  toda su historia) cae en la ventana.
- **Registrados sin actividad**: se dieron de alta en la ventana y nunca
  hicieron nada. Es la métrica de arranque fallido.

---

## 5. Retención por cohortes

- La cohorte de un usuario es la **semana (lunes, UTC) de su primera actividad
  significativa**, no la de su registro.
- `returned[N]` = usuarios de la cohorte con actividad significativa en la
  semana N posterior. `returned[0]` es la semana de arranque, siempre = tamaño.
- La última cohorte y la última semana **siempre están incompletas**.

---

## 6. Funnels y abandono

Todo se cuenta en **usuarios distintos**, nunca en eventos.

Lecciones:

```
lesson_view  →  lesson_engaged  →  UserLessonProgress.status = completed
  (abrió)         (interactuó)              (completó)
```

Práctica:

```
practice_view  →  practice_engaged  →  UserPracticeCompletion
```

- **Rebote** (`bouncedViewers`): abrió y nunca interactuó.
- **Abandono** (`abandonedAfterEngaging`): interactuó y no completó **dentro de
  la ventana**.
- **Abandono por paso** (`computeStepDropoff`): a cada usuario se le atribuye
  el **último paso que vio** en la ventana. El último paso de la lección
  siempre sale con "se quedaron aquí" alto: ahí termina el contenido.

La completación sale de la tabla de dominio, no de un evento: **el progreso
académico no se fabrica desde analytics**.

---

## 7. Revisiones de contenido

`prisma/content/*.ts` es la fuente de verdad; el seed calcula un hash corto
(sha256 truncado a 12 hex) del contenido y lo guarda:

| Entidad | Qué entra en el hash |
|---|---|
| `LessonStep.contentRevision` | tipo + contenido del paso (y, si es reto, el hash del ejercicio) |
| `Exercise.contentRevision` | enunciado, starter, solución, pistas, dificultad, XP y **test cases** |
| `PracticeExercise.contentRevision` | lo mismo, para práctica |
| `Lesson.contentRevision` | hash de las revisiones de sus pasos, en orden |

Además, cada revisión nueva agrega una fila a `content_revision`
(`targetType`, `targetId`, `revision`, `firstSeenAt`): ahí está **la frontera
temporal** para comparar antes/después.

Quién guarda la revisión que el alumno tenía enfrente:

- `UserExerciseAttempt.contentRevision`, `UserPracticeAttempt.contentRevision`
- `ProductEvent.contentRevision`
- `UserHintViewed.contentRevision`

Cómo se hace un before/after honesto:

1. Buscar en `content_revision` el `firstSeenAt` de la revisión nueva.
2. Ventana **antes**: intentos con la revisión anterior.
3. Ventana **después**: intentos con la revisión nueva.
4. Comparar la métrica objetivo (ver plantilla en `docs/experimentos/`).

Reordenar campos en el TypeScript **no** cambia el hash (la serialización es
canónica). Cambiar un `expectedStdout` **sí** lo cambia, aunque el enunciado
no se toque.

---

## 8. Métricas de ejercicio

- **First-pass rate** = usuarios cuyo **primer envío calificado** de ese
  ejercicio pasó ÷ usuarios con al menos un envío.
- **Envíos hasta aprobar** = posición del primer envío aprobado, sólo para
  quienes aprobaron. Se reporta la **mediana** (percentil por índice truncado:
  con 2 datos toma el bajo).
- **No lo lograron** = enviaron y nunca aprobaron hasta el fin de la ventana.
- **Ranking de fricción** = menor first-pass rate primero, desempate por más
  envíos hasta aprobar. **Mínimo 3 usuarios** para aparecer.
- **Ventana**: se eligen los ejercicios con envíos dentro del rango, pero el
  cálculo usa **todo el historial de cada (usuario, ejercicio) hasta el fin de
  la ventana**. Si no, alguien que ya lo había aprobado antes aparecería como
  "no lo logró a la primera".

### Pistas

- Una fila por `(usuario, ejercicio, índice de pista)`. Volver a abrir el panel
  o refrescar **no** infla el conteo.
- "Con pistas" significa **"vio al menos una pista de ese ejercicio"**, no
  necesariamente antes de ese envío concreto. Es una aproximación; para el
  orden temporal exacto están `UserHintViewed.viewedAt` y `studySessionId`.

### Compilar → Calificar

- `code_run` = ejecución desde el editor **sin** calificar. No duplica
  `UserExerciseAttempt`.
- **Runs/envío**, **compilaciones antes del primer envío** y **usuarios que
  compilan y nunca envían** salen de cruzar `code_run` con los envíos.
- Los runs del playground libre (dentro de un paso `code_example`) se guardan
  con `surface = playground` y **sin** `exerciseId`: no contaminan el
  denominador de los retos.
- De un error de compilación se guarda **sólo la categoría**
  (`missing_semicolon`, `undeclared_identifier`, …), nunca el mensaje crudo ni
  el código.

### `durationMs` — leer antes de usar

`UserExerciseAttempt.durationMs` y `UserPracticeAttempt.durationMs` son la
**latencia del ejecutor** (compilar + correr todos los tests). **No** son el
tiempo que el alumno tardó en resolver. Para tiempo de estudio: `engagedMs`.

### `UserStepProgress.completionCount`

Antes se llamaba `attempts` y parecía "intentos del estudiante". **No lo era**:
lo incrementa cada llamada a `completeStep`, así que volver atrás y avanzar de
nuevo lo sube. Se renombró para que nadie lo confunda. Los intentos
pedagógicos reales están en `ProductEvent.lesson_step_attempt` (pasos
interactivos) y en `UserExerciseAttempt` (retos de código).

---

## 9. Qué NO capturamos

Por diseño, y no por falta de tiempo:

- ❌ Pulsaciones de teclas, movimientos de mouse, grabaciones de sesión.
- ❌ El contenido del editor en cada cambio. El código sólo se guarda en el
  **envío calificado** (`UserExerciseAttempt.code`), que es donde tiene valor
  pedagógico.
- ❌ Código fuente o mensajes crudos del compilador dentro de `ProductEvent`.
- ❌ IP, user agent, huella del dispositivo o resolución de pantalla en la capa
  de analytics.
- ❌ Query strings o fragmentos de URL en el feedback: sólo el pathname.
- ❌ Correos en los dashboards agregados. En la cola de triage se muestra el
  `username` (para poder responderle a quien reportó), nunca el correo.
- ❌ Servicios de terceros: todo vive en el PostgreSQL del proyecto.

Borrar la cuenta borra sus eventos, sesiones y pistas por `ON DELETE CASCADE`.

---

## 10. Feedback y reportes

| | `BugReport` | `Feedback` |
|---|---|---|
| Para qué | Contenido roto: typo, test mal configurado | Experiencia: "me confundió", idea, algo que gustó |
| Target | Paso, reto o ejercicio de práctica (elegido por el alumno) | Ruta, superficie y recurso **derivados por el servidor** |
| Estados | `open` → `triaged` → `resolved` / `duplicate` / `wontfix` | los mismos (`ReportStatus`) |

Ambos guardan evidencia del cierre: `resolutionNote`, `issueUrl`, `prUrl`,
`triagedAt`, `resolvedAt`, `handledById`.

Acceso: `/app/admin/reportes`. La autorización es **server-side** y se repite
en cada página y en cada Server Action (`requireAdmin`): un layout no protege
un POST directo. Admin = `user.role = 'admin'` en la BD, o correo en
`ADMIN_EMAILS` (sólo para nombrar al primer admin).

---

## 11. Limitaciones conocidas

Honestidad por delante:

1. **`engagedMs` subestima.** Leer sin tocar nada más de 60 s no acumula. Es
   una cota inferior del tiempo real de estudio, no una medida exacta.
2. **`engagedMs` es auto-reportado por el cliente.** Un alumno con la consola
   abierta podría inflar *su propio* tiempo. No hay XP ni ranking atados a esta
   métrica, así que el incentivo es nulo — pero no la uses como si fuera
   inviolable.
3. **`pagehide` no siempre llega.** Por eso existe el barrido; hasta que corre,
   la sesión aparece como abierta y se mide hasta su último latido.
4. **Los eventos de cliente se pueden perder** (red caída, pestaña cerrada a
   media petición). Los funnels son cotas inferiores. Los envíos calificados,
   que pasan por Server Actions, son mucho más confiables.
5. **Sin bloqueador de anuncios de por medio, pero sí con JS obligatorio**: sin
   JavaScript no hay `StudySession` ni eventos.
6. **Tope de filas.** Las consultas del panel traen hasta `MAX_ROWS` (50 000)
   filas por fuente y agregan en memoria. A escala de un plantel sobra; si un
   día no alcanza, hay que mover esas agregaciones a SQL.
7. **"Con pistas" no está alineado por intento** (ver §8).
8. **`stepIndex`** viene del cliente y refleja la posición en el reproductor en
   ese momento; si una lección cambia de orden, los `stepIndex` viejos siguen
   siendo los de entonces. Para comparar, usa `contentRevision`.
9. **Todo es UTC.** Los días y las semanas se cortan en UTC, no en horario de
   Guadalajara. Un uso a las 19:00 CST cae en el día siguiente UTC.
10. **Ventana de retención**: sólo se leen hasta `MAX_ROWS` eventos históricos
    para calcular la primera actividad.

---

## 12. Dónde vive cada cosa

| Qué | Dónde |
|---|---|
| Taxonomía y contrato de `props` | `src/lib/analytics/events.ts` |
| Escritura de eventos (idempotente) | `src/lib/analytics/record.ts` |
| Ciclo de vida de `StudySession` | `src/lib/analytics/study-session.ts` |
| Categorías de error de compilación | `src/lib/analytics/error-category.ts` |
| Hash de contenido | `src/lib/content-revision.ts` |
| Server Actions de telemetría | `src/features/analytics/actions.ts` |
| Cliente (provider, heartbeat, contexto) | `src/features/analytics/telemetry.tsx` |
| Cálculo de métricas (puro y probado) | `src/features/analytics/metrics.ts` |
| Consultas del panel | `src/features/analytics/queries.ts` |
| Autorización del panel | `src/lib/admin.ts` |
| Panel | `src/app/app/admin/` |
| Plantilla de experimentos | `docs/experimentos/PLANTILLA.md` |
