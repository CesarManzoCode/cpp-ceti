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
      <p className="text-sm leading-relaxed text-muted-foreground">
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

      <ul className="border-y border-border">
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
    <li className="border-b border-border last:border-b-0">
      <Link
        href={`/app/perfil/${friend.username}`}
        className="flex items-center gap-3 py-3 transition-colors hover:bg-surface-2 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
      >
        <FriendAvatar name={friend.name} image={friend.image} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{friend.name}</p>
          <p className="truncate font-mono text-[11px] text-muted-foreground">
            @{friend.username} · {lastActive}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3 font-mono text-[11px] tabular-nums">
          <span className="text-muted-foreground">
            <span className="label-micro mr-1">nv</span>
            <span className="text-foreground">{lvl.level}</span>
          </span>
          {friend.currentStreak > 0 ? (
            <span className="text-warning">{friend.currentStreak}d</span>
          ) : null}
        </div>
      </Link>
    </li>
  );
}
