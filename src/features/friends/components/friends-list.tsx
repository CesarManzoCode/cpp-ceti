"use client";

import * as React from "react";
import Link from "next/link";
import { Search } from "lucide-react";

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
      <p className="text-[15px] leading-relaxed text-muted-foreground">
        Todavía no tienes amigos. Ve a la pestaña{" "}
        <span className="text-foreground">Buscar</span> para encontrar a tus
        compañeros del CETI.
      </p>
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

      <ul className="flex flex-col gap-2">
        {filtered.map((f) => (
          <FriendRow key={f.id} friend={f} />
        ))}
      </ul>

      {filter && filtered.length === 0 ? (
        <p className="py-6 text-center text-[15px] text-muted-foreground">
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
        className="flex items-center gap-3 rounded-[var(--radius-lg)] border border-border bg-card p-3.5 shadow-[var(--shadow-xs)] transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[var(--shadow-md)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <FriendAvatar name={friend.name} image={friend.image} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-bold">{friend.name}</p>
          <p className="truncate text-[13px] text-muted-foreground">
            @{friend.username} · {lastActive}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2 text-[12px] font-bold tabular-nums">
          <span className="rounded-full bg-surface-2 px-2.5 py-1 text-muted-foreground">
            Nv {lvl.level}
          </span>
          {friend.currentStreak > 0 ? (
            <span className="rounded-full bg-warning-soft px-2.5 py-1 text-warning">
              {friend.currentStreak} d
            </span>
          ) : null}
        </div>
      </Link>
    </li>
  );
}
