"use client";

import * as React from "react";
import Link from "next/link";
import { Send, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { relativeFromNow } from "@/lib/relative-time";
import { cancelFriendRequest } from "@/features/friends/actions";
import type { PendingRequest } from "@/features/friends/queries";
import { FriendAvatar } from "./friend-avatar";

interface OutgoingRequestsProps {
  requests: PendingRequest[];
}

export function OutgoingRequests({ requests }: OutgoingRequestsProps) {
  if (requests.length === 0) {
    return (
      <section className="space-y-2">
        <h3 className="text-[13px] font-bold uppercase tracking-[0.05em] text-subtle-foreground">Enviadas</h3>
        <div className="border border-dashed border-border px-5 py-6 text-center">
          <Send className="mx-auto size-5 text-muted-foreground/40" aria-hidden />
          <p className="mt-2 text-[14px] text-muted-foreground">
            No tienes solicitudes pendientes por aceptar.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-2">
      <div className="flex items-baseline justify-between">
        <h3 className="text-[13px] font-bold uppercase tracking-[0.05em] text-subtle-foreground">Enviadas</h3>
        <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
          {requests.length}
        </span>
      </div>
      <ul className="space-y-2">
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
      <li className="border-b border-border py-3 text-[14px] text-muted-foreground last:border-b-0">
        Cancelaste la solicitud a @{request.user.username}.
      </li>
    );
  }

  return (
    <li className="flex items-center gap-3 border-b border-border py-3 last:border-b-0">
      <Link
        href={`/app/perfil/${request.user.username}`}
        className="shrink-0 rounded-[var(--radius-xs)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <FriendAvatar name={request.user.name} image={request.user.image} />
      </Link>
      <div className="min-w-0 flex-1">
        <Link
          href={`/app/perfil/${request.user.username}`}
          className="block truncate text-sm font-medium underline decoration-transparent underline-offset-4 hover:decoration-border-strong"
        >
          {request.user.name}
        </Link>
        <p className="truncate font-mono text-[11px] text-muted-foreground">
          @{request.user.username} · enviada {relativeFromNow(request.createdAt)}
        </p>
      </div>
      <Button
        size="sm"
        variant="ghost"
        onClick={cancel}
        loading={pending}
        aria-label="Cancelar solicitud"
      >
        <X />
        Cancelar
      </Button>
    </li>
  );
}
