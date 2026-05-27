import { notFound } from "next/navigation";

import {
  LessonViewer,
  type ViewerStep,
} from "@/components/lesson/lesson-viewer";
import { getDefaultCourse } from "@/lib/courses";
import { getLessonBySlug } from "@/lib/lessons";
import { requireSession } from "@/lib/get-session";
import type { StepContent } from "@/types/lesson";

interface PageProps {
  params: Promise<{ unitSlug: string; lessonSlug: string }>;
}

export default async function LessonPage({ params }: PageProps) {
  const { unitSlug, lessonSlug } = await params;
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
          hints: s.exercise.hints,
          difficulty: s.exercise.difficulty as "easy" | "medium" | "hard",
          xpReward: s.exercise.xpReward,
          visibleTests: s.exercise.testCases.map((t) => ({
            id: t.id,
            stdin: t.stdin,
            expectedStdout: t.expectedStdout,
            description: t.description,
          })),
        }
      : undefined,
  }));

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
    />
  );
}
