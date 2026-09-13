"use client";

import * as React from "react";
import Link from "next/link";
import { Search, Sparkles, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { levelFromXp } from "@/lib/level";
import { relativeFromNow } from "@/lib/relative-time";
import type { FriendCard } from "@/features/friends/queries";
import { PersonIdentity } from "./person-identity";

interface FriendsListProps {
  friends: FriendCard[];
  /** Lleva a otra pestaña de Amigos desde el estado vacío. */
  onGoToSearch?: () => void;
  onGoToDiscovery?: () => void;
}

export function FriendsList({
  friends,
  onGoToSearch,
  onGoToDiscovery,
}: FriendsListProps) {
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
    // Vacío inicial (blueprint UX/UI, G9): sin ilustración ni borde punteado.
    return (
      <div>
        <p className="text-[15px] font-bold">Todavía no tienes amigos</p>
        <p className="mt-1.5 max-w-sm text-[14px] leading-relaxed text-muted-foreground">
          Búscalos por su @usuario o deja que te sugiramos gente de tu
          plantel y tu carrera.
        </p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <Button size="lg" onClick={onGoToSearch}>
            <UserPlus />
            Buscar compañeros
          </Button>
          <Button variant="outline" size="lg" onClick={onGoToDiscovery}>
            <Sparkles />
            Ver sugerencias
          </Button>
        </div>
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
          aria-label="Filtrar tus amigos"
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
        className="flex items-center gap-3 rounded-[var(--radius-lg)] border border-border bg-card p-3.5 transition-[border-color,box-shadow,transform] duration-200 hover:border-primary/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <PersonIdentity
          name={friend.name}
          username={friend.username}
          image={friend.image}
          meta={`@${friend.username} · ${lastActive}`}
        />
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
