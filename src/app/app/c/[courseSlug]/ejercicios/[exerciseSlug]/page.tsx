import { notFound } from "next/navigation";

import { PracticeViewer } from "@/features/practice/components/practice-viewer";
import { getPracticeBySlug } from "@/features/practice/queries";
import { getCourseBySlug } from "@/features/roadmap/queries";
import { requireSession } from "@/lib/get-session";

interface PageProps {
  params: Promise<{ courseSlug: string; exerciseSlug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { exerciseSlug } = await params;
  return { title: `Ejercicio: ${exerciseSlug}` };
}

export default async function EjercicioPage({ params }: PageProps) {
  const { courseSlug, exerciseSlug } = await params;
  const session = await requireSession();

  const course = await getCourseBySlug(courseSlug);
  if (!course) notFound();

  const exercise = await getPracticeBySlug(
    course.id,
    exerciseSlug,
    session.user.id,
  );
  if (!exercise) notFound();

  return (
    <PracticeViewer
      courseSlug={course.slug}
      language={course.language}
      exercise={exercise}
    />
  );
}
