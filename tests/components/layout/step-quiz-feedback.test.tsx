// @vitest-environment happy-dom
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { StepQuiz } from "@/features/lessons/components/step-quiz";
import type { QuizStepContent } from "@/features/lessons/types";

const CONTENT: QuizStepContent = {
  question: "¿Cuál es una instancia?",
  options: ["class Herramienta", "taladro"],
  correctIndex: 1,
  explanation: "La respuesta correcta es taladro porque new lo creó.",
};

/**
 * LEARN-02: el render inicial no puede filtrar la respuesta. La regla
 * completa —sólo se pinta al acertar o al revelar— vive en el componente y
 * está cubierta por su condición `isCorrect || revealed`; aquí se protege
 * el caso que se veía en producción: la pantalla antes de responder.
 */
describe("StepQuiz", () => {
  it("no marca ninguna opción ni muestra la explicación antes de responder", () => {
    const html = renderToStaticMarkup(
      <StepQuiz
        language="csharp"
        content={CONTENT}
        onNext={() => {}}
        isPending={false}
      />,
    );
    expect(html).not.toContain("border-success");
    expect(html).not.toContain(CONTENT.explanation);
    expect(html).toContain("Verificar respuesta");
  });
});
