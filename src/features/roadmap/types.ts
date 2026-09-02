export interface RoadmapUnit {
  slug: string;
  title: string;
  order: number;
  published: boolean;
  lessonCount: number;
  completedCount: number;
  /**
   * Sección curricular a la que pertenece esta unidad, si el curso
   * declara `curriculum`. `null` en cursos sin agrupación curricular —
   * ahí el roadmap se ve exactamente como antes: una lista plana.
   */
  curriculumSection: {
    key: string;
    semester: number;
    subjectName: string;
    order: number;
  } | null;
}

export type RoadmapLessonStatus = "completed" | "in_progress" | "not_started";

export interface RoadmapLesson {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  xpReward: number;
  estimatedMinutes: number;
  stepCount: number;
  status: RoadmapLessonStatus;
  order: number;
}

export interface NextLesson {
  lessonSlug: string;
  lessonTitle: string;
  unitSlug: string;
  unitTitle: string;
  unitOrder: number;
  estimatedMinutes: number;
  status: "in_progress" | "not_started";
}
