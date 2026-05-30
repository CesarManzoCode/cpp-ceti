"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Check,
  MoreHorizontal,
  Shield,
  UserMinus,
  UserPlus,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  blockUser,
  removeFriend,
  sendFriendRequest,
  unblockUser,
} from "@/features/friends/actions";
import {
  cancelOutgoingFriendRequestByUserId,
  respondPendingByRequesterId,
} from "@/features/friends/actions-by-user";
import type { FriendshipState } from "@/features/friends/queries";

interface ProfileActionsProps {
  userId: string;
  username: string;
  state: FriendshipState;
}

export function ProfileActions({
  userId,
  username,
  state: initialState,
}: ProfileActionsProps) {
  const router = useRouter();
  const [state, setState] = React.useState<FriendshipState>(initialState);
  const [pending, startTransition] = React.useTransition();

  function runWith(work: () => Promise<{ next: FriendshipState; toast: string }>) {
    startTransition(async () => {
      try {
        const { next, toast: msg } = await work();
        setState(next);
        toast.success(msg);
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Algo salió mal");
      }
    });
  }

  if (state === "self") {
    return (
      <Button asChild variant="outline" size="sm">
        <Link href="/app/perfil">Editar mi perfil</Link>
      </Button>
    );
  }

  if (state === "none") {
    return (
      <Button
        size="sm"
        loading={pending}
        onClick={() =>
          runWith(async () => {
            const result = await sendFriendRequest({ username });
            return {
              next: result.status === "accepted" ? "friends" : "pending_outgoing",
              toast:
                result.status === "accepted"
                  ? "Ahora son amigos"
                  : `Solicitud enviada a @${username}`,
            };
          })
        }
      >
        <UserPlus />
        Agregar amigo
      </Button>
    );
  }

  if (state === "pending_outgoing") {
    return (
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" disabled>
          Solicitud enviada
        </Button>
        <Button
          variant="ghost"
          size="sm"
          loading={pending}
          onClick={() =>
            runWith(async () => {
              const { cancelled } = await cancelOutgoingFriendRequestByUserId({ userId });
              if (!cancelled) throw new Error("La solicitud ya no existe");
              return { next: "none", toast: "Solicitud cancelada" };
            })
          }
        >
          Cancelar
        </Button>
      </div>
    );
  }

  if (state === "pending_incoming") {
    return (
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          loading={pending}
          onClick={() =>
            runWith(async () => {
              const { responded } = await respondPendingByRequesterId({ userId, accept: true });
              if (!responded) throw new Error("La solicitud ya no existe");
              return { next: "friends", toast: "Ahora son amigos" };
            })
          }
        >
          <Check />
          Aceptar
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={pending}
          aria-label="Rechazar solicitud"
          onClick={() =>
            runWith(async () => {
              const { responded } = await respondPendingByRequesterId({ userId, accept: false });
              if (!responded) throw new Error("La solicitud ya no existe");
              return { next: "none", toast: "Solicitud rechazada" };
            })
          }
        >
          <X />
        </Button>
      </div>
    );
  }

  if (state === "friends") {
    return (
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" disabled className="text-success">
          <Check />
          Amigos
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" aria-label="Más opciones">
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                runWith(async () => {
                  await removeFriend({ userId });
                  return { next: "none", toast: `Quitaste a @${username} de tus amigos` };
                });
              }}
            >
              <UserMinus className="size-4" />
              Quitar amistad
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onSelect={(e) => {
                e.preventDefault();
                runWith(async () => {
                  await blockUser({ userId });
                  return { next: "blocked_by_me", toast: `Bloqueaste a @${username}` };
                });
              }}
            >
              <Shield className="size-4" />
              Bloquear
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  if (state === "blocked_by_me") {
    return (
      <Button
        variant="outline"
        size="sm"
        loading={pending}
        onClick={() =>
          runWith(async () => {
            await unblockUser({ userId });
            return { next: "none", toast: "Desbloqueado" };
          })
        }
      >
        Desbloquear
      </Button>
    );
  }

  if (state === "blocked_by_them") {
    return (
      <Button variant="outline" size="sm" disabled>
        No disponible
      </Button>
    );
  }

  return null;
}
