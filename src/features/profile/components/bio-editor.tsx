"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Pencil, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateBio } from "@/features/profile/actions";

interface BioEditorProps {
  initialBio: string;
}

const MAX = 160;

export function BioEditor({ initialBio }: BioEditorProps) {
  const router = useRouter();
  const [editing, setEditing] = React.useState(false);
  const [value, setValue] = React.useState(initialBio);
  const [pending, startTransition] = React.useTransition();

  function save() {
    const trimmed = value.trim();
    startTransition(async () => {
      try {
        await updateBio({ bio: trimmed.length > 0 ? trimmed : null });
        setEditing(false);
        toast.success("Bio actualizada");
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "No se pudo guardar");
      }
    });
  }

  if (!editing) {
    return (
      <div className="flex items-start justify-between gap-3">
        {initialBio ? (
          <p className="flex-1 text-sm text-foreground/90">{initialBio}</p>
        ) : (
          <p className="flex-1 text-sm italic text-muted-foreground/80">
            Sin bio. Cuéntale al mundo qué te trajo a C++.
          </p>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setValue(initialBio);
            setEditing(true);
          }}
        >
          <Pencil className="size-3.5" />
          {initialBio ? "Editar" : "Agregar"}
        </Button>
      </div>
    );
  }

  const remaining = MAX - value.length;
  const tooLong = remaining < 0;

  return (
    <div className="space-y-2">
      <Input
        autoFocus
        value={value}
        onChange={(e) => setValue(e.currentTarget.value)}
        maxLength={MAX + 20}
        placeholder="Una línea sobre ti…"
        invalid={tooLong}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !tooLong) save();
          if (e.key === "Escape") setEditing(false);
        }}
      />
      <div className="flex items-center justify-between gap-2">
        <span
          className={`font-mono text-[11px] tabular-nums ${
            tooLong ? "text-destructive" : "text-muted-foreground"
          }`}
        >
          {remaining} restantes
        </span>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setEditing(false)}
            disabled={pending}
          >
            <X />
            Cancelar
          </Button>
          <Button size="sm" onClick={save} loading={pending} disabled={tooLong}>
            Guardar
          </Button>
        </div>
      </div>
    </div>
  );
}
