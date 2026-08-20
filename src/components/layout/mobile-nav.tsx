"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dumbbell, Home, Trophy, User, Users } from "lucide-react";

import { cn } from "@/lib/utils";

const items: {
  href: string;
  label: string;
  icon: typeof Home;
  exact?: boolean;
  badgeKey?: "friends";
}[] = [
  { href: "/app", label: "Inicio", icon: Home, exact: true },
  { href: "/app/ejercicios", label: "Práctica", icon: Dumbbell },
  { href: "/app/logros", label: "Logros", icon: Trophy },
  { href: "/app/amigos", label: "Amigos", icon: Users, badgeKey: "friends" },
  { href: "/app/perfil", label: "Perfil", icon: User },
];

/**
 * Navegación de móvil: una barra inferior al alcance del pulgar, con
 * cinco destinos y objetivos táctiles de 56px. El rail de escritorio
 * simplemente no existe aquí — el ancho completo es para el contenido.
 */
export function MobileNav({
  pendingFriendsCount = 0,
}: {
  pendingFriendsCount?: number;
}) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navegación"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 backdrop-blur-md lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="mx-auto flex max-w-lg items-stretch">
        {items.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          const badge =
            item.badgeKey === "friends" && pendingFriendsCount > 0
              ? pendingFriendsCount
              : null;

          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex h-16 flex-col items-center justify-center gap-1 text-[11px] font-semibold transition-colors",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                <span className="relative">
                  <item.icon
                    className="size-[22px]"
                    strokeWidth={active ? 2.5 : 2}
                    aria-hidden
                  />
                  {badge ? (
                    <span
                      className="absolute -right-2 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold tabular-nums text-primary-foreground"
                      aria-label={`${badge} solicitudes pendientes`}
                    >
                      {badge}
                    </span>
                  ) : null}
                </span>
                {item.label}
                {active ? (
                  <span
                    aria-hidden
                    className="absolute inset-x-[22%] top-0 h-[3px] rounded-b-full bg-primary"
                  />
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
