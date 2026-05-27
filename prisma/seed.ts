import { PrismaClient } from "@prisma/client";

import { seedCourse } from "./seed-content";

const db = new PrismaClient();

async function main() {
  console.log("🌱 Seeding C++ CETI database...");
  await seedCourse(db);
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
