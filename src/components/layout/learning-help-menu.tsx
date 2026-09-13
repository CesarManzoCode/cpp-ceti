"use client";

import * as React from "react";
import { AlertTriangle, Flag, HelpCircle } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FeedbackDialog } from "@/features/feedback/components/feedback-dialog";
import { ReportBugDialog } from "@/features/bug-reports/components/report-bug-dialog";

type BugTarget = React.ComponentProps<typeof ReportBugDialog>["target"];

/**
 * "Ayuda y reporte" de la Learning Bar (blueprint UX/UI, D3/G6): un solo
 * menú, no una píldora ámbar permanente junto a un icono de bandera
 * suelto. "¿No es tu clase?" vive aquí adentro en vez de flotar como
 * chip fijo en la cabecera de cada lección.
 */
export function LearningHelpMenu({ bugTarget }: { bugTarget: BugTarget }) {
  const [discrepancyOpen, setDiscrepancyOpen] = React.useState(false);
  const [bugOpen, setBugOpen] = React.useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          className="inline-flex h-9 items-center gap-1.5 rounded-[var(--radius-sm)] px-2.5 text-[13px] font-semibold text-muted-foreground outline-none transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          aria-label="Ayuda y reporte"
        >
          <HelpCircle className="size-[18px]" aria-hidden />
          <span className="hidden sm:inline">Ayuda</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-72">
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              setDiscrepancyOpen(true);
            }}
          >
            <AlertTriangle className="text-warning" />
            ¿No corresponde con tu clase?
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              setBugOpen(true);
            }}
          >
            <Flag />
            Reportar un problema aquí
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <FeedbackDialog
        defaultKind="discrepancy"
        open={discrepancyOpen}
        onOpenChange={setDiscrepancyOpen}
      />
      <ReportBugDialog target={bugTarget} open={bugOpen} onOpenChange={setBugOpen} />
    </>
  );
}
