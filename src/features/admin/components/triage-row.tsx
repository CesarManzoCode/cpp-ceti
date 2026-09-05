"use client";

import * as React from "react";
import Link from "next/link";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  updateReportStatus,
  type ReportKind,
  type ReportStatusInput,
} from "@/features/admin/actions";
import type { TriageItem } from "@/features/admin/queries";

const STATUSES: { value: ReportStatusInput; label: string }[] = [
  { value: "open", label: "Abierto" },
  { value: "triaged", label: "Triaged" },
  { value: "resolved", label: "Resuelto" },
  { value: "duplicate", label: "Duplicado" },
  { value: "wontfix", label: "No se arregla" },
];

const FEEDBACK_KIND_LABEL: Record<string, string> = {
  discrepancy: "Discrepancia con clase",
  confusing: "Confuso",
  idea: "Idea",
  praise: "Elogio",
  other: "Otro",
};

const STATUS_VARIANT: Record<string, "default" | "secondary" | "success" | "warning"> = {
  open: "warning",
  triaged: "default",
  resolved: "success",
  duplicate: "secondary",
  wontfix: "secondary",
};

/**
 * Una fila de la cola de triage con su formulario de resolución.
 * Guarda evidencia (nota + issue + PR) para poder reconstruir después
 * feedback → decisión → cambio → resultado.
 */
export function TriageRow({ item }: { item: TriageItem }) {
  const [status, setStatus] = React.useState<ReportStatusInput>(
    item.status as ReportStatusInput,
  );
  const [note, setNote] = React.useState(item.resolutionNote ?? "");
  const [issueUrl, setIssueUrl] = React.useState(item.issueUrl ?? "");
  const [prUrl, setPrUrl] = React.useState(item.prUrl ?? "");
  const [saving, setSaving] = React.useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      await updateReportStatus({
        kind: item.kind as ReportKind,
        id: item.id,
        status,
        resolutionNote: note,
        issueUrl,
        prUrl,
      });
      toast.success("Reporte actualizado.");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "No pudimos guardar el cambio.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <article className="space-y-3 rounded-[var(--radius-lg)] border border-border bg-card p-4">
      <header className="flex flex-wrap items-center gap-2">
        <Badge
          variant={
            item.kind === "bug" || item.feedbackKind === "discrepancy"
              ? "destructive"
              : "info"
          }
          size="md"
        >
          {item.kind === "bug"
            ? "Bug de contenido"
            : `Feedback · ${
                FEEDBACK_KIND_LABEL[item.feedbackKind ?? ""] ?? item.feedbackKind
              }`}
        </Badge>
        <Badge variant={STATUS_VARIANT[item.status] ?? "secondary"} size="md">
          {item.status}
        </Badge>
        <span className="text-[13px] text-muted-foreground">
          @{item.authorUsername} ·{" "}
          {item.createdAt.toISOString().slice(0, 16).replace("T", " ")} UTC
        </span>
        <span className="ml-auto text-[13px] font-semibold">
          {item.href ? (
            <Link href={item.href} className="text-primary hover:underline">
              {item.target}
            </Link>
          ) : (
            item.target
          )}
        </span>
      </header>

      <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-foreground">
        {item.message}
      </p>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-1.5">
          <Label htmlFor={`status-${item.id}`}>Estado</Label>
          <select
            id={`status-${item.id}`}
            value={status}
            onChange={(e) => setStatus(e.target.value as ReportStatusInput)}
            className="h-9 w-full rounded-[var(--radius-xs)] border border-input bg-surface px-2 text-sm"
          >
            {STATUSES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`issue-${item.id}`}>Issue</Label>
          <Input
            id={`issue-${item.id}`}
            value={issueUrl}
            onChange={(e) => setIssueUrl(e.target.value)}
            placeholder="https://github.com/…/issues/12"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`pr-${item.id}`}>PR</Label>
          <Input
            id={`pr-${item.id}`}
            value={prUrl}
            onChange={(e) => setPrUrl(e.target.value)}
            placeholder="https://github.com/…/pull/34"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`note-${item.id}`}>Nota de resolución</Label>
          <Input
            id={`note-${item.id}`}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Qué se decidió y por qué"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button onClick={handleSave} loading={saving} size="sm">
          Guardar
        </Button>
        {item.triagedAt ? (
          <span className="text-[12px] text-subtle-foreground">
            Triaged: {item.triagedAt.toISOString().slice(0, 10)}
          </span>
        ) : null}
        {item.resolvedAt ? (
          <span className="text-[12px] text-subtle-foreground">
            Cerrado: {item.resolvedAt.toISOString().slice(0, 10)}
          </span>
        ) : null}
      </div>
    </article>
  );
}
