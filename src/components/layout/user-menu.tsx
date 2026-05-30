"use client";

import { useRouter } from "next/navigation";
import {
  Dumbbell,
  LogOut,
  Settings,
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
import { authClient } from "@/lib/auth-client";

interface UserMenuProps {
  user: {
    name: string;
    email: string;
    image?: string | null;
    username: string;
  };
  pendingFriendsCount?: number;
}

export function UserMenu({ user, pendingFriendsCount = 0 }: UserMenuProps) {
  const router = useRouter();
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
            <AvatarFallback className="bg-primary-soft text-xs font-semibold text-primary-soft-foreground">
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
              <AvatarFallback className="bg-primary-soft text-xs font-semibold text-primary-soft-foreground">
                {initials || <UserIcon className="size-4" />}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">
                {user.name}
              </p>
              <p className="truncate font-mono text-xs text-muted-foreground">
                @{user.username}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="md:hidden"
          onClick={() => router.push("/app/ejercicios")}
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
            <span className="grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 font-mono text-[10px] font-semibold tabular-nums text-primary-foreground">
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
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={handleSignOut}>
          <LogOut className="size-4" />
          Cerrar sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
