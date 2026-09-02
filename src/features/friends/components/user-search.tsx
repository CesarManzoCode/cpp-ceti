"use client";

import * as React from "react";
import Link from "next/link";
import { Search, UserPlus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sendFriendRequest } from "@/features/friends/actions";
import {
  searchUsersAction,
  type SearchActionResult,
} from "@/features/friends/search-action";
import { PersonIdentity } from "./person-identity";

interface UserSearchProps {
  meUsername: string;
}

type ResultItem = SearchActionResult[number] & { pending?: boolean };

export function UserSearch({ meUsername }: UserSearchProps) {
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<ResultItem[]>([]);
  const [searching, setSearching] = React.useState(false);
  const [hasSearched, setHasSearched] = React.useState(false);
  const [failed, setFailed] = React.useState(false);

  const trimmed = query.trim();
  // Render-derived: cuando el query está vacío o muy corto no mostramos
  // resultados previos, sin tocar el state desde el effect.
  const displayResults = trimmed.length < 2 ? [] : results;
  const displayHasSearched = trimmed.length < 2 ? false : hasSearched;

  React.useEffect(() => {
    if (trimmed.length < 2) return;
    let cancelled = false;
    const handle = setTimeout(async () => {
      setSearching(true);
      try {
        const data = await searchUsersAction({ query: trimmed });
        if (cancelled) return;
        setResults(data);
        setHasSearched(true);
        setFailed(false);
      } catch {
        if (!cancelled) setFailed(true);
      } finally {
        if (!cancelled) setSearching(false);
      }
    }, 250);

    return () => {
      cancelled = true;
      clearTimeout(handle);
    };
  }, [trimmed]);

  async function handleAdd(user: ResultItem) {
    setResults((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, pending: true } : u)),
    );
    try {
      const result = await sendFriendRequest({ username: user.username, source: "search" });
      setResults((prev) =>
        prev.map((u) =>
          u.id === user.id
            ? {
                ...u,
                pending: false,
                state:
                  result.status === "accepted"
                    ? "friends"
                    : "pending_outgoing",
              }
            : u,
        ),
      );
      if (result.status === "accepted") {
        toast.success(`Ahora eres amigo de @${user.username}`);
      } else if (result.status === "sent") {
        toast.success(`Solicitud enviada a @${user.username}`);
      } else {
        toast.message("Esa solicitud ya estaba activa");
      }
    } catch (err) {
      setResults((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, pending: false } : u)),
      );
      toast.error(err instanceof Error ? err.message : "No se pudo enviar");
    }
  }

  return (
    <div className="space-y-4">
      <Input
        type="search"
        placeholder="Busca por @usuario o por nombre…"
        leadingIcon={<Search className="size-4" />}
        value={query}
        onChange={(e) => setQuery(e.currentTarget.value)}
        autoFocus
        spellCheck={false}
        autoComplete="off"
        aria-label="Buscar usuarios"
      />

      {trimmed.length === 0 ? (
        <p className="text-[14px] text-muted-foreground">
          Tu handle es{" "}
          <span className="font-mono text-foreground">@{meUsername}</span>.
          Compártelo para que otros te encuentren.
        </p>
      ) : trimmed.length < 2 ? (
        <p className="text-[14px] text-muted-foreground">
          Escribe al menos 2 caracteres.
        </p>
      ) : searching ? (
        <p className="text-[14px] text-muted-foreground">Buscando…</p>
      ) : failed ? (
        <p className="text-[14px] text-destructive" role="alert">
          No pudimos buscar ahorita. Revisa tu conexión e intenta de nuevo.
        </p>
      ) : displayResults.length === 0 && displayHasSearched ? (
        <p className="text-[14px] text-muted-foreground">
          Nadie con ese nombre. Revisa la ortografía o invítalos por link.
        </p>
      ) : (
        <ul className="border-y border-border">
          {displayResults.map((user) => (
            <li
              key={user.id}
              className="flex items-center gap-3 border-b border-border py-3 last:border-b-0"
            >
              <PersonIdentity
                name={user.name}
                username={user.username}
                image={user.image}
                href={`/app/perfil/${user.username}`}
              />
              <ResultAction user={user} onAdd={() => handleAdd(user)} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ResultAction({
  user,
  onAdd,
}: {
  user: ResultItem;
  onAdd: () => void;
}) {
  if (user.state === "friends") {
    return (
      <span className="shrink-0 text-[13px] font-bold text-success">Amigos</span>
    );
  }
  if (user.state === "pending_outgoing") {
    return (
      <span className="shrink-0 text-[13px] font-semibold text-muted-foreground">
        Pendiente
      </span>
    );
  }
  if (user.state === "pending_incoming") {
    return (
      <Button size="default" asChild className="shrink-0">
        <Link href="/app/amigos?tab=solicitudes">Responder</Link>
      </Button>
    );
  }
  if (user.state === "blocked_by_me" || user.state === "blocked_by_them") {
    return (
      <span className="shrink-0 text-[13px] font-semibold text-muted-foreground">
        Bloqueado
      </span>
    );
  }
  return (
    <Button
      size="default"
      onClick={onAdd}
      loading={user.pending}
      aria-label={`Agregar a @${user.username}`}
      className="shrink-0"
    >
      <UserPlus />
      Agregar
    </Button>
  );
}
