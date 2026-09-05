"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Bug,
  Dumbbell,
  LogOut,
  MessageSquarePlus,
  Settings,
  ShieldCheck,
  Trophy,
  User as UserIcon,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FeedbackDialog } from "@/features/feedback/components/feedback-dialog";
import { authClient } from "@/lib/auth-client";

interface UserMenuProps {
  /** Curso seleccionado: los accesos del curso lo llevan. */
  courseSlug?: string | null;
  user: {
    name: string;
    email: string;
    image?: string | null;
    username: string;
  };
  pendingFriendsCount?: number;
  /**
   * Sólo controla si se MUESTRA el acceso a /app/admin. La autorización real
   * es server-side (`requireAdmin`): ocultar un link no protege nada.
   */
  isAdmin?: boolean;
}

export function UserMenu({
  user,
  courseSlug = null,
  pendingFriendsCount = 0,
  isAdmin = false,
}: UserMenuProps) {
  const router = useRouter();
  const [feedbackOpen, setFeedbackOpen] = React.useState(false);
  const [feedbackKind, setFeedbackKind] = React.useState<"confusing" | "bug">(
    "confusing",
  );
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  async function handleSignOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("Sesión cerrada.");
          router.push("/");
          router.refresh();
        },
      },
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          aria-label="Abrir menú de usuario"
        >
          <Avatar className="size-8 ring-1 ring-inset ring-border">
            {user.image ? (
              <AvatarImage src={user.image} alt={user.name} />
            ) : null}
            <AvatarFallback className="bg-primary-soft text-[12px] font-bold text-primary-soft-foreground">
              {initials || <UserIcon className="size-4" />}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel className="font-normal">
          <div className="flex items-center gap-3">
            <Avatar className="size-9">
              {user.image ? (
                <AvatarImage src={user.image} alt={user.name} />
              ) : null}
              <AvatarFallback className="bg-primary-soft text-[13px] font-bold text-primary-soft-foreground">
                {initials || <UserIcon className="size-4" />}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[15px] font-bold text-foreground">
                {user.name}
              </p>
              <p className="truncate font-mono text-[13px] text-muted-foreground">
                @{user.username}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="md:hidden"
          onClick={() =>
            router.push(courseSlug ? `/app/c/${courseSlug}/ejercicios` : "/app")
          }
        >
          <Dumbbell className="size-4" />
          Ejercicios
        </DropdownMenuItem>
        <DropdownMenuItem
          className="md:hidden"
          onClick={() => router.push("/app/logros")}
        >
          <Trophy className="size-4" />
          Logros
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push("/app/amigos")}>
          <Users className="size-4" />
          <span className="flex-1">Amigos</span>
          {pendingFriendsCount > 0 ? (
            <span className="grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1.5 text-[11px] font-bold tabular-nums text-primary-foreground">
              {pendingFriendsCount}
            </span>
          ) : null}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push(`/app/perfil/${user.username}`)}>
          <UserIcon className="size-4" />
          Ver mi perfil público
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push("/app/perfil")}>
          <Settings className="size-4" />
          Configuración
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={(event) => {
            // El menú se cierra al elegir; abrimos el diálogo aparte para que
            // no se desmonte con él.
            event.preventDefault();
            setFeedbackKind("confusing");
            setFeedbackOpen(true);
          }}
        >
          <MessageSquarePlus className="size-4" />
          Enviar comentario
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={(event) => {
            event.preventDefault();
            setFeedbackKind("bug");
            setFeedbackOpen(true);
          }}
        >
          <Bug className="size-4" />
          Reportar un bug
        </DropdownMenuItem>
        {isAdmin ? (
          <DropdownMenuItem onClick={() => router.push("/app/admin")}>
            <ShieldCheck className="size-4" />
            Panel interno
          </DropdownMenuItem>
        ) : null}
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={handleSignOut}>
          <LogOut className="size-4" />
          Cerrar sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
      <FeedbackDialog
        open={feedbackOpen}
        onOpenChange={setFeedbackOpen}
        defaultKind={feedbackKind}
      />
    </DropdownMenu>
  );
}
