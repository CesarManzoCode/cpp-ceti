import { UserPlus, Users } from "lucide-react";

import { SectionRule } from "@/components/ui/section-rule";
import { FriendsTabs } from "@/features/friends/components/friends-tabs";
import { InviteLinkCard } from "@/features/friends/components/invite-link-card";
import {
  getFriends,
  getPendingIncoming,
  getPendingOutgoing,
} from "@/features/friends/queries";
import { requireSession } from "@/lib/get-session";

export const metadata = {
  title: "Amigos",
};

export default async function AmigosPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const session = await requireSession();
  const userId = session.user.id;

  const [friends, incoming, outgoing, params] = await Promise.all([
    getFriends(userId),
    getPendingIncoming(userId),
    getPendingOutgoing(userId),
    searchParams,
  ]);

  const initialTab =
    params.tab === "solicitudes" || params.tab === "buscar"
      ? params.tab
      : incoming.length > 0
        ? "solicitudes"
        : "amigos";

  return (
    <div
      data-page-enter
      className="mx-auto max-w-4xl space-y-8 px-5 py-8 sm:px-6 lg:px-8 lg:py-10"
    >
      <header className="space-y-2">
        <p className="eyebrow inline-flex items-center gap-1.5 text-primary">
          <Users className="size-3.5" aria-hidden />
          Comunidad
        </p>
        <h1 className="text-3xl font-bold tracking-[-0.03em] sm:text-[36px]">
          Tus <span className="text-gradient-primary">amigos.</span>
        </h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          Agrega compañeros del CETI para ver su progreso y motivarse mutuamente.
        </p>
      </header>

      {friends.length === 0 && incoming.length === 0 && outgoing.length === 0 ? (
        <EmptyAmigosHero username={session.user.username} />
      ) : null}

      <FriendsTabs
        initialTab={initialTab}
        friends={friends}
        incoming={incoming}
        outgoing={outgoing}
        meUsername={session.user.username}
      />

      <section className="space-y-4">
        <SectionRule>Invita a alguien</SectionRule>
        <InviteLinkCard username={session.user.username} />
      </section>
    </div>
  );
}

function EmptyAmigosHero({ username }: { username: string }) {
  return (
    <div className="gradient-border relative overflow-hidden rounded-[var(--radius-xl)] bg-card p-6 shadow-[var(--shadow-md)] sm:p-8">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -right-20 -top-20 size-56 rounded-full bg-gradient-to-br from-primary/25 to-[color:var(--brand-2)]/20 opacity-70 blur-3xl" />
      </div>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-[15%] top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent"
      />
      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <p className="eyebrow inline-flex items-center gap-1.5 text-primary">
            <UserPlus className="size-3.5" aria-hidden />
            Empieza aquí
          </p>
          <h2 className="text-balance text-[22px] font-bold leading-tight tracking-[-0.025em] sm:text-[28px]">
            Aún no tienes amigos en C++ CETI.
          </h2>
          <p className="max-w-md text-sm text-muted-foreground">
            Busca a tus compañeros por <span className="font-mono">@usuario</span> o
            mándales tu link de invitación. Cuando acepten verás su progreso
            en tu inicio.
          </p>
          <p className="text-xs text-muted-foreground">
            Tu handle es{" "}
            <span className="font-mono font-semibold text-foreground">@{username}</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
