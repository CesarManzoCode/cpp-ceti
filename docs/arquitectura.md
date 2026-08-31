# Arquitectura y decisiones

---

## Cómo está organizado el código

```
src/
├── app/                     # Next.js App Router
│   ├── (auth)/              # /login y /registro
│   ├── api/
│   │   ├── auth/[...all]/   # handler de Better Auth
│   │   ├── health/          # ping para monitoreo
│   │   └── run/             # POST → compila y ejecuta (rate limit 30/min por usuario)
│   ├── app/                 # área autenticada
│   │   ├── page.tsx         # entrada: elige curso (o entra al único que hay)
│   │   ├── c/[courseSlug]/  # TODO lo que pertenece a un curso
│   │   │   ├── page.tsx     # inicio del curso: siguiente lección + "Tu camino"
│   │   │   ├── u/[unitSlug]/[lessonSlug]  # reproductor de lecciones
│   │   │   └── ejercicios/  # práctica libre del curso
│   │   ├── u/ · ejercicios/ # URLs legacy sin curso → 308 al curso de C++
│   │   ├── logros/ · amigos/ · perfil/
│   ├── invitar/             # invitaciones entre estudiantes
│   └── page.tsx             # landing
├── features/                # una carpeta por dominio, con sus acciones y componentes
│   ├── lessons/             # actions.ts (completeStep, submitExercise), queries, pasos
│   ├── practice/            # ejercicios sueltos y sus envíos
│   ├── roadmap/             # el camino del curso y su progreso
│   ├── friends/ · profile/ · bug-reports/
├── components/
│   ├── editor/              # Monaco + consola + autocompletado y diagnósticos
│   │                        #   por lenguaje (completions/, diagnostics.ts)
│   ├── exercise/            # enunciado, casos de ejemplo, pistas, resultados de tests
│   ├── landing/ · layout/ · shared/ · ui/
├── lib/
│   ├── executor/            # adapters: wandbox · piston · judge0 (+ normalize, feedback)
│   ├── code-languages/      # registro de lenguajes y perfiles de ejecución
│   ├── execution-target.ts  # recurso → curso → perfil (frontera de confianza)
│   ├── courses.ts · course-selection.ts · branding.ts
│   ├── auth.ts · db.ts · rate-limit.ts · level.ts · streak.ts · completions.ts
│   └── validation/
└── env.ts                   # todas las variables, validadas con Zod al arrancar

prisma/
├── schema.prisma            # auth + contenido + progreso + social
├── seed.ts · seed-content.ts
└── content/                 # los cursos completos en TypeScript tipado
    ├── unidad-01…10-*.ts    # curso de C++: lecciones y pasos
    ├── csharp/              # curso de POO I en C#: 8 unidades
    └── exercises/           # práctica por unidad (cpp en la raíz, csharp/)
```

---

## Decisiones que explican el resto

**El curso es la fuente de verdad del lenguaje.** Cada `Course` guarda su `language` y
su `executionProfile` (`cpp17-wandbox`, `csharp-mono-6.12`), validados contra el registro
de [`src/lib/code-languages`](../src/lib/code-languages/index.ts). De ahí salen el modo
de Monaco, el nombre del archivo, las sugerencias, el parser de errores, el compilador y
el agrupamiento de métricas. Nada de eso se infiere de un slug ni de un fence de
markdown, y un valor desconocido en la base es un error de configuración — nunca un
motivo para caer a C++.

**La frontera de confianza está en el recurso, no en el payload.** Una petición de
ejecución nombra UN recurso (paso, reto o práctica) y el código; nada más.
[`resolveExecutionTarget`](../src/lib/execution-target.ts) navega recurso → unidad →
curso y deriva el perfil. Un `language` o `profileId` en el cuerpo se rechaza con 400 en
vez de ignorarse en silencio. Falla cerrado ante recurso inexistente, despublicado,
ambiguo, con ids anidados que no corresponden, o no ejecutable (los snippets de Windows
Forms). Sin eso, un alumno podría pedir GCC para un recurso de C#, o al revés.

**El executor es un adapter, y el lenguaje va POR PETICIÓN.** `getCodeExecutor()`
devuelve una implementación de `CodeExecutor` según `CODE_EXECUTOR_PROVIDER`: Wandbox por
defecto, Piston o Judge0, públicos o self-hosted. El singleton es del PROVEEDOR; el
compilador se elige en cada llamada según el `profileId`, así que dos peticiones
concurrentes de cursos distintos no pueden pisarse. Un proveedor que no soporte el perfil
lanza `ExecutorProfileUnavailableError` en vez de compilar con otro lenguaje. Los
detalles feos —normalizar saltos de línea y espacios finales antes de comparar,
reintentar ante errores de red, traducir el estado de cada servicio a un
`ExecutionStatus` común— viven dentro del adapter.

**Windows Forms es laboratorio local, no ejecución fingida.** WinForms es un resultado
real de POO I y no se puede ejecutar honestamente en un juez de Linux. Sus ejemplos son
`runnable: false`, muestran su nota "requiere Visual Studio en Windows", no tienen
control de ejecución y el servidor rechaza cualquier intento de ejecutarlos. El dominio
que alimentan sí se prueba en el navegador, como consola.

**El feedback es específico a propósito.** `buildFeedback` compara la salida esperada con
la obtenida y dice en qué línea y columna se separan, en vez de un «incorrecto» seco. Los
casos de prueba pueden marcarse ocultos: se ejecutan, pero no muestran su entrada, para
que la solución no se ajuste al ejemplo.

**Una sola vía para el progreso.** `completeStep` y `submitExercise`
([`src/features/lessons/actions.ts`](../src/features/lessons/actions.ts)) son Server
Actions y son el único lugar donde se marca un paso, se guardan intentos, se suma XP y se
mueve la racha. No hay lógica equivalente duplicada en API routes.

**Nunca atrapar un P2002 dentro de una transacción.** En PostgreSQL, una violación de
UNIQUE aborta la transacción entera: aunque el `catch` de JavaScript se trague el error,
la siguiente consulta falla con `25P02`. Para insertar-si-no-existe se usa
`createMany({ skipDuplicates: true })` y se decide con el `count`; los helpers viven en
[`src/lib/completions.ts`](../src/lib/completions.ts) y
`tests/architecture/no-catch-inside-transaction.test.ts` falla si el antipatrón vuelve.

**El contenido en TypeScript, no en un CMS.** Ver [contenido.md](contenido.md).

**Tema oscuro por defecto.** El editor y las consolas mandan: quien va a pasar horas
leyendo código lo agradece. Hay tema claro completo.

---

## Pruebas

```bash
npm test        # Vitest
npm run lint
npm run typecheck
```

Cubren lo que se puede romper en silencio: progresión y XP, envío de retos y de
ejercicios de práctica, normalización y diff de salidas, diagnósticos del editor,
validación de C++ del lado del cliente, rate limit, niveles, solicitudes de amistad y la
regla de arquitectura sobre transacciones. La base se simula con un fake de Prisma
(`tests/helpers/fake-prisma.ts`), así que corren sin base de datos.
