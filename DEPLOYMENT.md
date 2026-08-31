# Guía de despliegue — Plataforma de Programación CETI

Esta guía te lleva de cero a tener la plataforma corriendo en producción.

**Tiempo estimado total: 45-60 min** (la mayor parte es esperar provisionar servicios).

```
Supabase (DB)  ──┐
                 ├──► Vercel (Next.js)
Ejecutor C++  ───┘
(Wandbox público por defecto; Piston o Judge0 self-hosted si lo prefieres)
```

---

## 1. Crear el proyecto en Supabase (DB + auth backend)

1. Ve a [supabase.com](https://supabase.com) y crea un proyecto nuevo.
2. Apunta el password de Postgres que generaste — lo vas a necesitar.
3. En **Project Settings → Database → Connection string**, copia:
   - **Transaction** (con `pgbouncer=true`) → será tu `DATABASE_URL`.
   - **Session** (puerto 5432 directo) → será tu `DIRECT_URL`.
4. Reemplaza `[YOUR-PASSWORD]` por el password real.

Ejemplo de cómo deben quedar:

```env
DATABASE_URL="postgresql://postgres.xxxxxxxxxxxx:TU-PASS@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://postgres.xxxxxxxxxxxx:TU-PASS@aws-0-us-east-1.pooler.supabase.com:5432/postgres"
```

> ⚠️ Better Auth maneja sus propias tablas — **NO** uses Supabase Auth, solo
> Supabase como base de datos Postgres.

---

## 2. (Opcional) Configurar Google OAuth

Si quieres que los estudiantes entren con su cuenta de Google:

1. [Google Cloud Console](https://console.cloud.google.com/) → **APIs & Services → Credentials**.
2. **Create credentials → OAuth client ID → Web application**.
3. **Authorized JavaScript origins**: `http://localhost:3000` y tu URL de Vercel.
4. **Authorized redirect URIs**:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://tu-app.vercel.app/api/auth/callback/google`
5. Copia el **Client ID** y **Client Secret**.

---

## 3. Generar el secret de Better Auth

```bash
openssl rand -base64 32
```

Ese string es tu `BETTER_AUTH_SECRET`.

---

## 4. Aplicar el schema y cargar contenido (local)

Con tu `.env.local` ya configurado:

```bash
npm run db:push     # crea las tablas en Supabase
npm run db:seed     # carga los dos cursos con todo su contenido
```

Verifica en Supabase (**Table Editor**) que aparecieron las tablas `course`,
`unit`, `lesson`, `lesson_step`, `exercise`, `test_case`, `user`, `session`, etc.

Los dos cursos deben quedar así:

| slug | language | executionProfile | unidades | lecciones | prácticas |
| --- | --- | --- | --- | --- | --- |
| `cpp-desde-cero` | `cpp` | `cpp17-wandbox` | 10 | 67 | 80 |
| `csharp-poo-1` | `csharp` | `csharp-mono-6.12` | 8 | 30 | 32 |

---

## 4.1 Actualizar una base que YA tenía sólo C++

La migración `add_course_language` es la zona crítica de este cambio: agrega el
lenguaje y el perfil al curso, y hace a cada práctica propiedad de un curso.
Está escrita por etapas y **aborta con un mensaje explícito** en vez de adivinar:

- Agrega las columnas nullable primero.
- Rellena el curso legacy buscándolo por su slug estable `cpp-desde-cero`. Si no
  existe, o si hay otros cursos sin metadatos, **falla** y pide un mapeo explícito.
- Verifica que todas las prácticas quedaron asignadas y que ninguna apunta a una
  unidad inexistente.
- Sólo entonces pone `NOT NULL`, crea los índices y las llaves foráneas.

Ninguna fila se borra ni se recrea. Antes de aplicarla en producción:

```bash
# 1. Copia de seguridad (Supabase: Database → Backups, o pg_dump)
pg_dump "$DATABASE_URL" > backup-antes-de-migrar.sql

# 2. Ensaya sobre una copia con datos reales y compara conteos e ids
npm run db:migrate:deploy
npm run db:seed
```

**Rollback:** si la migración aborta, no dejó cambios a medias (cada etapa corre
en su propia transacción y las verificaciones van antes de endurecer el schema).
Si hay que revertir después de aplicarla, restaura el respaldo: no hay migración
"down" automática, a propósito — deshacer la propiedad por curso de las prácticas
requiere decidir qué hacer con el contenido de C# que ya se sembró.

Efecto esperado y **normal**: la primera corrida del seed genera UNA revisión de
contenido nueva por cada paso, ejercicio y práctica, porque el lenguaje y el
perfil de ejecución pasaron a formar parte del hash. Las revisiones anteriores se
conservan y ningún progreso se ve afectado. A partir de la segunda corrida, el
seed no genera revisiones nuevas.

---

## 5. Levantar Judge0 en un Droplet de DigitalOcean

**Este paso es opcional.** El proveedor por defecto del ejecutor es la API pública
de **Wandbox** (`CODE_EXECUTOR_PROVIDER="wandbox"`), que no pide llave ni tarjeta y
sirve para arrancar en producción. Ver todos los proveedores en
[docs/configuracion.md](docs/configuracion.md).

Judge0 self-hosted es la opción de control total: tu propia cola, tus propios
límites y sin depender de un servicio público. En desarrollo también existe RapidAPI
(`CODE_EXECUTOR_PROVIDER="judge0-rapidapi"`), pero ese plan tiene límite de
50 ejecuciones/día.

### 5.1 Crear el Droplet

1. DigitalOcean → **Create → Droplets**.
2. Imagen: **Ubuntu 24.04 LTS**.
3. Plan: **Basic / Regular / 2 GB RAM / 1 CPU** (~$12/mes — Judge0 necesita 2 GB para correr cómodo).
4. Región: la más cercana a tus usuarios (San Francisco o NYC para México).
5. Crea una **SSH key** y agrégala.

### 5.2 Instalar Docker + Judge0

Conéctate por SSH al Droplet:

```bash
ssh root@TU.IP.DEL.DROPLET
```

Instala Docker:

```bash
apt update && apt install -y docker.io docker-compose-v2
systemctl enable --now docker
```

**Habilitar cgroup v1** (Judge0 lo requiere). Edita `/etc/default/grub`:

```bash
nano /etc/default/grub
```

Agrega `systemd.unified_cgroup_hierarchy=0` al `GRUB_CMDLINE_LINUX_DEFAULT`:

```
GRUB_CMDLINE_LINUX_DEFAULT="systemd.unified_cgroup_hierarchy=0"
```

Luego:

```bash
update-grub && reboot
```

Cuando el droplet reinicie, vuelve a conectarte y prepara Judge0:

```bash
mkdir judge0 && cd judge0

# Descargar configuraciones oficiales
wget https://github.com/judge0/judge0/releases/download/v1.13.1/judge0-v1.13.1.zip
unzip judge0-v1.13.1.zip && cd judge0-v1.13.1

# Generar passwords seguros
echo "POSTGRES_PASSWORD=$(openssl rand -base64 32)" > judge0.conf.local
echo "REDIS_PASSWORD=$(openssl rand -base64 32)" >> judge0.conf.local
cat judge0.conf judge0.conf.local > judge0.conf.combined && mv judge0.conf.combined judge0.conf

# Configurar auth token para que solo TÚ puedas usar tu Judge0
TOKEN=$(openssl rand -hex 24)
echo "AUTHN_TOKEN=$TOKEN" >> judge0.conf
echo "Guarda este TOKEN: $TOKEN"

# Levantar
docker compose up -d db redis
sleep 10
docker compose up -d
```

### 5.3 Probarlo

```bash
curl http://localhost:2358/about
```

Debes ver el JSON con la versión de Judge0.

### 5.4 Abrir el puerto y configurar firewall

```bash
ufw allow 22
ufw allow 2358
ufw --force enable
```

### 5.5 Anotar las credenciales para tu `.env`

```env
CODE_EXECUTOR_PROVIDER="judge0-selfhosted"
JUDGE0_SELFHOSTED_URL="http://TU.IP.DEL.DROPLET:2358"
JUDGE0_AUTH_TOKEN="el-token-que-generaste-arriba"
```

> 🔒 **Producción real**: pon Judge0 detrás de un proxy con TLS (Caddy es ideal),
> usa un dominio (`judge.tu-app.com`) y mantén el `AUTH_TOKEN` rotado.

---

## 6. Desplegar en Vercel

1. Sube tu repo a GitHub.
2. [vercel.com/new](https://vercel.com/new) → importa tu repo.
3. Framework: **Next.js** (autodetectado).
4. En **Environment Variables**, agrega TODAS las del `.env.local` (excepto las dummy):
   - `NEXT_PUBLIC_APP_URL` → `https://tu-app.vercel.app`
   - `DATABASE_URL`, `DIRECT_URL`
   - `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` (también la URL de Vercel)
   - `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` (si configuraste OAuth)
   - `CODE_EXECUTOR_PROVIDER`, `JUDGE0_SELFHOSTED_URL`, `JUDGE0_AUTH_TOKEN`
5. **Deploy.**

Cuando termine, abre la URL y prueba:
- Regístrate → `/registro`
- Inicia una lección y completa el primer ejercicio
- Verifica que tu **racha** y **XP** se actualicen

---

## 7. Mantenimiento

### Antes de publicar el curso de C#

- [ ] `CODE_EXECUTOR_PROVIDER` soporta el perfil `csharp-mono-6.12`. Con Wandbox
      no hace falta configurar nada; con Piston hace falta `PISTON_CSHARP_VERSION`
      y con Judge0 `JUDGE0_CSHARP_LANGUAGE_ID` verificado contra el `/languages`
      de esa instancia. Sin eso, C# queda deshabilitado con un error de entorno
      (nunca se compila con GCC).
- [ ] **Prueba de acentos.** Varias salidas esperadas del curso llevan acentos
      (`Código: …`). Corre una práctica con acentos contra el proveedor real y
      compara la salida: Mono los rompe si el proceso no está en UTF-8.
- [ ] Recorre una lección y una práctica de cada curso con una cuenta real.
- [ ] Comprueba que una URL vieja (`/app/u/primer-programa`) redirige con 308 al
      curso de C++.

### Build de Vercel (recomendado)

A partir de Sprint 3, `npm run build` **solo** compila la app:

```
prisma generate && next build
```

El seed y las migraciones se aplican fuera del build para no encadenar
escrituras a la DB con cada deploy.

**Configura el Build Command de Vercel** (Project Settings → Build & Output
Settings) a:

```
prisma migrate deploy && npm run build
```

Esto aplica las migraciones pendientes antes de compilar. Si una migración
falla, el deploy falla — y nunca se publica una versión incompatible con la DB.

### Actualizar contenido

1. Edita o agrega un archivo en `prisma/content/`.
2. Verifica el código nuevo antes de publicarlo:
   `LANG=C.UTF-8 npx tsx scripts/verify-content.ts` compila y ejecuta todo el
   contenido ejecutable contra sus casos de prueba (necesita `g++` para C++ y
   `mcs`/`mono` para C#).
3. Push a `main` → Vercel hace deploy.
4. Después del deploy, corre el seed:
   - **Desde tu máquina**: `npm run db:seed` (lee `.env.local` apuntando a prod).
   - **O dispara un workflow manual** en GitHub Actions que corra
     `dotenv -e .env.local -- tsx prisma/seed.ts` con secrets.

Los seeds son **upserts idempotentes** — repetirlos no destruye progreso de
usuarios. Los pasos de lección se preservan por `(lessonId, order)` (ver
Sprint 1) y los test cases se reemplazan sin tocar los attempts.

### Migraciones del schema

Si cambias `prisma/schema.prisma`:

```bash
npm run db:migrate -- --name describe_your_change
git add prisma/migrations/
git commit -m "feat(db): describe your change"
git push
```

El Build Command de Vercel (`prisma migrate deploy && npm run build`) las
aplica automáticamente al desplegar. También puedes correrlas manualmente
con `npm run db:migrate:deploy`.

### Healthcheck

`GET /api/health` devuelve el estado de la app y la DB:

```bash
curl https://tu-app.vercel.app/api/health
# 200 OK → { "ok": true, "db": "up", "time": "2026-05-29T18:00:00.000Z" }
# 503    → { "ok": false, "db": "down", "time": "..." }
```

Apunta cualquier servicio de monitoreo (UptimeRobot, Better Stack) a esa URL
con un check cada 1–5 min. Vercel ya tiene su propio liveness check del
deploy; este endpoint además verifica la conectividad a la DB.

### Rollback

Si una versión rompe producción:

**1. Rollback de la app (Vercel):**

```bash
vercel rollback        # interactivo, lista los últimos deploys
# o desde el dashboard: Deployments → ... → Promote to Production
```

**2. Si rollbackeaste *y* habías aplicado una migración nueva**:

La DB ya tiene cambios que el código viejo no espera. Dos rutas:

- **Forward fix (recomendado)**: aplica un *patch migration* aditivo que
  resuelva el problema sin revertir lo aplicado.
- **Revert manual** (raro): escribe SQL inverso y marca la migración como
  revertida en el ledger:

  ```bash
  # 1. Ejecuta el SQL de reverso vía Supabase SQL Editor.
  # 2. Marca la migración como rolled-back para que Prisma no la re-aplique.
  npx prisma migrate resolve --rolled-back NOMBRE_DE_LA_MIGRATION
  ```

> 🚫 **Nunca corras `prisma migrate reset` en producción** — vacía la BD.

### Monitoreo del Judge0

```bash
ssh root@TU.IP "cd judge0/judge0-v1.13.1 && docker compose logs -f judge0-server"
```

Si Judge0 muere, redéjalo con `docker compose up -d`.

---

## Costos estimados (mensuales)

| Servicio                       | Free tier | Plan inicial recomendado |
|--------------------------------|-----------|--------------------------|
| Vercel                         | Sí        | $0 (Hobby)               |
| Supabase                       | Sí        | $0 (free tier)           |
| DigitalOcean (Judge0)          | —         | ~$12 (Droplet 2GB)       |
| **Total para empezar**         |           | **~$12/mes**             |

Cuando crezcas: Supabase Pro ($25) y un droplet más grande para Judge0 ($24).
