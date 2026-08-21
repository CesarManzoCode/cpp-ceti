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
│   │   ├── page.tsx         # inicio: siguiente lección + "Tu camino"
│   │   ├── u/[unitSlug]/[lessonSlug]  # reproductor de lecciones
│   │   ├── ejercicios/      # práctica libre
│   │   ├── logros/ · amigos/ · perfil/
│   ├── invitar/             # invitaciones entre estudiantes
│   └── page.tsx             # landing
├── features/                # una carpeta por dominio, con sus acciones y componentes
│   ├── lessons/             # actions.ts (completeStep, submitExercise), queries, pasos
│   ├── practice/            # ejercicios sueltos y sus envíos
│   ├── roadmap/             # el camino del curso y su progreso
│   ├── friends/ · profile/ · bug-reports/
├── components/
│   ├── editor/              # Monaco + consola + autocompletado y diagnósticos de C++
│   ├── exercise/            # enunciado, casos de ejemplo, pistas, resultados de tests
│   ├── landing/ · layout/ · shared/ · ui/
├── lib/
│   ├── executor/            # adapters: wandbox · piston · judge0 (+ normalize, feedback)
│   ├── auth.ts · db.ts · rate-limit.ts · level.ts · streak.ts · completions.ts
│   └── validation/
└── env.ts                   # todas las variables, validadas con Zod al arrancar

prisma/
├── schema.prisma            # auth + contenido + progreso + social
├── seed.ts · seed-content.ts
└── content/                 # el curso completo en TypeScript tipado
    ├── unidad-01…10-*.ts    # lecciones y pasos
    └── exercises/           # ejercicios de práctica por unidad
```

---

## Decisiones que explican el resto

**El executor es un adapter.** `getCodeExecutor()` devuelve una implementación de
`CodeExecutor` (`execute`, `runTests`) según `CODE_EXECUTOR_PROVIDER`: Wandbox por
defecto, Piston o Judge0, públicos o self-hosted. Cambiar de proveedor es una variable de
entorno; ni las server actions ni las route handlers se enteran. Los detalles feos
—normalizar saltos de línea y espacios finales antes de comparar, reintentar ante errores
de red, traducir el estado de cada servicio a un `ExecutionStatus` común— viven dentro del
adapter.

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
