# Guía de despliegue — C++ CETI

Esta guía te lleva de cero a tener la plataforma corriendo en producción.

**Tiempo estimado total: 45-60 min** (la mayor parte es esperar provisionar servicios).

```
Supabase (DB)  ──┐
                 ├──► Vercel (Next.js)
DigitalOcean ────┘
(Judge0)
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
npm run db:seed     # carga las Unidades 1 y 2 con todas sus lecciones
```

Verifica en Supabase (**Table Editor**) que aparecieron las tablas `course`,
`unit`, `lesson`, `lesson_step`, `exercise`, `test_case`, `user`, `session`, etc.

---

## 5. Levantar Judge0 en un Droplet de DigitalOcean

**Recomendado para producción.** En desarrollo puedes empezar con RapidAPI
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

### Actualizar contenido

1. Edita o agrega un archivo en `prisma/content/`.
2. Push a `main`.
3. Vercel hace deploy automático.
4. **Importante:** Re-ejecuta `npm run db:seed` localmente (o via GitHub Action) para que la DB tenga el contenido nuevo. Los upserts no afectan el progreso de los usuarios.

### Migraciones del schema

Si cambias `prisma/schema.prisma`:

```bash
npm run db:migrate -- --name describe_your_change
git add prisma/migrations/
git commit -m "feat(db): describe your change"
```

En el deploy de Vercel, configura un build command:

```
prisma migrate deploy && next build
```

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
