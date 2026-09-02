"use client";

import * as React from "react";
import Link from "next/link";
import { UserPlus, Users } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { FriendAvatar } from "@/features/friends/components/friend-avatar";
import { sendFriendRequest } from "@/features/friends/actions";
import { getDiscoveryPage, trackDiscoveryProfileOpen } from "@/features/discovery/actions";
import type { DiscoveryCandidate } from "@/features/discovery/queries";

type CardState = DiscoveryCandidate & { status: "idle" | "sent" };

export function DiscoveryList({ initialPage }: { initialPage: { candidates: DiscoveryCandidate[]; nextCursor: string | null } }) {
  const [sessionKey] = React.useState(() => crypto.randomUUID());
  const [candidates, setCandidates] = React.useState<CardState[]>(
    initialPage.candidates.map((c) => ({ ...c, status: "idle" as const })),
  );
  const [cursor, setCursor] = React.useState(initialPage.nextCursor);
  const [loadingMore, setLoadingMore] = React.useState(false);

  async function loadMore() {
    if (!cursor || loadingMore) return;
    setLoadingMore(true);
    try {
      const page = await getDiscoveryPage({ cursor, discoverySessionKey: sessionKey });
      setCandidates((prev) => [...prev, ...page.candidates.map((c) => ({ ...c, status: "idle" as const }))]);
      setCursor(page.nextCursor);
    } catch {
      toast.error("No pudimos cargar más resultados");
    } finally {
      setLoadingMore(false);
    }
  }

  async function handleAdd(candidate: CardState) {
    setCandidates((prev) => prev.map((c) => (c.id === candidate.id ? { ...c, status: "sent" } : c)));
    try {
      await sendFriendRequest({
        username: candidate.username,
        source: "discovery",
        discoveryToken: candidate.contextToken,
      });
      toast.success(`Solicitud enviada a @${candidate.username}`);
    } catch (err) {
      setCandidates((prev) => prev.map((c) => (c.id === candidate.id ? { ...c, status: "idle" } : c)));
      toast.error(err instanceof Error ? err.message : "Algo salió mal");
    }
  }

  if (candidates.length === 0) {
    return (
      <div className="rounded-[var(--radius-lg)] border border-dashed border-border-strong bg-card px-5 py-7 text-center">
        <Users className="mx-auto size-6 text-subtle-foreground" aria-hidden />
        <p className="mt-2 text-[15px] font-bold">Nada por aquí todavía</p>
        <p className="mx-auto mt-1.5 max-w-xs text-[14px] leading-relaxed text-muted-foreground">
          Completa tu perfil académico para que encontremos compañeros de tu
          grupo, carrera o plantel.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <ul className="flex flex-col gap-2">
        {candidates.map((candidate) => (
          <li
            key={candidate.id}
            className="flex items-center gap-3 rounded-[var(--radius-lg)] border border-border bg-card p-3.5 shadow-[var(--shadow-xs)]"
          >
            <Link
              href={`/app/perfil/${candidate.username}`}
              onClick={() =>
                void trackDiscoveryProfileOpen({ bucket: candidate.bucket, discoverySessionKey: sessionKey })
              }
              className="flex min-w-0 flex-1 items-center gap-3"
            >
              <FriendAvatar name={candidate.name} image={candidate.image} className="size-10 shrink-0" />
              <div className="min-w-0">
                <p className="truncate text-[15px] font-bold text-foreground">{candidate.name}</p>
                <p className="mt-0.5 truncate text-[13px] font-medium text-muted-foreground">
                  {candidate.reason}
                </p>
              </div>
            </Link>
            <Button
              size="sm"
              variant={candidate.status === "sent" ? "outline" : "default"}
              disabled={candidate.status === "sent"}
              onClick={() => handleAdd(candidate)}
            >
              <UserPlus className="size-4" />
              {candidate.status === "sent" ? "Enviada" : "Agregar"}
            </Button>
          </li>
        ))}
      </ul>
      {cursor ? (
        <Button variant="outline" size="sm" loading={loadingMore} onClick={loadMore} className="self-center">
          Ver más
        </Button>
      ) : null}
    </div>
  );
}
