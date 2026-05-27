<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version (16.2.6) has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Contexto para asistentes de IA — C++ CETI

## Qué es esto
Plataforma web para que estudiantes del **CETI Guadalajara** aprendan **C++** con
lecciones interactivas y un editor de código en el navegador. Inspirado en Mimo,
pero enfocado 100% en C++ y en español.

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
- **Judge0** para compilar y ejecutar C++ (adapter pattern en `src/lib/executor/`)

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

6. **Server Actions críticas** viven en `src/lib/lessons-actions.ts`:
   - `completeStep` — única vía para marcar un paso completado y mover XP.
   - `submitExercise` — corre tests y guarda intentos.
   No dupliques esa lógica en API routes.

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
