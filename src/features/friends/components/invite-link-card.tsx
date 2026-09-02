"use client";

import * as React from "react";
import { Check, Copy, Share2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trackInviteLinkCopied } from "@/features/invites/actions";
import { PRODUCT_NAME } from "@/lib/branding";

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
      void trackInviteLinkCopied();
    } catch {
      toast.error("No pudimos copiar el link");
    }
  }

  async function share() {
    if (!inviteUrl) return;
    const text = `Te invito a programar conmigo en ${PRODUCT_NAME}: ${inviteUrl}`;
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({
          title: PRODUCT_NAME,
          text: "Aprende C++ con lecciones interactivas",
          url: inviteUrl,
        });
        void trackInviteLinkCopied();
        return;
      } catch {
        // usuario cerró el panel; cae al WhatsApp web
      }
    }
    const wa = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(wa, "_blank", "noopener");
    void trackInviteLinkCopied();
  }

  return (
    <div className="space-y-3 rounded-[var(--radius-lg)] border border-border bg-card p-5 shadow-[var(--shadow-xs)]">
      <p className="text-[14px] leading-relaxed text-muted-foreground">
        Cualquiera con este link puede mandarte solicitud con un clic.
      </p>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          readOnly
          value={inviteUrl}
          onFocus={(e) => e.currentTarget.select()}
          className="font-mono text-[13px]"
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
