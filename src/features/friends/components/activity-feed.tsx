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
      <div className="border border-dashed border-border px-5 py-6 text-center">
        <p className="text-sm font-medium">Nada por aquí todavía</p>
        <p className="mx-auto mt-1.5 max-w-xs text-xs leading-relaxed text-muted-foreground">
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
    <ul className="border-y border-border">
      {events.map((event, idx) => (
        <FeedRow key={`${event.kind}-${event.at.toISOString()}-${idx}`} event={event} />
      ))}
    </ul>
  );
}

function FeedRow({ event }: { event: ActivityEvent }) {
  if (event.kind === "lesson_completed") {
    return (
      <li className="flex items-start gap-3 border-b border-border py-3 last:border-b-0">
        <FriendAvatar
          name={event.user.name}
          image={event.user.image}
          className="size-8"
        />
        <div className="min-w-0 flex-1">
          <p className="text-sm leading-snug">
            <Link
              href={`/app/perfil/${event.user.username}`}
              className="font-medium text-foreground underline decoration-transparent underline-offset-4 hover:decoration-border-strong"
            >
              {event.user.name}
            </Link>{" "}
            <span className="text-muted-foreground">completó</span>{" "}
            <Link
              href={`/app/u/${event.lesson.unitSlug}/${event.lesson.lessonSlug}`}
              className="font-medium text-foreground underline decoration-border-strong underline-offset-4 hover:decoration-current"
            >
              <InlineCodeText>{event.lesson.title}</InlineCodeText>
            </Link>
          </p>
          <p className="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-0.5 font-mono text-[11px] tabular-nums text-muted-foreground">
            <span>{event.lesson.unitTitle}</span>
            <span aria-hidden className="text-muted-foreground/40">·</span>
            <span className="text-warning">+{event.lesson.xpReward} XP</span>
            <span aria-hidden className="text-muted-foreground/40">·</span>
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
