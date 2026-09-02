"use client";

import * as React from "react";
import { Check, Inbox, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { relativeFromNow } from "@/lib/relative-time";
import {
  respondFriendRequest,
} from "@/features/friends/actions";
import type { PendingRequest } from "@/features/friends/queries";
import { PersonIdentity } from "./person-identity";

interface IncomingRequestsProps {
  requests: PendingRequest[];
}

export function IncomingRequests({ requests }: IncomingRequestsProps) {
  if (requests.length === 0) {
    return (
      <section className="space-y-2">
        <h3 className="text-[13px] font-bold uppercase tracking-[0.05em] text-subtle-foreground">Entrantes</h3>
        <div className="rounded-[var(--radius-lg)] border border-dashed border-border px-5 py-6 text-center">
          <Inbox className="mx-auto size-6 text-muted-foreground/40" aria-hidden />
          <p className="mt-2 text-[14px] text-muted-foreground">
            Nadie te ha mandado solicitud.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-2">
      <div className="flex items-baseline justify-between">
        <h3 className="text-[13px] font-bold uppercase tracking-[0.05em] text-subtle-foreground">Entrantes</h3>
        <span className="text-[13px] font-semibold tabular-nums text-muted-foreground">
          {requests.length}
        </span>
      </div>
      <ul className="flex flex-col gap-2">
        {requests.map((r) => (
          <IncomingRow key={r.friendshipId} request={r} />
        ))}
      </ul>
    </section>
  );
}

function IncomingRow({ request }: { request: PendingRequest }) {
  const [pending, startTransition] = React.useTransition();
  const [resolved, setResolved] = React.useState<"accepted" | "declined" | null>(null);

  function respond(accept: boolean) {
    startTransition(async () => {
      try {
        await respondFriendRequest({ friendshipId: request.friendshipId, accept });
        setResolved(accept ? "accepted" : "declined");
        toast.success(
          accept
            ? `Ahora eres amigo de @${request.user.username}`
            : "Solicitud rechazada",
        );
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "No pudimos responder la solicitud",
        );
      }
    });
  }

  if (resolved) {
    return (
      <li className="rounded-[var(--radius-lg)] border border-border bg-surface-2 px-3.5 py-3 text-[14px] text-muted-foreground">
        {resolved === "accepted"
          ? `Aceptaste a @${request.user.username}.`
          : `Rechazaste la solicitud de @${request.user.username}.`}
      </li>
    );
  }

  return (
    <li className="flex items-center gap-3 rounded-[var(--radius-lg)] border border-border bg-card p-3.5 shadow-[var(--shadow-xs)]">
      <PersonIdentity
        name={request.user.name}
        username={request.user.username}
        image={request.user.image}
        href={`/app/perfil/${request.user.username}`}
        meta={`@${request.user.username} · ${relativeFromNow(request.createdAt)}`}
      />
      <div className="flex shrink-0 gap-2">
        <Button
          size="icon"
          variant="outline"
          onClick={() => respond(false)}
          disabled={pending}
          aria-label={`Rechazar la solicitud de @${request.user.username}`}
        >
          <X />
        </Button>
        <Button
          size="default"
          onClick={() => respond(true)}
          loading={pending}
        >
          <Check />
          Aceptar
        </Button>
      </div>
    </li>
  );
}
