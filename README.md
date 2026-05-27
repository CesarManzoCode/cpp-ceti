# C++ CETI

> Plataforma interactiva para aprender C++ — pensada para estudiantes del **CETI Guadalajara**.
> Filosofía: **90 % práctica, 10 % teoría.** Cada concepto se sigue de un ejercicio que TÚ escribes.

```
┌───────────────────────────────────────────────────────────────────┐
│  Lecciones cortas  →  Editor en navegador  →  Tests automáticos   │
└───────────────────────────────────────────────────────────────────┘
```

## Por qué existe

- En el CETI, los maestros explican C++ copiando código al pizarrón sin
  desmenuzar la lógica.
- Mimo, Sololearn y Codecademy no enseñan C++.
- Reprobar materias de C++ no es por flojera del estudiante — es por **falta de recursos**.

Esta plataforma es ese recurso.

---

## Stack técnico

| Capa            | Tecnología                                      |
|-----------------|-------------------------------------------------|
| Frontend        | Next.js 16 (App Router) · React 19 · TypeScript |
| UI              | Tailwind 4 · shadcn/ui · Radix · Lucide         |
| Editor          | Monaco Editor (el de VS Code)                   |
| DB              | PostgreSQL (Supabase) + Prisma ORM              |
| Auth            | Better Auth (email/password + Google OAuth)     |
| Ejecución C++   | Judge0 (RapidAPI para dev, self-hosted en prod) |
| Hosting app     | Vercel                                          |
| Hosting Judge0  | DigitalOcean Droplet (Docker)                   |

---

## Setup local

### Requisitos
- Node 20+
- Cuenta en Supabase (gratis)
- Cuenta en RapidAPI con plan free de Judge0 (opcional para empezar)

### Pasos

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env.local
# Edita .env.local con tus credenciales (ver siguiente sección)

# 3. Aplicar schema a la DB
npm run db:push

# 4. Cargar contenido del curso (Unidad 1 + Unidad 2)
npm run db:seed

# 5. Arrancar dev server
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

---

## Variables de entorno (`.env.local`)

```env
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# --- Base de datos (Supabase) ---
DATABASE_URL="postgresql://postgres:[PASS]@[HOST]:6543/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://postgres:[PASS]@[HOST]:5432/postgres"

# --- Auth ---
BETTER_AUTH_SECRET=""                # openssl rand -base64 32
BETTER_AUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID=""                  # opcional
GOOGLE_CLIENT_SECRET=""              # opcional

# --- Ejecutor de código ---
CODE_EXECUTOR_PROVIDER="judge0-rapidapi"     # o "judge0-selfhosted"
JUDGE0_RAPIDAPI_KEY=""
JUDGE0_RAPIDAPI_HOST="judge0-ce.p.rapidapi.com"
JUDGE0_SELFHOSTED_URL=""             # ej http://123.45.67.89:2358
JUDGE0_AUTH_TOKEN=""                 # opcional, para Judge0 self-hosted
```

Ver [DEPLOYMENT.md](./DEPLOYMENT.md) para guías paso a paso de:
- Crear el proyecto en Supabase y obtener las URLs.
- Configurar Google OAuth.
- Levantar Judge0 en un Droplet de DigitalOcean.
- Desplegar en Vercel.

---

## Comandos

| Comando                  | Para qué sirve                                |
|--------------------------|-----------------------------------------------|
| `npm run dev`            | Dev server con Turbopack                       |
| `npm run build`          | Build de producción                            |
| `npm run start`          | Sirve el build de producción                   |
| `npm run lint`           | ESLint                                         |
| `npm run typecheck`      | TypeScript sin emitir                          |
| `npm run db:generate`    | Regenera el cliente de Prisma                  |
| `npm run db:push`        | Aplica el schema a la DB (sin migración)       |
| `npm run db:migrate`     | Crea y aplica una migración nueva              |
| `npm run db:studio`      | Abre Prisma Studio (GUI para la DB)            |
| `npm run db:seed`        | Carga las unidades y lecciones                 |
| `npm run db:validate`    | Valida el schema de Prisma                     |

---

## Cómo agregar contenido

Todo el contenido vive en TypeScript con tipos fuertes — no hay que tocar SQL.

1. Crea (o edita) un archivo en `prisma/content/`, p. ej. `unidad-03-control.ts`.
2. Define una `UnitDefinition` con sus lecciones y pasos.
3. Regístrala en `prisma/content/index.ts`.
4. Corre `npm run db:seed`. El seed hace upsert, así que NO borra el progreso de los usuarios (solo recrea los pasos de las lecciones modificadas).

### Tipos de paso disponibles

- `theory` — markdown plano (soporta `**negrita**`, listas, tablas, bloques ```cpp).
- `code_example` — bloque de código (opcionalmente ejecutable en el navegador).
- `quiz` — pregunta de opción múltiple con explicación.
- `fill_blank` — código con espacios `{{0}}`, `{{1}}` para completar.
- `code_challenge` — reto completo con `starterCode`, `solutionCode`, `hints[]` y `testCases[]`.

Mira `prisma/content/unidad-01-primer-programa.ts` como referencia.

---

## Estructura del repo

```
src/
├── app/                       # Next.js App Router
│   ├── (auth)/                # /login y /registro (layout con branding)
│   ├── api/
│   │   ├── auth/[...all]/     # Handler de Better Auth
│   │   └── run/               # POST → ejecuta código con Judge0
│   ├── app/                   # Rutas autenticadas
│   │   ├── layout.tsx         # Sidebar + topbar
│   │   ├── page.tsx           # Dashboard
│   │   └── u/[unitSlug]/[lessonSlug]
│   ├── layout.tsx             # Root (ThemeProvider + Toaster)
│   └── page.tsx               # Landing
├── components/
│   ├── ui/                    # shadcn/ui components
│   ├── landing/               # Sections de la landing
│   ├── app/                   # Sidebar, topbar, user menu
│   ├── editor/                # CppEditor, OutputPanel, CodePlayground
│   └── lesson/                # LessonViewer y cada tipo de paso
├── hooks/
│   └── use-run-code.ts        # Hook para llamar a /api/run
├── lib/
│   ├── auth.ts                # Better Auth (server)
│   ├── auth-client.ts         # Better Auth (cliente)
│   ├── db.ts                  # Prisma singleton
│   ├── courses.ts             # Queries del curso/sidebar
│   ├── lessons.ts             # Queries de unidad/lección
│   ├── lessons-actions.ts     # Server Actions: completeStep, submitExercise
│   ├── executor/              # Adapter pattern para Judge0
│   │   ├── types.ts
│   │   ├── judge0.ts
│   │   └── index.ts
│   └── utils.ts
├── middleware.ts              # Auth route protection
└── types/
    └── lesson.ts              # Tipos de pasos de lección

prisma/
├── schema.prisma              # Schema completo (Auth + contenido + progreso)
├── seed.ts                    # Entry del seed
├── seed-content.ts            # Loader que itera el contenido
└── content/
    ├── types.ts               # Tipos de CourseDefinition
    ├── index.ts               # Registro de cursos
    └── unidad-*.ts            # Cada unidad con sus lecciones
```

---

## Decisiones técnicas notables

- **Tema oscuro por defecto.** Los desarrolladores lo prefieren — y los estudiantes que pasarán horas leyendo código también.
- **`getCodeExecutor()` con adapter pattern.** Hoy usa Judge0 vía RapidAPI; mañana puedes mover a self-hosted (DigitalOcean) cambiando `CODE_EXECUTOR_PROVIDER`. El resto de la app no se entera.
- **Server Actions para `completeStep` y `submitExercise`.** Una sola fuente de verdad para sumar XP, actualizar racha y marcar lección completada.
- **Contenido en TypeScript con tipos fuertes.** Editar `prisma/content/*.ts` da autocomplete y errores en compile time. Mucho mejor que un CMS para un curso técnico.
- **`upsert` en el seed.** Re-ejecutar `db:seed` no rompe progreso de usuarios; solo refresca el contenido.
- **Rate limit en `/api/run` (30/min por usuario).** Protege la cuota de Judge0 y evita abuso.

---

## Hecho con ❤️ en Guadalajara

C++ CETI **no es un producto oficial del CETI**. Es una iniciativa independiente
para resolver un problema real que ven todos los semestres en los pasillos.
