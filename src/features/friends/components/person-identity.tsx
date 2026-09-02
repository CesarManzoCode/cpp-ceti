import Link from "next/link";

import { cn } from "@/lib/utils";
import { FriendAvatar } from "./friend-avatar";

interface PersonIdentityProps {
  name: string;
  username: string;
  image?: string | null;
  /**
   * Línea secundaria bajo el nombre. Si no se pasa, se muestra el
   * `@usuario` — que es la identidad pública en toda la app.
   */
  meta?: React.ReactNode;
  /** Si se pasa, avatar y nombre son un solo destino táctil. */
  href?: string;
  onNavigate?: () => void;
  className?: string;
}

/**
 * Avatar + nombre + línea de contexto: la MISMA fila de identidad en
 * amigos, búsqueda, solicitudes y descubrimiento, para que una persona se
 * vea igual en todas las superficies sociales.
 */
export function PersonIdentity({
  name,
  username,
  image,
  meta,
  href,
  onNavigate,
  className,
}: PersonIdentityProps) {
  const body = (
    <>
      <FriendAvatar name={name} image={image} className="shrink-0" />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[15px] font-bold text-foreground">
          {name}
        </span>
        <span className="mt-0.5 block truncate text-[13px] font-medium text-muted-foreground">
          {meta ?? `@${username}`}
        </span>
      </span>
    </>
  );

  if (!href) {
    return (
      <div className={cn("flex min-w-0 flex-1 items-center gap-3", className)}>
        {body}
      </div>
    );
  }

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        "flex min-w-0 flex-1 items-center gap-3 rounded-[var(--radius-sm)]",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        className,
      )}
    >
      {body}
    </Link>
  );
}
