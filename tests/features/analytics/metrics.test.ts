import { describe, expect, it } from "vitest";

import {
  activeUsersByDay,
  computeExerciseFriction,
  computeFunnel,
  computeHintUsage,
  computeRunToSubmit,
  computeStepDropoff,
  countActiveUsers,
  countByCategory,
  firstActivityByUser,
  percentile,
  rankFriction,
  ratio,
  summarizeStudySessions,
  weeklyRetention,
} from "@/features/analytics/metrics";

const d = (iso: string) => new Date(iso);

describe("usuarios activos", () => {
  const rows = [
    { userId: "u1", at: d("2026-08-01T10:00:00Z") },
    { userId: "u1", at: d("2026-08-01T11:00:00Z") },
    { userId: "u2", at: d("2026-08-02T10:00:00Z") },
  ];

  it("cuenta personas, no eventos", () => {
    expect(countActiveUsers(rows)).toBe(2);
  });

  it("agrupa por día UTC sin duplicar a la misma persona", () => {
    expect(activeUsersByDay(rows)).toEqual([
      { day: "2026-08-01", users: 1 },
      { day: "2026-08-02", users: 1 },
    ]);
  });

  it("la primera actividad es la más antigua de cada persona", () => {
    const first = firstActivityByUser(rows);
    expect(first.get("u1")).toEqual(d("2026-08-01T10:00:00Z"));
    expect(first.has("u3")).toBe(false);
  });
});

describe("retención por cohorte", () => {
  it("agrupa por semana de primera actividad y mide regresos", () => {
    // Lunes 2026-08-03. u1 vuelve la semana siguiente; u2 no.
    const activity = [
      { userId: "u1", at: d("2026-08-04T10:00:00Z") },
      { userId: "u1", at: d("2026-08-12T10:00:00Z") },
      { userId: "u2", at: d("2026-08-05T10:00:00Z") },
    ];
    const cohorts = weeklyRetention(firstActivityByUser(activity), activity, 3);

    expect(cohorts).toHaveLength(1);
    expect(cohorts[0].cohort).toBe("2026-08-03");
    expect(cohorts[0].size).toBe(2);
    expect(cohorts[0].returned[0]).toBe(2); // semana de arranque
    expect(cohorts[0].returned[1]).toBe(1); // sólo u1 volvió
    expect(cohorts[0].returned[2]).toBe(0);
  });

  it("no cuenta a un usuario en la cohorte de otra semana", () => {
    const activity = [
      { userId: "u1", at: d("2026-08-04T10:00:00Z") },
      { userId: "u2", at: d("2026-08-11T10:00:00Z") },
    ];
    const cohorts = weeklyRetention(firstActivityByUser(activity), activity, 2);
    expect(cohorts.map((c) => [c.cohort, c.size])).toEqual([
      ["2026-08-03", 1],
      ["2026-08-10", 1],
    ]);
  });
});

describe("sesiones de estudio", () => {
  it("resume tiempo activo y distingue sesiones abiertas o vacías", () => {
    const summary = summarizeStudySessions([
      {
        userId: "u1",
        surface: "lesson",
        startedAt: d("2026-08-01T10:00:00Z"),
        endedAt: d("2026-08-01T10:20:00Z"),
        lastPingAt: d("2026-08-01T10:20:00Z"),
        engagedMs: 600_000,
      },
      {
        userId: "u1",
        surface: "practice",
        startedAt: d("2026-08-01T11:00:00Z"),
        endedAt: null,
        lastPingAt: d("2026-08-01T11:01:00Z"),
        engagedMs: 60_000,
      },
      {
        userId: "u2",
        surface: "lesson",
        startedAt: d("2026-08-01T12:00:00Z"),
        endedAt: null,
        lastPingAt: d("2026-08-01T12:00:00Z"),
        engagedMs: 0,
      },
    ]);

    expect(summary.sessions).toBe(3);
    expect(summary.users).toBe(2);
    expect(summary.engagedMsTotal).toBe(660_000);
    expect(summary.openSessions).toBe(2);
    expect(summary.zeroEngagementSessions).toBe(1);
  });

  it("percentile no revienta con listas vacías", () => {
    expect(percentile([], 0.5)).toBe(0);
    expect(percentile([1, 2, 3, 4], 0.5)).toBe(2);
  });
});

describe("funnel", () => {
  const input = {
    viewers: [
      { resourceId: "l1", userId: "u1" },
      { resourceId: "l1", userId: "u1" }, // misma persona dos veces
      { resourceId: "l1", userId: "u2" },
      { resourceId: "l1", userId: "u3" },
    ],
    engaged: [
      { resourceId: "l1", userId: "u1" },
      { resourceId: "l1", userId: "u2" },
    ],
    completed: [{ resourceId: "l1", userId: "u1" }],
  };

  it("cuenta usuarios distintos: abrir dos veces no infla el denominador", () => {
    const [row] = computeFunnel(input);
    expect(row.viewers).toBe(3);
    expect(row.engaged).toBe(2);
    expect(row.completed).toBe(1);
  });

  it("separa rebote (abrió y no tocó) de abandono (empezó y no terminó)", () => {
    const [row] = computeFunnel(input);
    expect(row.bouncedViewers).toBe(1); // u3
    expect(row.abandonedAfterEngaging).toBe(1); // u2
    expect(row.completionRate).toBeCloseTo(1 / 3);
  });

  it("no produce NaN cuando no hubo vistas", () => {
    const [row] = computeFunnel({
      viewers: [],
      engaged: [],
      completed: [{ resourceId: "l9", userId: "u1" }],
    });
    expect(row.engagementRate).toBe(0);
    expect(row.completionRate).toBe(0);
  });
});

describe("abandono dentro de la lección", () => {
  it("atribuye la caída al último paso que vio cada quien", () => {
    const rows = computeStepDropoff([
      { lessonStepId: "s1", userId: "u1", stepIndex: 0 },
      { lessonStepId: "s2", userId: "u1", stepIndex: 1 },
      { lessonStepId: "s1", userId: "u2", stepIndex: 0 },
      { lessonStepId: "s1", userId: "u3", stepIndex: 0 },
      { lessonStepId: "s2", userId: "u3", stepIndex: 1 },
      { lessonStepId: "s3", userId: "u3", stepIndex: 2 },
    ]);

    expect(rows.map((r) => [r.lessonStepId, r.viewers, r.droppedHere])).toEqual([
      ["s1", 3, 1], // sólo u2 se quedó en el primer paso
      ["s2", 2, 1], // u1
      ["s3", 1, 1], // u3 (fin de la lección: también "se queda" aquí)
    ]);
  });
});

describe("fricción por ejercicio", () => {
  const attempts = [
    // u1 aprueba a la primera
    { userId: "u1", exerciseId: "e1", passed: true, createdAt: d("2026-08-01T10:00:00Z") },
    // u2 falla dos veces y aprueba a la tercera
    { userId: "u2", exerciseId: "e1", passed: false, createdAt: d("2026-08-01T10:00:00Z") },
    { userId: "u2", exerciseId: "e1", passed: false, createdAt: d("2026-08-01T10:05:00Z") },
    { userId: "u2", exerciseId: "e1", passed: true, createdAt: d("2026-08-01T10:10:00Z") },
    // u3 nunca aprueba
    { userId: "u3", exerciseId: "e1", passed: false, createdAt: d("2026-08-01T11:00:00Z") },
  ];

  it("first-pass rate se mide sobre el PRIMER envío de cada persona", () => {
    const [row] = computeExerciseFriction(attempts);
    expect(row.users).toBe(3);
    expect(row.firstPassUsers).toBe(1);
    expect(row.firstPassRate).toBeCloseTo(1 / 3);
    expect(row.unsolvedUsers).toBe(1);
    expect(row.totalAttempts).toBe(5);
  });

  it("los envíos hasta aprobar sólo cuentan a quienes aprobaron", () => {
    const [row] = computeExerciseFriction(attempts);
    // u1 => 1, u2 => 3; mediana con 2 datos toma el bajo.
    expect(row.medianAttemptsToPass).toBe(1);
  });

  it("no se deja engañar por el orden de llegada de las filas", () => {
    const shuffled = [attempts[3], attempts[1], attempts[2], attempts[0], attempts[4]];
    expect(computeExerciseFriction(shuffled)[0]).toEqual(
      computeExerciseFriction(attempts)[0],
    );
  });

  it("el ranking exige un mínimo de usuarios para no rankear ruido", () => {
    const rows = computeExerciseFriction([
      ...attempts,
      { userId: "u9", exerciseId: "e2", passed: false, createdAt: d("2026-08-01T10:00:00Z") },
    ]);
    expect(rows.map((r) => r.exerciseId)).toContain("e2");
    expect(rankFriction(rows, 3).map((r) => r.exerciseId)).toEqual(["e1"]);
  });
});

describe("uso de pistas", () => {
  it("cruza pistas con el resultado del primer envío", () => {
    const attempts = [
      { userId: "u1", exerciseId: "e1", passed: true, createdAt: d("2026-08-01T10:00:00Z") },
      { userId: "u2", exerciseId: "e1", passed: false, createdAt: d("2026-08-01T10:00:00Z") },
      { userId: "u2", exerciseId: "e1", passed: true, createdAt: d("2026-08-01T10:10:00Z") },
    ];
    const hints = [
      { userId: "u2", exerciseId: "e1", hintIndex: 0 },
      { userId: "u2", exerciseId: "e1", hintIndex: 1 },
    ];

    const [row] = computeHintUsage(attempts, hints);
    expect(row.users).toBe(2);
    expect(row.usersWithHints).toBe(1);
    expect(row.avgHintsWhenUsed).toBe(2);
    expect(row.firstPassRateWithHints).toBe(0);
    expect(row.firstPassRateWithoutHints).toBe(1);
  });

  it("no divide entre cero cuando nadie usó pistas", () => {
    const [row] = computeHintUsage(
      [{ userId: "u1", exerciseId: "e1", passed: true, createdAt: d("2026-08-01T10:00:00Z") }],
      [],
    );
    expect(row.hintUsageRate).toBe(0);
    expect(row.firstPassRateWithHints).toBe(0);
  });
});

describe("compilar → calificar", () => {
  const runs = [
    { userId: "u1", exerciseId: "e1", at: d("2026-08-01T10:00:00Z"), outcome: "compile_error" },
    { userId: "u1", exerciseId: "e1", at: d("2026-08-01T10:01:00Z"), outcome: "success" },
    { userId: "u2", exerciseId: "e1", at: d("2026-08-01T10:00:00Z"), outcome: "success" },
    // corrió DESPUÉS de enviar: no cuenta como "antes del primer envío"
    { userId: "u1", exerciseId: "e1", at: d("2026-08-01T10:30:00Z"), outcome: "success" },
  ];
  const attempts = [
    { userId: "u1", exerciseId: "e1", passed: true, createdAt: d("2026-08-01T10:05:00Z") },
  ];

  it("cuenta compilaciones previas al primer envío", () => {
    const [row] = computeRunToSubmit(runs, attempts);
    expect(row.runs).toBe(4);
    expect(row.submissions).toBe(1);
    expect(row.avgRunsBeforeFirstSubmit).toBe(2);
  });

  it("identifica a quien compila y nunca envía", () => {
    const [row] = computeRunToSubmit(runs, attempts);
    expect(row.usersWhoRan).toBe(2);
    expect(row.usersWhoNeverSubmitted).toBe(1); // u2
  });

  it("agrupa los errores de compilación por categoría", () => {
    expect(
      countByCategory([
        { outcome: "compile_error", errorCategory: "missing_semicolon" },
        { outcome: "compile_error", errorCategory: "missing_semicolon" },
        { outcome: "compile_error", errorCategory: null },
        { outcome: "success", errorCategory: null },
      ]),
    ).toEqual([
      { category: "missing_semicolon", count: 2 },
      { category: "other_compile_error", count: 1 },
    ]);
  });
});

describe("ratio", () => {
  it("devuelve 0 en vez de NaN o Infinity", () => {
    expect(ratio(3, 0)).toBe(0);
    expect(ratio(0, 0)).toBe(0);
    expect(ratio(1, 4)).toBe(0.25);
  });
});
