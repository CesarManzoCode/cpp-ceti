import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),

  // Reglas de arquitectura del proyecto.
  {
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      // 1) Todas las lecturas de process.env DEBEN pasar por src/env.ts.
      //    El refactor del Sprint 1 centralizó la validación con Zod; cualquier
      //    nueva lectura suelta puede ser undefined en producción y romper en
      //    runtime sin aviso.
      "no-restricted-syntax": [
        "error",
        {
          selector:
            "MemberExpression[object.object.name='process'][object.property.name='env']",
          message:
            "No leas process.env directamente. Importa { env } de '@/env' o agrega la variable al schema de env.ts.",
        },
        {
          selector:
            "MemberExpression[object.name='process'][property.name='env']:not([parent.type='MemberExpression'])",
          message:
            "No leas process.env directamente. Importa { env } de '@/env'.",
        },
      ],

      // 2) Console.* fuera del logger sólo molesta en consola y se pierde en
      //    producción. Si necesitas log, usa el logger estructurado.
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },

  // El propio env.ts y el logger SÍ necesitan tocar process.env / console.
  {
    files: ["src/env.ts", "src/lib/logger.ts"],
    rules: {
      "no-restricted-syntax": "off",
      "no-console": "off",
    },
  },

  // auth-client.ts es "use client": no puede importar env.ts (server-only).
  // Sólo lee NEXT_PUBLIC_*, que Next.js inlinea al build (no riesgo runtime).
  {
    files: ["src/lib/auth-client.ts"],
    rules: {
      "no-restricted-syntax": "off",
    },
  },

  // Error boundaries y archivos de seed pueden usar console por ahora
  // (los error boundaries son client components; logger es server-only).
  {
    files: ["src/app/**/error.tsx", "src/app/**/global-error.tsx"],
    rules: {
      "no-console": "off",
    },
  },
]);

export default eslintConfig;
