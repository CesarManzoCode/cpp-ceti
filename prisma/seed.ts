import { PrismaClient } from "@prisma/client";

import { seedCourse } from "./seed-content";
import { seedPracticeExercises } from "./seed-practice";

// El seed corre como parte del build (ver script "build" en package.json) para
// que el contenido de la BD quede sincronizado en cada deploy de Vercel.
// En entornos sin BD configurada (p. ej. `npm run build` local sin .env.local)
// no hay DATABASE_URL: se omite en vez de fallar. En Vercel/CI la variable está
// presente y el seed corre normalmente.
if (!process.env.DATABASE_URL) {
  console.log("⏭️  Sin DATABASE_URL: se omite el seed.");
  process.exit(0);
}

const db = new PrismaClient();

async function main() {
  console.log("🌱 Seeding C++ CETI database...");
  await seedCourse(db);
  await seedPracticeExercises(db);
  console.log("✅ Seed completed.");
}

main()
  .catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
