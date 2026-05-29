export interface RoadmapUnit {
  slug: string;
  title: string;
  order: number;
  published: boolean;
  lessonCount: number;
  completedCount: number;
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
