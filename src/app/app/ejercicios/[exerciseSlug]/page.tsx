import { notFound } from "next/navigation";

import { PracticeViewer } from "@/features/practice/components/practice-viewer";
import { getPracticeBySlug } from "@/features/practice/queries";
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

  const exercise = await getPracticeBySlug(exerciseSlug, session.user.id);
  if (!exercise) notFound();

  return <PracticeViewer exercise={exercise} />;
}
