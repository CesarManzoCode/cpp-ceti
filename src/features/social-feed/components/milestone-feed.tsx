"use client";

import * as React from "react";
import Link from "next/link";
import { Heart, PartyPopper, Sparkles, Trophy } from "lucide-react";

import { relativeFromNow } from "@/lib/relative-time";
import { giveKudos, removeKudos } from "@/features/social-feed/actions";
import type { FeedEvent } from "@/features/social-feed/queries";
import { FriendAvatar } from "@/features/friends/components/friend-avatar";
import { cn } from "@/lib/utils";

function labelFor(event: FeedEvent): string {
  switch (event.kind) {
    case "unit_completed":
      return `completó la unidad${event.unitTitle ? ` "${event.unitTitle}"` : ""}`;
    case "course_completed":
      return `terminó el curso${event.courseTitle ? ` ${event.courseTitle}` : ""}`;
    case "streak_milestone":
      return `llegó a ${event.value ?? "?"} días de racha`;
    case "league_promoted":
      return "subió de liga";
    case "friend_quest_completed":
      return "completó una misión con un amigo";
  }
}

const KIND_ICON: Record<FeedEvent["kind"], typeof Trophy> = {
  unit_completed: Sparkles,
  course_completed: Trophy,
  streak_milestone: PartyPopper,
  league_promoted: Trophy,
  friend_quest_completed: Trophy,
};

export function MilestoneFeed({ events, viewerId }: { events: FeedEvent[]; viewerId: string }) {
  if (events.length === 0) {
    return (
      <div className="rounded-[var(--radius-lg)] border border-dashed border-border-strong bg-card px-5 py-7 text-center">
        <p className="text-[15px] font-bold">Sin hitos todavía</p>
        <p className="mx-auto mt-1.5 max-w-xs text-[14px] leading-relaxed text-muted-foreground">
          Cuando tú o tus amigos completen una unidad, un curso o lleguen a
          una racha importante, aparece aquí.
        </p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {events.map((event) => (
        <MilestoneRow key={event.id} event={event} viewerId={viewerId} />
      ))}
    </ul>
  );
}

function MilestoneRow({ event, viewerId }: { event: FeedEvent; viewerId: string }) {
  const [given, setGiven] = React.useState(event.kudosByMe);
  const [count, setCount] = React.useState(event.kudosCount);
  const [pending, startTransition] = React.useTransition();
  const Icon = KIND_ICON[event.kind];
  const isSelf = event.actor.id === viewerId;

  function toggle() {
    if (isSelf || pending) return;
    const next = !given;
    setGiven(next);
    setCount((c) => c + (next ? 1 : -1));
    startTransition(async () => {
      try {
        await (next ? giveKudos({ eventId: event.id }) : removeKudos({ eventId: event.id }));
      } catch {
        setGiven(!next);
        setCount((c) => c + (next ? -1 : 1));
      }
    });
  }

  return (
    <li className="flex items-start gap-3 rounded-[var(--radius-lg)] border border-border bg-card p-3.5 shadow-[var(--shadow-xs)]">
      <FriendAvatar name={event.actor.name} image={event.actor.image} className="size-9" />
      <div className="min-w-0 flex-1">
        <p className="text-[15px] leading-snug">
          <Link
            href={`/app/perfil/${event.actor.username}`}
            className="font-bold text-foreground hover:underline"
          >
            {isSelf ? "Tú" : event.actor.name}
          </Link>{" "}
          <span className="text-muted-foreground">{labelFor(event)}</span>
        </p>
        <p className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-[13px] font-medium text-muted-foreground">
          <Icon className="size-3.5" aria-hidden />
          <time dateTime={event.occurredAt.toISOString()}>{relativeFromNow(event.occurredAt)}</time>
        </p>
      </div>
      <button
        type="button"
        onClick={toggle}
        disabled={isSelf}
        aria-pressed={given}
        aria-label={given ? "Quitar kudos" : "Dar kudos"}
        className={cn(
          "flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[13px] font-bold transition-colors",
          isSelf
            ? "cursor-not-allowed border-border text-subtle-foreground"
            : given
              ? "border-primary bg-primary-soft text-primary-soft-foreground"
              : "border-border text-muted-foreground hover:border-border-strong hover:text-foreground",
        )}
      >
        <Heart className={cn("size-3.5", given && "fill-current")} aria-hidden />
        {count > 0 ? count : null}
      </button>
    </li>
  );
}
