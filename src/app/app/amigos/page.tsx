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
      className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10"
    >
      <header>
        <h1 className="text-[30px] font-extrabold leading-[1.1] tracking-[-0.034em] sm:text-[38px]">
          Amigos
        </h1>
        <p className="mt-3 max-w-[56ch] text-[16px] leading-relaxed text-muted-foreground sm:text-[17px]">
          Agrega compañeros del CETI para ver su progreso y motivarse
          mutuamente.
        </p>
      </header>

      {friends.length === 0 && incoming.length === 0 && outgoing.length === 0 ? (
        <EmptyAmigos username={session.user.username} />
      ) : null}

      <div className="mt-8">
        <FriendsTabs
          initialTab={initialTab}
          friends={friends}
          incoming={incoming}
          outgoing={outgoing}
          meUsername={session.user.username}
        />
      </div>

      <section className="mt-10">
        <SectionRule>Invita a alguien</SectionRule>
        <div className="mt-4">
          <InviteLinkCard username={session.user.username} />
        </div>
      </section>
    </div>
  );
}

function EmptyAmigos({ username }: { username: string }) {
  return (
    <div className="mt-8 rounded-[var(--radius-lg)] border border-primary/25 bg-primary-tint p-5 sm:p-6">
      <h2 className="text-balance text-[19px] font-bold leading-snug">
        Aún no tienes amigos en C++ CETI.
      </h2>
      <p className="mt-2 max-w-[54ch] text-[15px] leading-relaxed text-muted-foreground">
        Busca a tus compañeros por{" "}
        <span className="font-mono font-semibold text-foreground">@usuario</span>{" "}
        o mándales tu link de invitación. Cuando acepten verás su progreso en
        tu inicio.
      </p>
      <p className="mt-2.5 text-[14px] text-muted-foreground">
        Tu handle es{" "}
        <span className="font-mono font-semibold text-foreground">
          @{username}
        </span>
        .
      </p>
    </div>
  );
}
