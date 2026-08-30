/**
 * Señal pedagógica de un paso interactivo.
 *
 * Existe porque hasta ahora esto moría en el estado de React: un quiz
 * fallado tres veces y luego revelado era indistinguible de uno acertado a
 * la primera. El componente de paso reporta la señal; el reproductor la
 * traduce a un evento de producto (ver `src/lib/analytics/events.ts`).
 *
 * El ORDINAL del intento no viaja aquí a propósito: lo lleva el reproductor
 * (`LessonViewer`), que sobrevive a que el alumno vaya y vuelva al paso. El
 * contador local de un componente se reinicia al remontarse, y con él se
 * repetía la clave de idempotencia del intento anterior.
 *
 * Sólo señales pedagógicas: nada de clicks de UI, foco o teclas.
 */
export type StepSignal =
  | {
      kind: "attempt";
      /** ¿La respuesta enviada era correcta? */
      correct: boolean;
    }
  | {
      kind: "reveal";
      /** Intentos fallidos antes de pedir la respuesta. */
      failedAttempts: number;
    };

export type StepSignalHandler = (signal: StepSignal) => void;
