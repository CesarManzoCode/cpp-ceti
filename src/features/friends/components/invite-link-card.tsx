"use client";

import * as React from "react";
import { Check, Copy, Link2, Share2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface InviteLinkCardProps {
  username: string;
}

const subscribeNoop = () => () => {};

export function InviteLinkCard({ username }: InviteLinkCardProps) {
  // useSyncExternalStore evita un setState-en-effect para hidratar el origin
  // del navegador. Server snapshot devuelve "" (la URL se completa al hidratar).
  const origin = React.useSyncExternalStore(
    subscribeNoop,
    () => window.location.origin,
    () => "",
  );
  const [copied, setCopied] = React.useState(false);

  const inviteUrl = origin ? `${origin}/invitar/${username}` : "";

  async function copy() {
    if (!inviteUrl) return;
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      toast.success("Link copiado al portapapeles");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("No pudimos copiar el link");
    }
  }

  async function share() {
    if (!inviteUrl) return;
    const text = `Te invito a aprender C++ conmigo en C++ CETI: ${inviteUrl}`;
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({
          title: "C++ CETI",
          text: "Aprende C++ con lecciones interactivas",
          url: inviteUrl,
        });
        return;
      } catch {
        // usuario cerró el panel; cae al WhatsApp web
      }
    }
    const wa = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(wa, "_blank", "noopener");
  }

  return (
    <div className="space-y-3 rounded-[var(--radius-lg)] border border-border bg-card p-4 shadow-[var(--shadow-xs)] sm:p-5">
      <div className="flex items-start gap-3">
        <div className="grid size-9 shrink-0 place-items-center rounded-[var(--radius-md)] bg-primary-soft text-primary-soft-foreground">
          <Link2 className="size-4" aria-hidden />
        </div>
        <div className="min-w-0 flex-1 space-y-0.5">
          <p className="text-sm font-semibold tracking-tight">Tu link de invitación</p>
          <p className="text-xs text-muted-foreground">
            Cualquiera con este link puede mandarte solicitud con un clic.
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          readOnly
          value={inviteUrl}
          onFocus={(e) => e.currentTarget.select()}
          className="font-mono text-xs"
          aria-label="Link de invitación"
        />
        <div className="flex gap-2 sm:shrink-0">
          <Button
            type="button"
            variant="outline"
            size="default"
            onClick={copy}
            disabled={!inviteUrl}
            className="flex-1 sm:flex-none"
          >
            {copied ? <Check /> : <Copy />}
            {copied ? "Copiado" : "Copiar"}
          </Button>
          <Button
            type="button"
            size="default"
            onClick={share}
            disabled={!inviteUrl}
            className="flex-1 sm:flex-none"
          >
            <Share2 />
            Compartir
          </Button>
        </div>
      </div>
    </div>
  );
}
