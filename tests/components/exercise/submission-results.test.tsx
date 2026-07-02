import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { SubmissionResults } from "@/components/exercise/submission-results";
import type { SubmissionState } from "@/components/exercise/types";

function makeSubmission(overrides: Partial<SubmissionState> = {}): SubmissionState {
  return {
    passed: false,
    feedback: "0 de 1 tests aprobados.",
    results: [
      {
        testId: "t1",
        passed: false,
        visible: true,
        description: "Las 3 líneas exactas",
        expectedStdout:
          "Nombre: Aurora\nCarrera: Desarrollo de Software\nCETI Colomos\n",
        actualStdout:
          "Nombre: Aurora\nCarrera: Desarrollo de software\nCETI Colomos\n",
        stderr: "",
        status: "wrong_answer",
        durationMs: 100,
      },
    ],
    ...overrides,
  };
}

describe("SubmissionResults", () => {
  it("resalta y explica la primera diferencia en tests fallidos visibles", () => {
    const html = renderToStaticMarkup(
      <SubmissionResults submission={makeSubmission()} onTryAgain={() => {}} />,
    );
    expect(html).toContain("<mark");
    expect(html).toContain("línea 2");
    expect(html).toContain("mayúsculas");
  });

  it("cae a los bloques simples cuando el fallo no es de salida", () => {
    const html = renderToStaticMarkup(
      <SubmissionResults
        submission={makeSubmission({
          results: [
            {
              testId: "t1",
              passed: false,
              visible: true,
              description: null,
              expectedStdout: "42\n",
              actualStdout: "42\n",
              stderr: "segfault",
              status: "runtime_error",
              durationMs: 5,
            },
          ],
        })}
        onTryAgain={() => {}}
      />,
    );
    expect(html).not.toContain("<mark");
    expect(html).toContain("stderr");
  });
});
