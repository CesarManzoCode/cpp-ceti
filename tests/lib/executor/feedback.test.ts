import { describe, expect, it } from "vitest";

import { buildFeedback } from "@/lib/executor/feedback";
import type { TestCaseResult } from "@/lib/executor";

function makeResult(
  passed: boolean,
  overrides: Partial<TestCaseResult> = {},
): TestCaseResult {
  return {
    testId: "t",
    passed,
    visible: true,
    description: null,
    expectedStdout: "",
    actualStdout: "",
    stderr: "",
    status: passed ? "accepted" : "wrong_answer",
    durationMs: 1,
    ...overrides,
  };
}

describe("buildFeedback", () => {
  it("celebra cuando pasan todos", () => {
    const out = buildFeedback([makeResult(true), makeResult(true)]);
    expect(out).toContain("2");
    expect(out).toMatch(/Pasaste/i);
  });

  it("reporta conteo cuando algunos fallan por wrong_answer", () => {
    const out = buildFeedback([
      makeResult(true),
      makeResult(false, { status: "wrong_answer" }),
      makeResult(false, { status: "wrong_answer" }),
    ]);
    expect(out).toMatch(/1 de 3/);
    expect(out).toMatch(/salida esperada/i);
  });

  it("identifica compile_error desde el primer fail", () => {
    const out = buildFeedback([
      makeResult(false, { status: "compile_error" }),
    ]);
    expect(out).toMatch(/no compila/i);
  });

  it("identifica time_limit", () => {
    const out = buildFeedback([makeResult(false, { status: "time_limit" })]);
    expect(out).toMatch(/tardó demasiado/i);
  });

  it("identifica runtime_error", () => {
    const out = buildFeedback([makeResult(false, { status: "runtime_error" })]);
    expect(out).toMatch(/runtime|memoria/i);
  });
});
