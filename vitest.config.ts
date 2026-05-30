import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Config compacto para tests de lib + components puros. La mayoría de specs
// corren en node; los que tocan DOM declaran `// @vitest-environment happy-dom`
// en la cabecera del archivo (más rápido que setear happy-dom global).
export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    include: ["src/**/*.{test,spec}.{ts,tsx}", "tests/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["**/node_modules/**", "**/.next/**"],
    environment: "node",
    // Mínimas env vars que src/env.ts requiere al boot. Cualquier módulo que
    // se importe indirectamente desde un test (logger, executor, etc.) las
    // necesita para no morir. Estos NO son secretos reales — sólo placeholders.
    env: {
      NODE_ENV: "test",
      DATABASE_URL: "postgresql://test:test@localhost:5432/test",
      BETTER_AUTH_SECRET: "test-secret-test-secret-test-secret-32",
      BETTER_AUTH_URL: "http://localhost:3000",
      NEXT_PUBLIC_APP_URL: "http://localhost:3000",
      CODE_EXECUTOR_PROVIDER: "wandbox",
    },
    clearMocks: true,
    restoreMocks: true,
  },
});
