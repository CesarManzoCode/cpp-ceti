import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

/**
 * Config de tests de INTEGRACIÓN contra PostgreSQL real — constraints,
 * índices parciales, locks y transacciones que un doble de prueba en
 * memoria (`tests/helpers/fake-prisma.ts`) no puede reproducir fielmente
 * (ej. la unique parcial de `friendship_period`, `pg_advisory_xact_lock`,
 * `SERIALIZABLE`). Deliberadamente chico: sólo los invariantes que de
 * verdad necesitan Postgres — el resto de la suite sigue en
 * `vitest.config.ts` sin tocar una base de datos.
 *
 * Requiere una base de datos Postgres real y las migraciones aplicadas:
 *
 *   createdb cpp_ceti_test
 *   npx dotenv -e .env.local -- prisma migrate deploy
 *   npm run test:integration
 *
 * `DATABASE_URL` se toma de `.env.local` (o del entorno) — NO de un
 * placeholder, a diferencia de `vitest.config.ts`.
 */
export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    include: ["tests/integration/**/*.{test,spec}.ts"],
    exclude: ["**/node_modules/**", "**/.next/**"],
    environment: "node",
    testTimeout: 30_000,
    // Los tests de integración comparten filas (mismo pg advisory lock
    // keyspace, mismas tablas) — correrlos en paralelo entre archivos
    // podría cruzar datos de un test con otro.
    fileParallelism: false,
  },
});
