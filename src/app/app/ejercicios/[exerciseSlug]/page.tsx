import { notFound } from "next/navigation";

import { PracticeViewer } from "@/features/practice/components/practice-viewer";
import { getPracticeBySlug } from "@/features/practice/queries";
import { getCourseBySlug } from "@/features/roadmap/queries";
import { LEGACY_CPP_COURSE_SLUG } from "@/lib/courses";
import { requireSession } from "@/lib/get-session";

interface PageProps {
  params: Promise<{ exerciseSlug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { exerciseSlug } = await params;
  return { title: `Ejercicio: ${exerciseSlug}` };
}

export default async function EjercicioPage({ params }: PageProps) {
  const { exerciseSlug } = await params;
  const session = await requireSession();

  const course = await getCourseBySlug(LEGACY_CPP_COURSE_SLUG);
  if (!course) notFound();

  const exercise = await getPracticeBySlug(
    course.id,
    exerciseSlug,
    session.user.id,
  );
  if (!exercise) notFound();

  return <PracticeViewer language={course.language} exercise={exercise} />;
}
