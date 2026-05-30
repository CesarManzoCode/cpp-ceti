import { notFound } from "next/navigation";

import { LessonViewer } from "@/features/lessons/components/lesson-viewer";
import { getDefaultCourse } from "@/features/roadmap/queries";
import { getLessonBySlug } from "@/features/lessons/queries";
import { requireSession } from "@/lib/get-session";
import type { StepContent, ViewerStep } from "@/features/lessons/types";

interface PageProps {
  params: Promise<{ unitSlug: string; lessonSlug: string }>;
  searchParams: Promise<{ p?: string }>;
}

export default async function LessonPage({
  params,
  searchParams,
}: PageProps) {
  const { unitSlug, lessonSlug } = await params;
  const { p } = await searchParams;
  const session = await requireSession();

  const course = await getDefaultCourse();
  if (!course) notFound();

  const data = await getLessonBySlug(
    course.slug,
    unitSlug,
    lessonSlug,
    session.user.id,
  );

  // Si el primer paso es interactivo, registra la lección como in_progress
  // (no esperamos por el efecto; ya se hace en completeStep)

  const steps: ViewerStep[] = data.lesson.steps.map((s) => ({
    id: s.id,
    order: s.order,
    type: s.type as StepContent["type"],
    content: {
      type: s.type,
      ...(s.content as object),
    } as StepContent,
    completed: s.completed,
    exercise: s.exercise
      ? {
          id: s.exercise.id,
          prompt: s.exercise.prompt,
          starterCode: s.exercise.starterCode,
          solutionCode: s.exercise.solutionCode,
          hints: s.exercise.hints,
          difficulty: s.exercise.difficulty as "easy" | "medium" | "hard",
          xpReward: s.exercise.xpReward,
          bestAttemptCode: s.bestAttemptCode,
          visibleTests: s.exercise.testCases.map((t) => ({
            id: t.id,
            stdin: t.stdin,
            expectedStdout: t.expectedStdout,
            description: t.description,
          })),
        }
      : undefined,
  }));

  // ?p=N (1-indexed) permite linkear directo a un paso específico.
  const parsedP = p ? Number.parseInt(p, 10) : NaN;
  const initialStepIndex =
    Number.isFinite(parsedP) && parsedP >= 1 && parsedP <= steps.length
      ? parsedP - 1
      : null;

  return (
    <LessonViewer
      lesson={{
        id: data.lesson.id,
        title: data.lesson.title,
        description: data.lesson.description,
        xpReward: data.lesson.xpReward,
        steps,
      }}
      unit={{
        slug: data.unit.slug,
        title: data.unit.title,
        order: data.unit.order,
      }}
      nextLessonLink={data.nextLessonLink}
      initialStepIndex={initialStepIndex}
    />
  );
}
