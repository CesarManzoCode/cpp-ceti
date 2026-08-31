<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version (16.2.6) has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Contexto para asistentes de IA — Plataforma de Programación CETI

## Qué es esto
Plataforma web para que estudiantes del **CETI Guadalajara** aprendan a programar
con lecciones interactivas y un editor de código en el navegador. Inspirado en
Mimo, pero siguiendo el temario del CETI y en español.

Dos cursos hoy: **C++ desde cero** (`cpp-desde-cero`) y **Programación Orientada
a Objetos I con C#** (`csharp-poo-1`).

## Filosofía
**90% práctica, 10% teoría.** Cada concepto se sigue inmediatamente de
ejercicios donde el usuario escribe código real. **No** somos un libro de teoría
con un editor anexo: somos un sistema de práctica con teoría justo-a-tiempo.

## Stack
- **Next.js 16.2.6** (App Router, Turbopack)
- **React 19** · **TypeScript 5**
- **Tailwind 4** (con `@theme inline` en CSS, NO usa `tailwind.config.ts`)
- **shadcn/ui** (componentes copiados en `src/components/ui/`, NO instalados como paquete)
- **Prisma 6** + **PostgreSQL** (Supabase)
- **Better Auth 1.6** (NO NextAuth; tablas custom en el schema)
- **Monaco Editor** para el editor C++
- **Judge0 / Wandbox / Piston** para compilar y ejecutar (adapter pattern en
  `src/lib/executor/`), con un perfil de ejecución POR CURSO

## Cosas que NO son obvias

1. **`prisma/content/*.ts` es la fuente de verdad del contenido.** No edites
   las tablas directamente en Supabase: añade contenido en TypeScript y corre
   `npm run db:seed`. El seed hace upsert y no destruye el progreso de usuarios.

2. **El executor de código es un adapter.** Hoy: Judge0 vía RapidAPI o
   self-hosted (DigitalOcean). Cambiar `CODE_EXECUTOR_PROVIDER` en `.env` basta;
   no toques las server actions ni las route handlers.

3. **Las migraciones del schema usan `dotenv-cli`** porque Prisma CLI no lee
   `.env.local` por defecto. Usa siempre `npm run db:*` (NO `npx prisma` directo).

4. **`middleware.ts` da un warning en Next 16** ("usa proxy en su lugar"). El
   warning es informativo: middleware sigue funcionando. Migrar a `proxy.ts` es
   una tarea futura cuando Better Auth confirme soporte oficial.

5. **El cookiePrefix `cpp-ceti`** está configurado en `auth.ts` y en
   `middleware.ts`. Si lo cambias, hazlo en AMBOS lugares.

6. **El sistema visual vive en `globals.css` y en `components/ui/bricks.tsx`.**
   Los tokens (color, radio, sombra, tipografía) son variables CSS; los
   estilos de elemento van dentro de `@layer base` y los helpers de clase
   dentro de `@layer components`, para que cualquier utilidad de Tailwind
   pueda sobrescribirlos. Si escribes una regla fuera de esas capas, ganará
   siempre y romperás overrides puntuales.

7. **Los bloques (`BrickRow` / `BrickColumn`) son el elemento firma.**
   Una pieza = una lección (o un paso, o un ejercicio). Se usan en la ruta
   del curso, en el rail, en la cabecera de unidad y en el reproductor de
   lecciones. Si añades una secuencia con progreso, reutilízalos en vez de
   inventar otra barra.

8. **Server Actions críticas** viven en `src/lib/lessons-actions.ts`:
   - `completeStep` — única vía para marcar un paso completado y mover XP.
   - `submitExercise` — corre tests y guarda intentos.
   No dupliques esa lógica en API routes.

9. **Nunca atrapes un P2002 dentro de `db.$transaction()`.** En PostgreSQL,
   una violación de UNIQUE aborta la transacción completa: aunque el `catch`
   de JavaScript se trague el error, la siguiente consulta de esa misma
   transacción falla con `25P02 current transaction is aborted`. Para
   insertar-si-no-existe usa
   `createMany({ data: [...], skipDuplicates: true })` (→ `INSERT ... ON
   CONFLICT DO NOTHING`) y decide con el `count`. Los helpers de "primer
   aprobado" viven en `src/lib/completions.ts`, y
   `tests/architecture/no-catch-inside-transaction.test.ts` falla si el
   antipatrón vuelve.

10. **La telemetría de producto tiene contrato escrito.** La taxonomía de
   eventos vive en `src/lib/analytics/events.ts` (enum cerrado + Zod), la
   escritura idempotente en `src/lib/analytics/record.ts`, y la semántica
   exacta de CADA métrica en `docs/product-analytics.md`. Antes de agregar un
   evento o de interpretar un número del panel, lee ese documento. Dos trampas
   ya documentadas ahí: `durationMs` de los intentos es **latencia del
   ejecutor** (no tiempo de resolución), y `UserStepProgress.completionCount`
   **no** son intentos del estudiante.

11. **`StudySession` mide tiempo activo aproximado, no tiempo de pared.**
   `engagedMs` sólo acumula con heartbeats (pestaña visible + actividad
   reciente), acotados en SQL. Las sesiones huérfanas se cierran en su último
   latido. No sumes `endedAt - startedAt` como si fuera estudio.

12. **El panel interno (`/app/admin`) se autoriza en el servidor.**
   `requireAdmin()` / `requireAdminPage()` en CADA página y CADA Server Action.
   Un layout no protege un POST directo a una action.

13. **El CURSO es la fuente de verdad del lenguaje y del compilador.**
   `Course.language` + `Course.executionProfile`, validados contra el registro
   de `src/lib/code-languages`. De ahí salen el modo de Monaco, el nombre del
   archivo, las sugerencias, los diagnósticos, el compilador y el agrupamiento
   de métricas. NUNCA se infiere de un slug, de un fence de markdown ni de
   nada que mande el cliente, y un valor desconocido es un error de
   configuración — jamás un motivo para caer a C++.

14. **Toda ejecución nombra UN recurso; el servidor deriva el resto.**
   `resolveExecutionTarget` (`src/lib/execution-target.ts`) navega recurso →
   unidad → curso. `/api/run` RECHAZA con 400 un `language`, `profileId` o
   `compiler` en el cuerpo en vez de ignorarlo. Falla cerrado ante recurso
   inexistente, despublicado, ambiguo, con ids que no corresponden, o no
   ejecutable. Si agregas una superficie que ejecute código, pasa por ahí.

15. **Las rutas canónicas llevan el curso: `/app/c/[courseSlug]/...`**
   Las URLs viejas sin curso (`/app/u/...`, `/app/ejercicios/...`) se conservan
   PARA SIEMPRE y el middleware las redirige con 308 al curso de C++. No
   renombres slugs de C++ ni borres esas rutas: hay marcadores y enlaces
   compartidos apuntando ahí.

16. **Windows Forms NO se ejecuta en el navegador.**
   Sus ejemplos son `runnable: false`, llevan `localOnlyNote` y el servidor
   rechaza ejecutarlos. El dominio que alimentan sí se prueba como consola.
   Nunca "simules" una GUI para poder calificarla.

17. **Antes de publicar contenido con código, córrelo.**
   `LANG=C.UTF-8 npx tsx scripts/verify-content.ts [curso]` compila y ejecuta
   todo el contenido ejecutable contra sus casos, visibles y ocultos. El locale
   UTF-8 no es opcional: sin él, cualquier salida con acentos falla por el
   entorno y no por el contenido.

## Convenciones de código

- Componentes shadcn van en `src/components/ui/` (no en `ui/shadcn/` u otro).
- Server functions de queries → `src/lib/*.ts`.
- Server Actions → `src/lib/*-actions.ts` con `"use server"`.
- Páginas autenticadas viven bajo `src/app/app/`.
- El idioma del producto es **español de México**. Mantén textos en es-MX.

## Si necesitas correr migraciones

```bash
npm run db:migrate -- --name describe_el_cambio
```

NO uses `prisma migrate` directo — no lee `.env.local`.

## Si necesitas añadir un componente shadcn

Los componentes ya están en `src/components/ui/`. Si necesitas uno nuevo,
copia el código de la doc oficial de shadcn (no hagas `npx shadcn add` porque
nuestra config de Tailwind 4 puede sobreescribirse). Asegúrate de:
1. Cambiar el cn import a `@/lib/utils`.
2. Usar nuestras variables CSS (`bg-card`, `text-foreground`, etc.).

## Recursos importantes

- README.md — overview del proyecto
- DEPLOYMENT.md — guía paso a paso de despliegue (Supabase + DigitalOcean + Vercel)
- prisma/schema.prisma — modelo de datos completo
- prisma/content/types.ts — forma del contenido del curso
