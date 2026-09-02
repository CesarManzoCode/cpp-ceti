"use client";

import * as React from "react";
import { Send, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { relativeFromNow } from "@/lib/relative-time";
import { cancelFriendRequest } from "@/features/friends/actions";
import type { PendingRequest } from "@/features/friends/queries";
import { PersonIdentity } from "./person-identity";

interface OutgoingRequestsProps {
  requests: PendingRequest[];
}

export function OutgoingRequests({ requests }: OutgoingRequestsProps) {
  if (requests.length === 0) {
    return (
      <section className="space-y-2">
        <h3 className="text-[13px] font-bold uppercase tracking-[0.05em] text-subtle-foreground">Enviadas</h3>
        <div className="rounded-[var(--radius-lg)] border border-dashed border-border px-5 py-6 text-center">
          <Send className="mx-auto size-5 text-muted-foreground/40" aria-hidden />
          <p className="mt-2 text-[14px] text-muted-foreground">
            No tienes solicitudes esperando respuesta.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-2">
      <div className="flex items-baseline justify-between">
        <h3 className="text-[13px] font-bold uppercase tracking-[0.05em] text-subtle-foreground">Enviadas</h3>
        <span className="text-[13px] font-semibold tabular-nums text-muted-foreground">
          {requests.length}
        </span>
      </div>
      <ul className="flex flex-col gap-2">
        {requests.map((r) => (
          <OutgoingRow key={r.friendshipId} request={r} />
        ))}
      </ul>
    </section>
  );
}

function OutgoingRow({ request }: { request: PendingRequest }) {
  const [pending, startTransition] = React.useTransition();
  const [cancelled, setCancelled] = React.useState(false);

  function cancel() {
    startTransition(async () => {
      try {
        await cancelFriendRequest({ friendshipId: request.friendshipId });
        setCancelled(true);
        toast.success("Solicitud cancelada");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "No se pudo cancelar");
      }
    });
  }

  if (cancelled) {
    return (
      <li className="rounded-[var(--radius-lg)] border border-border bg-surface-2 px-3.5 py-3 text-[14px] text-muted-foreground">
        Cancelaste la solicitud a @{request.user.username}.
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
        meta={`@${request.user.username} · enviada ${relativeFromNow(request.createdAt)}`}
      />
      <Button
        size="default"
        variant="ghost"
        onClick={cancel}
        loading={pending}
        className="shrink-0"
      >
        <X />
        Cancelar
      </Button>
    </li>
  );
}
