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

Con eso corre todo: Wandbox es el proveedor por defecto, es público, no pide llave y
soporta los dos perfiles de ejecución (C++ y C#) sin configuración extra.

Google OAuth es opcional (`GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET`): si sólo pones uno
de los dos, la validación falla a propósito. Sin ellos, el botón de Google no aparece.

---

## Ejecución de código

Hay **un proveedor** y **dos perfiles de ejecución**. El perfil lo decide el CURSO del
recurso, nunca el cliente:

| Perfil | Curso | Toolchain |
| --- | --- | --- |
| `cpp17-wandbox` | `cpp-desde-cero` | GCC 13.2 con `-std=c++17 -O0 -Wall`, archivo `main.cpp` |
| `csharp-mono-6.12` | `csharp-poo-1` | Mono 6.12, archivo `Program.cs`, sin flags |

`CODE_EXECUTOR_PROVIDER` elige el adapter. El resto de la app no cambia:
`getCodeExecutor()` devuelve siempre la misma interfaz, y `getExecutorForProfile()`
falla si el proveedor configurado no puede con el perfil pedido.

| Valor | Qué usa | Configuración |
| --- | --- | --- |
| `wandbox` *(default)* | API pública de Wandbox | Nada. Soporta los dos perfiles. Opcional: `WANDBOX_URL`, `WANDBOX_CPP_COMPILER`, `WANDBOX_CPP_OPTIONS`, `WANDBOX_CSHARP_COMPILER`, `WANDBOX_CSHARP_OPTIONS` |
| `piston` | API pública de Piston (emkc.org) | Opcional `PISTON_CPP_VERSION`. **C# sólo con `PISTON_CSHARP_VERSION`**. Desde 2026 la API pública pide whitelist y responde 401 |
| `piston-selfhosted` | Tu propia instancia de Piston | `PISTON_URL` obligatorio; para C#, `PISTON_CSHARP_VERSION` |
| `judge0-rapidapi` | Judge0 vía RapidAPI | `JUDGE0_RAPIDAPI_KEY` obligatorio, `JUDGE0_RAPIDAPI_HOST`. Para C#, `JUDGE0_CSHARP_LANGUAGE_ID` |
| `judge0-selfhosted` | Judge0 en tu servidor | `JUDGE0_SELFHOSTED_URL` obligatorio, `JUDGE0_AUTH_TOKEN` opcional. Para C#, `JUDGE0_CSHARP_LANGUAGE_ID` |

`WANDBOX_COMPILER` y `WANDBOX_COMPILER_OPTIONS` siguen funcionando como alias del perfil
de C++, para no romper despliegues existentes; los nombres específicos ganan.

**Si un perfil no está configurado, ese lenguaje queda deshabilitado** con un error de
entorno visible. Nunca se compila con el compilador del otro: una fuente de C# enviada a
GCC no da un error entendible, y peor, podría dar una calificación falsa. Los ids
numéricos de Judge0 son específicos de cada instancia, así que para C# **no hay default**:
verifícalo contra el `/languages` de TU instancia.

Cada adapter traduce su respuesta al mismo `ExecutionResult` (estado, stdout, stderr,
salida del compilador, tiempo y memoria), normaliza la salida antes de comparar contra lo
esperado y aplica reintentos ante errores de red. Ver
[`src/lib/executor/`](../src/lib/executor).

> **Locale del proveedor.** Varias salidas esperadas del curso de C# llevan acentos
> (`Código: …`, `José`). Mono los maneja bien con locale UTF-8 y los rompe sin él.
> Antes de publicar el curso, corre un ejercicio con acentos contra el proveedor
> configurado y compara la salida.

`POST /api/run` tiene rate limit por usuario (30 ejecuciones por minuto) para proteger la
cuota del servicio de ejecución. Su cuerpo nombra **exactamente un recurso** y el código:
no acepta `language`, `profileId`, `compiler` ni nada equivalente — esos campos se
rechazan con 400 en vez de ignorarse. El servidor deriva el perfil del curso del
recurso.

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
