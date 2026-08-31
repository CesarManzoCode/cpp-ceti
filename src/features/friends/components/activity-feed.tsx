import Link from "next/link";

import { InlineCodeText } from "@/components/shared/inline-code-text";
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
      <div className="rounded-[var(--radius-lg)] border border-dashed border-border-strong bg-card px-5 py-7 text-center">
        <p className="text-[15px] font-bold">Nada por aquí todavía</p>
        <p className="mx-auto mt-1.5 max-w-xs text-[14px] leading-relaxed text-muted-foreground">
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
    <ul className="flex flex-col gap-2">
      {events.map((event, idx) => (
        <FeedRow key={`${event.kind}-${event.at.toISOString()}-${idx}`} event={event} />
      ))}
    </ul>
  );
}

function FeedRow({ event }: { event: ActivityEvent }) {
  if (event.kind === "lesson_completed") {
    return (
      <li className="flex items-start gap-3 rounded-[var(--radius-lg)] border border-border bg-card p-3.5 shadow-[var(--shadow-xs)]">
        <FriendAvatar
          name={event.user.name}
          image={event.user.image}
          className="size-9"
        />
        <div className="min-w-0 flex-1">
          <p className="text-[15px] leading-snug">
            <Link
              href={`/app/perfil/${event.user.username}`}
              className="font-bold text-foreground hover:underline"
            >
              {event.user.name}
            </Link>{" "}
            <span className="text-muted-foreground">completó</span>{" "}
            <Link
              href={`/app/c/${event.lesson.courseSlug}/u/${event.lesson.unitSlug}/${event.lesson.lessonSlug}`}
              className="font-bold text-primary hover:underline"
            >
              <InlineCodeText>{event.lesson.title}</InlineCodeText>
            </Link>
          </p>
          <p className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-[13px] font-medium text-muted-foreground">
            <span>{event.lesson.unitTitle}</span>
            <span aria-hidden className="text-border-strong">·</span>
            <span className="font-bold text-warning">
              +{event.lesson.xpReward} XP
            </span>
            <span aria-hidden className="text-border-strong">·</span>
            <time dateTime={event.at.toISOString()}>
              {relativeFromNow(event.at)}
            </time>
          </p>
        </div>
      </li>
    );
  }
  return null;
}
