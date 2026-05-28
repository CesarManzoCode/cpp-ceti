import { db } from "@/lib/db";

export interface PracticeListItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  xpReward: number;
  position: number;
  passed: boolean;
  attempts: number;
}

export interface PracticeUnitGroup {
  unitSlug: string;
  unitTitle: string;
  unitIcon: string | null;
  unitOrder: number;
  exercises: PracticeListItem[];
}

/**
 * Devuelve los ejercicios agrupados por unidad, con el estado del usuario.
 * El orden de los grupos sigue el orden de las unidades del curso.
 */
export async function getPracticeGroups(
  userId: string,
): Promise<PracticeUnitGroup[]> {
  const [exercises, units, attempts] = await Promise.all([
    db.practiceExercise.findMany({
      where: { published: true },
      orderBy: [{ unitSlug: "asc" }, { position: "asc" }],
      select: {
        id: true,
        slug: true,
        unitSlug: true,
        title: true,
        description: true,
        difficulty: true,
        xpReward: true,
        position: true,
      },
    }),
    db.unit.findMany({
      select: { slug: true, title: true, icon: true, order: true },
      orderBy: { order: "asc" },
    }),
    db.userPracticeAttempt.findMany({
      where: { userId },
      select: { exerciseId: true, passed: true },
    }),
  ]);

  const passedSet = new Set<string>();
  const attemptCount = new Map<string, number>();
  for (const a of attempts) {
    attemptCount.set(a.exerciseId, (attemptCount.get(a.exerciseId) ?? 0) + 1);
    if (a.passed) passedSet.add(a.exerciseId);
  }

  const unitMeta = new Map(
    units.map((u) => [
      u.slug,
      { title: u.title, icon: u.icon, order: u.order },
    ]),
  );

  // Agrupa por unitSlug preservando el orden del curso.
  const groups = new Map<string, PracticeUnitGroup>();
  for (const ex of exercises) {
    const meta = unitMeta.get(ex.unitSlug);
    const key = ex.unitSlug;
    if (!groups.has(key)) {
      groups.set(key, {
        unitSlug: ex.unitSlug,
        unitTitle: meta?.title ?? ex.unitSlug,
        unitIcon: meta?.icon ?? null,
        unitOrder: meta?.order ?? 999,
        exercises: [],
      });
    }
    groups.get(key)!.exercises.push({
      id: ex.id,
      slug: ex.slug,
      title: ex.title,
      description: ex.description,
      difficulty: ex.difficulty as "easy" | "medium" | "hard",
      xpReward: ex.xpReward,
      position: ex.position,
      passed: passedSet.has(ex.id),
      attempts: attemptCount.get(ex.id) ?? 0,
    });
  }

  return Array.from(groups.values()).sort((a, b) => a.unitOrder - b.unitOrder);
}

export interface PracticeDetail {
  id: string;
  slug: string;
  unitSlug: string;
  unitTitle: string | null;
  title: string;
  description: string;
  prompt: string;
  starterCode: string;
  hints: string[];
  difficulty: "easy" | "medium" | "hard";
  xpReward: number;
  visibleTests: {
    id: string;
    stdin: string;
    expectedStdout: string;
    description: string | null;
  }[];
  passed: boolean;
  bestAttemptCode: string | null;
}

/**
 * Devuelve un ejercicio por slug con la info necesaria para renderizar
 * el editor. Incluye el último intento del usuario si existe (para que
 * pueda continuar donde lo dejó).
 */
export async function getPracticeBySlug(
  slug: string,
  userId: string,
): Promise<PracticeDetail | null> {
  const ex = await db.practiceExercise.findUnique({
    where: { slug },
    include: {
      testCases: { orderBy: { order: "asc" } },
    },
  });
  if (!ex || !ex.published) return null;

  const [unit, latestAttempt, anyPass] = await Promise.all([
    db.unit.findFirst({
      where: { slug: ex.unitSlug },
      select: { title: true },
    }),
    db.userPracticeAttempt.findFirst({
      where: { userId, exerciseId: ex.id },
      orderBy: { createdAt: "desc" },
      select: { code: true },
    }),
    db.userPracticeAttempt.findFirst({
      where: { userId, exerciseId: ex.id, passed: true },
      select: { id: true },
    }),
  ]);

  return {
    id: ex.id,
    slug: ex.slug,
    unitSlug: ex.unitSlug,
    unitTitle: unit?.title ?? null,
    title: ex.title,
    description: ex.description,
    prompt: ex.prompt,
    starterCode: ex.starterCode,
    hints: ex.hints,
    difficulty: ex.difficulty as "easy" | "medium" | "hard",
    xpReward: ex.xpReward,
    visibleTests: ex.testCases
      .filter((tc) => tc.visible)
      .map((tc) => ({
        id: tc.id,
        stdin: tc.stdin,
        expectedStdout: tc.expectedStdout,
        description: tc.description,
      })),
    passed: anyPass !== null,
    bestAttemptCode: latestAttempt?.code ?? null,
  };
}
