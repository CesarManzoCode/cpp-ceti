"use client";

import * as React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateAcademicProfile } from "@/features/academic/actions";
import type { AcademicOfferingOption } from "@/features/academic/queries";
import { cn } from "@/lib/utils";

const selectClass = cn(
  "h-11 w-full rounded-[var(--radius-md)] border border-border bg-surface px-3 text-[14px] font-medium text-foreground",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-50",
);

interface Props {
  options: AcademicOfferingOption[];
  initial: {
    offeringId: string | null;
    semester: number | null;
    group: string | null;
  };
}

export function AcademicProfileEditor({ options, initial }: Props) {
  const campuses = React.useMemo(() => {
    const seen = new Map<string, { id: string; name: string }>();
    for (const o of options) seen.set(o.campusId, { id: o.campusId, name: o.campusName });
    return [...seen.values()].sort((a, b) => a.name.localeCompare(b.name, "es"));
  }, [options]);

  const initialOffering = options.find((o) => o.id === initial.offeringId) ?? null;
  const [campusId, setCampusId] = React.useState(initialOffering?.campusId ?? "");
  const [offeringId, setOfferingId] = React.useState(initial.offeringId ?? "");
  const [semester, setSemester] = React.useState(initial.semester ? String(initial.semester) : "");
  const [group, setGroup] = React.useState(initial.group ?? "");
  const [pending, startTransition] = React.useTransition();

  const programsForCampus = options.filter((o) => o.campusId === campusId);
  const selectedOffering = options.find((o) => o.id === offeringId) ?? null;
  // Falta el semestre: el botón se apaga, así que hay que decir por qué.
  const missingSemester = Boolean(offeringId) && !semester;

  function selectOffering(nextOfferingId: string) {
    setOfferingId(nextOfferingId);
    // Un semestre que no existe en la nueva carrera dejaría el select en
    // blanco con un valor "fantasma" en el state.
    const next = options.find((o) => o.id === nextOfferingId) ?? null;
    if (!next || (semester && Number(semester) > next.semesterCount)) {
      setSemester("");
    }
  }

  function save() {
    startTransition(async () => {
      try {
        await updateAcademicProfile({
          academicOfferingId: offeringId || null,
          academicSemester: offeringId && semester ? Number(semester) : null,
          academicGroup: offeringId && semester ? group : null,
        });
        toast.success("Perfil académico actualizado");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Algo salió mal");
      }
    });
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="academic-campus" className="mb-1.5 block text-[13px] font-bold text-muted-foreground">
            Plantel
          </label>
          <select
            id="academic-campus"
            className={selectClass}
            value={campusId}
            onChange={(e) => {
              setCampusId(e.currentTarget.value);
              selectOffering("");
            }}
          >
            <option value="">Elige tu plantel</option>
            {campuses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="academic-program" className="mb-1.5 block text-[13px] font-bold text-muted-foreground">
            Carrera
          </label>
          <select
            id="academic-program"
            className={selectClass}
            value={offeringId}
            onChange={(e) => selectOffering(e.currentTarget.value)}
            disabled={!campusId}
          >
            <option value="">Elige tu carrera</option>
            {programsForCampus.map((o) => (
              <option key={o.id} value={o.id}>
                {o.programName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedOffering ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="academic-semester" className="mb-1.5 block text-[13px] font-bold text-muted-foreground">
              Semestre
            </label>
            <select
              id="academic-semester"
              className={selectClass}
              value={semester}
              onChange={(e) => setSemester(e.currentTarget.value)}
            >
              <option value="">Semestre</option>
              {Array.from({ length: selectedOffering.semesterCount }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n}.º semestre
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="academic-group" className="mb-1.5 block text-[13px] font-bold text-muted-foreground">
              Grupo <span className="font-normal text-subtle-foreground">(opcional)</span>
            </label>
            <Input
              id="academic-group"
              value={group}
              onChange={(e) => setGroup(e.currentTarget.value)}
              placeholder="ej. 3A"
              maxLength={20}
            />
          </div>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <Button size="default" loading={pending} disabled={missingSemester} onClick={save}>
          Guardar
        </Button>
        {missingSemester ? (
          <p className="text-[13px] text-muted-foreground">
            Elige tu semestre para guardar.
          </p>
        ) : null}
      </div>
    </div>
  );
}
