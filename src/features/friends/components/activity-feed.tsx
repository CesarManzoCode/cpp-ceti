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
    // Vacío inicial (blueprint UX/UI, G9/H13): texto factual, sin borde
    // punteado ni ilustración — no es una zona de carga/soltar.
    return (
      <p className="text-[14px] leading-relaxed text-muted-foreground">
        {emptyHint === "self"
          ? "Todavía no hay actividad. Completa una lección y aparecerá aquí."
          : emptyHint === "friend"
            ? "Todavía no hay actividad. Cuando complete su próxima lección lo verás aquí."
            : "Todavía no hay actividad. Cuando tus amigos completen lecciones aparecerá aquí."}
      </p>
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
      <li className="flex items-start gap-3 rounded-[var(--radius-lg)] border border-border bg-card p-3.5">
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
