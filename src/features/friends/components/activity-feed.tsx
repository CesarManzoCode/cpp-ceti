import Link from "next/link";
import { BookOpen, Sparkles } from "lucide-react";

import { relativeFromNow } from "@/lib/relative-time";
import type { ActivityEvent } from "@/features/friends/queries";
import { FriendAvatar } from "./friend-avatar";

interface ActivityFeedProps {
  events: ActivityEvent[];
  /** "self" o "friend" — define el mensaje del estado vacío. */
  emptyHint?: "self" | "friend" | "friends";
}

export function ActivityFeed({ events, emptyHint = "friends" }: ActivityFeedProps) {
  if (events.length === 0) {
    return (
      <div className="rounded-[var(--radius-lg)] border border-dashed border-border bg-surface-2/40 p-6 text-center">
        <Sparkles className="mx-auto size-6 text-muted-foreground/40" aria-hidden />
        <p className="mt-2 text-sm font-medium">Nada por aquí todavía</p>
        <p className="mx-auto mt-1 max-w-xs text-xs text-muted-foreground">
          {emptyHint === "self"
            ? "Cuando completes una lección aparecerá aquí."
            : emptyHint === "friend"
              ? "Cuando complete su próxima lección lo verás aquí."
              : "Cuando tus amigos completen lecciones aparecerá su actividad aquí."}
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {events.map((event, idx) => (
        <FeedRow key={`${event.kind}-${event.at.toISOString()}-${idx}`} event={event} />
      ))}
    </ul>
  );
}

function FeedRow({ event }: { event: ActivityEvent }) {
  if (event.kind === "lesson_completed") {
    return (
      <li className="flex items-start gap-3 rounded-[var(--radius-lg)] border border-border bg-card p-3 shadow-[var(--shadow-xs)]">
        <FriendAvatar
          name={event.user.name}
          image={event.user.image}
          className="size-8"
        />
        <div className="min-w-0 flex-1 space-y-0.5">
          <p className="text-sm">
            <Link
              href={`/app/perfil/${event.user.username}`}
              className="font-semibold tracking-tight text-foreground hover:underline"
            >
              {event.user.name}
            </Link>{" "}
            <span className="text-muted-foreground">completó</span>{" "}
            <Link
              href={`/app/u/${event.lesson.unitSlug}/${event.lesson.lessonSlug}`}
              className="font-medium text-foreground hover:underline"
            >
              {event.lesson.title}
            </Link>
          </p>
          <p className="flex items-center gap-2 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <BookOpen className="size-3" aria-hidden />
              {event.lesson.unitTitle}
            </span>
            <span aria-hidden className="text-muted-foreground/40">·</span>
            <span className="font-mono tabular-nums">+{event.lesson.xpReward} XP</span>
            <span aria-hidden className="text-muted-foreground/40">·</span>
            <time dateTime={event.at.toISOString()}>{relativeFromNow(event.at)}</time>
          </p>
        </div>
      </li>
    );
  }
  return null;
}
