"use client";

import * as React from "react";
import Link from "next/link";
import { Check, Inbox, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { relativeFromNow } from "@/lib/relative-time";
import {
  respondFriendRequest,
} from "@/features/friends/actions";
import type { PendingRequest } from "@/features/friends/queries";
import { FriendAvatar } from "./friend-avatar";

interface IncomingRequestsProps {
  requests: PendingRequest[];
}

export function IncomingRequests({ requests }: IncomingRequestsProps) {
  if (requests.length === 0) {
    return (
      <section className="space-y-2">
        <h3 className="label-micro text-muted-foreground">Entrantes</h3>
        <div className="border border-dashed border-border px-5 py-6 text-center">
          <Inbox className="mx-auto size-6 text-muted-foreground/40" aria-hidden />
          <p className="mt-2 text-xs text-muted-foreground">
            No tienes solicitudes pendientes.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-2">
      <div className="flex items-baseline justify-between">
        <h3 className="label-micro text-muted-foreground">Entrantes</h3>
        <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
          {requests.length}
        </span>
      </div>
      <ul className="space-y-2">
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
      <li className="border-b border-border py-3 text-xs text-muted-foreground last:border-b-0">
        {resolved === "accepted"
          ? `Aceptaste a @${request.user.username}.`
          : `Rechazaste la solicitud de @${request.user.username}.`}
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
          @{request.user.username} · {relativeFromNow(request.createdAt)}
        </p>
      </div>
      <div className="flex shrink-0 gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => respond(false)}
          disabled={pending}
          aria-label="Rechazar solicitud"
        >
          <X />
        </Button>
        <Button
          size="sm"
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
