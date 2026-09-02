"use client";

import * as React from "react";
import { Flame } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { requestFriendStreak } from "@/features/streaks/actions";

export function StartStreakButton({ userId }: { userId: string }) {
  const [sent, setSent] = React.useState(false);
  const [pending, startTransition] = React.useTransition();

  if (sent) {
    return (
      <Button variant="outline" size="default" disabled>
        <Flame className="size-4" />
        Racha propuesta
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="default"
      loading={pending}
      onClick={() =>
        startTransition(async () => {
          try {
            await requestFriendStreak({ userId });
            setSent(true);
            toast.success("Le propusiste una racha");
          } catch (err) {
            toast.error(err instanceof Error ? err.message : "Algo salió mal");
          }
        })
      }
    >
      <Flame className="size-4" />
      Iniciar racha
    </Button>
  );
}
