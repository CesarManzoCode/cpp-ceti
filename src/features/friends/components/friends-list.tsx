"use client";

import * as React from "react";
import Link from "next/link";
import { Flame, Search, Sparkles, Zap } from "lucide-react";

import { Input } from "@/components/ui/input";
import { levelFromXp } from "@/lib/level";
import { relativeFromNow } from "@/lib/relative-time";
import type { FriendCard } from "@/features/friends/queries";
import { FriendAvatar } from "./friend-avatar";

interface FriendsListProps {
  friends: FriendCard[];
}

export function FriendsList({ friends }: FriendsListProps) {
  const [filter, setFilter] = React.useState("");
  const filtered = React.useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return friends;
    return friends.filter(
      (f) =>
        f.username.includes(q) || f.name.toLowerCase().includes(q),
    );
  }, [filter, friends]);

  if (friends.length === 0) {
    return (
      <div className="rounded-[var(--radius-lg)] border border-dashed border-border bg-surface-2/40 p-8 text-center">
        <Sparkles className="mx-auto size-7 text-muted-foreground/40" aria-hidden />
        <p className="mt-3 text-sm font-medium">Aún no tienes amigos</p>
        <p className="mx-auto mt-1 max-w-xs text-xs text-muted-foreground">
          Ve a la pestaña <span className="font-medium text-foreground">Buscar</span>{" "}
          para encontrar a tus compañeros.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {friends.length > 4 ? (
        <Input
          type="search"
          placeholder="Filtrar tus amigos…"
          leadingIcon={<Search className="size-4" />}
          value={filter}
          onChange={(e) => setFilter(e.currentTarget.value)}
          spellCheck={false}
        />
      ) : null}

      <ul className="grid gap-2.5 sm:grid-cols-2">
        {filtered.map((f) => (
          <FriendRow key={f.id} friend={f} />
        ))}
      </ul>

      {filter && filtered.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">
          Ningún amigo coincide con &ldquo;{filter}&rdquo;.
        </p>
      ) : null}
    </div>
  );
}

function FriendRow({ friend }: { friend: FriendCard }) {
  const lvl = levelFromXp(friend.totalXp);
  const lastActive = friend.lastActiveAt
    ? relativeFromNow(friend.lastActiveAt)
    : "sin actividad aún";

  return (
    <li>
      <Link
        href={`/app/perfil/${friend.username}`}
        className="group flex items-center gap-3 rounded-[var(--radius-lg)] border border-border bg-card p-3 shadow-[var(--shadow-xs)] transition-[border-color,box-shadow,transform] hover:-translate-y-px hover:border-primary/30 hover:shadow-[var(--shadow-sm)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <FriendAvatar name={friend.name} image={friend.image} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold tracking-tight">
            {friend.name}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            @{friend.username} · {lastActive}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1 text-[11px] font-mono tabular-nums">
          <span className="inline-flex items-center gap-1 text-primary">
            <Zap className="size-3" aria-hidden />
            Nv {lvl.level}
          </span>
          {friend.currentStreak > 0 ? (
            <span className="inline-flex items-center gap-1 text-warning">
              <Flame className="size-3" aria-hidden />
              {friend.currentStreak}
            </span>
          ) : null}
        </div>
      </Link>
    </li>
  );
}
