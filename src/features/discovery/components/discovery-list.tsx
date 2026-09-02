"use client";

import * as React from "react";
import Link from "next/link";
import { Check, UserPlus, Users } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { PersonIdentity } from "@/features/friends/components/person-identity";
import { sendFriendRequest } from "@/features/friends/actions";
import {
  getDiscoveryPage,
  trackDiscoveryImpression,
  trackDiscoveryProfileOpen,
} from "@/features/discovery/actions";
import type { DiscoveryCandidate } from "@/features/discovery/queries";

type CardState = DiscoveryCandidate & { status: "idle" | "sent" };

export function DiscoveryList({ initialPage }: { initialPage: { candidates: DiscoveryCandidate[]; nextCursor: string | null } }) {
  const [sessionKey] = React.useState(() => crypto.randomUUID());
  const [candidates, setCandidates] = React.useState<CardState[]>(
    initialPage.candidates.map((c) => ({ ...c, status: "idle" as const })),
  );
  const [cursor, setCursor] = React.useState(initialPage.nextCursor);
  const [loadingMore, setLoadingMore] = React.useState(false);

  // La impresión se registra cuando la lista se muestra (la pestaña se
  // monta), no cuando el servidor precarga los candidatos.
  const impressionSent = React.useRef(false);
  React.useEffect(() => {
    if (impressionSent.current) return;
    impressionSent.current = true;
    const bucketCounts: Record<string, number> = {};
    for (const c of initialPage.candidates) {
      bucketCounts[c.bucket] = (bucketCounts[c.bucket] ?? 0) + 1;
    }
    void trackDiscoveryImpression({
      discoverySessionKey: sessionKey,
      resultCount: initialPage.candidates.length,
      bucketCounts,
    });
  }, [initialPage.candidates, sessionKey]);

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
        <p className="mt-2 text-[15px] font-bold">Todavía no hay sugerencias</p>
        <p className="mx-auto mt-1.5 max-w-xs text-[14px] leading-relaxed text-muted-foreground">
          Dinos tu plantel, carrera y grupo: con eso te sugerimos compañeros
          que van en lo mismo que tú.
        </p>
        <Button asChild variant="outline" size="lg" className="mt-5">
          <Link href="/app/perfil#academico">Completar mi perfil</Link>
        </Button>
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
            <PersonIdentity
              name={candidate.name}
              username={candidate.username}
              image={candidate.image}
              href={`/app/perfil/${candidate.username}`}
              onNavigate={() =>
                void trackDiscoveryProfileOpen({ bucket: candidate.bucket, discoverySessionKey: sessionKey })
              }
              meta={
                <span className="text-primary-soft-foreground">{candidate.reason}</span>
              }
            />
            <Button
              size="default"
              variant={candidate.status === "sent" ? "outline" : "default"}
              disabled={candidate.status === "sent"}
              onClick={() => handleAdd(candidate)}
              aria-label={
                candidate.status === "sent"
                  ? `Solicitud enviada a @${candidate.username}`
                  : `Agregar a @${candidate.username}`
              }
              className="shrink-0"
            >
              {candidate.status === "sent" ? <Check /> : <UserPlus />}
              {candidate.status === "sent" ? "Enviada" : "Agregar"}
            </Button>
          </li>
        ))}
      </ul>
      {cursor ? (
        <Button variant="outline" size="lg" loading={loadingMore} onClick={loadMore} className="self-center">
          Ver más compañeros
        </Button>
      ) : null}
    </div>
  );
}
