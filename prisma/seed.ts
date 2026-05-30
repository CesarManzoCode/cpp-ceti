import { PrismaClient } from "@prisma/client";

import { seedCourse } from "./seed-content";
import { seedPracticeExercises } from "./seed-practice";

// Desde Sprint 3, el seed NO es parte de `npm run build`. Se corre aparte
// con `npm run db:seed` (lee `.env.local`) o vía workflow manual con secrets.
// Si lo lanzas sin DATABASE_URL en el entorno, salimos sin error para que
// los pipelines que invoquen este script en CI sin DB no fallen.
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
