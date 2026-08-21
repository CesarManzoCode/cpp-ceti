# Configuración y variables de entorno

Todas las variables se validan al arrancar con Zod en [`src/env.ts`](../src/env.ts): si
falta una o es inconsistente, el proceso muere con un mensaje que dice cuál. Copia
[`.env.example`](../.env.example) a `.env.local` y complétalo.

---

## Mínimo para arrancar

```env
NEXT_PUBLIC_APP_URL="http://localhost:3000"

DATABASE_URL="postgresql://…"     # pooler (Supabase: puerto 6543)
DIRECT_URL="postgresql://…"       # conexión directa, para migraciones

BETTER_AUTH_SECRET=""             # openssl rand -base64 32
BETTER_AUTH_URL="http://localhost:3000"
```

Con eso corre todo: el ejecutor de C++ usa Wandbox por defecto, que es público y no pide
llave.

Google OAuth es opcional (`GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET`): si sólo pones uno
de los dos, la validación falla a propósito. Sin ellos, el botón de Google no aparece.

---

## Ejecución de código

`CODE_EXECUTOR_PROVIDER` elige el adapter que compila y corre el C++ del estudiante.
El resto de la app no cambia: `getCodeExecutor()` devuelve siempre la misma interfaz
(`execute`, `runTests`).

| Valor | Qué usa | Configuración |
| --- | --- | --- |
| `wandbox` *(default)* | API pública de Wandbox | Nada. Opcional: `WANDBOX_URL`, `WANDBOX_COMPILER`, `WANDBOX_COMPILER_OPTIONS` |
| `piston` | API pública de Piston (emkc.org) | Opcional `PISTON_CPP_VERSION`. Desde 2026 la API pública pide whitelist |
| `piston-selfhosted` | Tu propia instancia de Piston | `PISTON_URL` obligatorio |
| `judge0-rapidapi` | Judge0 vía RapidAPI | `JUDGE0_RAPIDAPI_KEY` obligatorio, `JUDGE0_RAPIDAPI_HOST` |
| `judge0-selfhosted` | Judge0 en tu servidor | `JUDGE0_SELFHOSTED_URL` obligatorio, `JUDGE0_AUTH_TOKEN` opcional |

Cada adapter traduce su respuesta al mismo `ExecutionResult` (estado, stdout, stderr,
salida del compilador, tiempo y memoria), normaliza la salida antes de comparar contra lo
esperado y aplica reintentos ante errores de red. Ver
[`src/lib/executor/`](../src/lib/executor).

`POST /api/run` tiene rate limit por usuario (30 ejecuciones por minuto) para proteger la
cuota del servicio de ejecución.

---

## Comandos de base de datos

Prisma CLI no lee `.env.local` por su cuenta, así que todos los comandos pasan por
`dotenv-cli`. Usa siempre los scripts de npm, no `npx prisma` directo:

| Comando | Para qué |
| --- | --- |
| `npm run db:push` | Aplica el schema sin crear migración (desarrollo) |
| `npm run db:migrate` | Crea y aplica una migración nueva |
| `npm run db:migrate:deploy` | Aplica migraciones pendientes (producción) |
| `npm run db:seed` | Carga o refresca el curso completo (`upsert`, no borra progreso) |
| `npm run db:studio` | Prisma Studio |
| `npm run db:generate` | Regenera el cliente de Prisma |
| `npm run db:validate` | Valida el schema |

Para el despliegue completo (Supabase, Google OAuth, servicio de ejecución y Vercel) ver
[DEPLOYMENT.md](../DEPLOYMENT.md).
