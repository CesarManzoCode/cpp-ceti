"use client";

import * as React from "react";

import {
  ACTIVITY_WINDOW_MS,
  HEARTBEAT_INTERVAL_MS,
  type StudySurface,
} from "@/lib/analytics/study-session";
import type { ClientEvent } from "@/lib/analytics/events";

import {
  closeStudySession,
  openStudySession,
  pingStudySession,
  trackEvent,
} from "./actions";

/**
 * Telemetría del lado del cliente.
 *
 * Contrato con el resto de la app:
 *   · `StudySessionProvider` envuelve un reproductor (lección o práctica) y
 *     se encarga del ciclo de vida de la `StudySession`;
 *   · los componentes de adentro sólo llaman `track(...)` o `markEngaged(...)`
 *     y no saben nada de heartbeats, ids ni idempotencia;
 *   · si algo de esto falla, la lección sigue funcionando: cada llamada está
 *     envuelta y los errores se tragan a propósito.
 */

interface StudySessionContextValue {
  studySessionId: string | null;
  /** Superficie de la visita ("lesson" | "practice"). */
  surface: StudySurface | null;
  /** lessonId o practiceExerciseId de la visita. */
  resourceId: string | null;
  /** Emite un evento; no-op silencioso si la sesión aún no abrió. */
  track: (event: TrackableEvent) => void;
  /** Marca la primera interacción real de esta visita (idempotente). */
  markEngaged: (trigger: EngagementTrigger) => void;
}

export type EngagementTrigger =
  | "step_advance"
  | "step_interaction"
  | "code_edit"
  | "code_run";

/** Evento sin `studySessionId`: lo inyecta el provider. */
export type TrackableEvent =
  | { name: "lesson_step_view"; lessonId: string; lessonStepId: string; stepType: string; stepIndex: number }
  | {
      name: "lesson_step_attempt";
      lessonId: string;
      lessonStepId: string;
      stepType: "quiz" | "fill_blank" | "matching" | "code_completion" | "code_challenge";
      attemptNumber: number;
      correct: boolean;
    }
  | {
      name: "lesson_step_answer_revealed";
      lessonId: string;
      lessonStepId: string;
      stepType: "quiz" | "fill_blank" | "matching" | "code_completion" | "code_challenge";
      failedAttempts: number;
    };

const StudySessionContext =
  React.createContext<StudySessionContextValue | null>(null);

export interface StudySessionProviderProps {
  surface: StudySurface;
  /** lessonId o practiceExerciseId. */
  resourceId: string;
  children: React.ReactNode;
}

/**
 * Abre la sesión de estudio al montar, late mientras haya actividad real y
 * la cierra al salir.
 *
 * Detalles que importan:
 *   · `clientKey` (uuid por montaje) hace idempotente el arranque: React
 *     StrictMode, un reintento o un doble montaje NO crean dos sesiones.
 *   · El cierre se agenda con `setTimeout(0)` y se cancela si el efecto
 *     vuelve a correr: así el doble ciclo de StrictMode en desarrollo no
 *     cierra la sesión que acaba de abrir.
 *   · Sólo late si la pestaña está visible Y hubo actividad en los últimos
 *     `ACTIVITY_WINDOW_MS`. Una pestaña olvidada deja de latir y el barrido
 *     la cierra en su último latido.
 */
export function StudySessionProvider({
  surface,
  resourceId,
  children,
}: StudySessionProviderProps) {
  const [studySessionId, setStudySessionId] = React.useState<string | null>(
    null,
  );
  const sessionIdRef = React.useRef<string | null>(null);
  const clientKeyRef = React.useRef<string | null>(null);
  const startedRef = React.useRef(false);
  const engagedRef = React.useRef(false);
  // Se inicializa en el efecto de actividad (montar ya cuenta como actividad).
  const lastActivityRef = React.useRef<number>(0);
  const closeTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  // Señales emitidas ANTES de que abriera la sesión (los primeros ~200 ms).
  // Sin esta cola se perdían: un alumno rápido contestaba el primer paso y el
  // intento no quedaba registrado en ningún lado.
  const pendingEventsRef = React.useRef<TrackableEvent[]>([]);
  const pendingEngagedRef = React.useRef<EngagementTrigger | null>(null);

  if (clientKeyRef.current === null) {
    clientKeyRef.current = createClientKey();
  }

  const send = React.useCallback((event: TrackableEvent, sessionId: string) => {
    void trackEvent({ ...event, studySessionId: sessionId } as ClientEvent).catch(
      () => {},
    );
  }, []);

  const sendEngaged = React.useCallback(
    (trigger: EngagementTrigger, sessionId: string) => {
      const event =
        surface === "lesson"
          ? ({
              name: "lesson_engaged",
              lessonId: resourceId,
              studySessionId: sessionId,
              trigger,
            } as const)
          : ({
              name: "practice_engaged",
              practiceExerciseId: resourceId,
              studySessionId: sessionId,
              trigger,
            } as const);
      void trackEvent(event).catch(() => {
        // Si falló, permitir reintentar en la siguiente interacción.
        engagedRef.current = false;
      });
    },
    [surface, resourceId],
  );

  const flushPending = React.useCallback(
    (sessionId: string) => {
      const queued = pendingEventsRef.current;
      pendingEventsRef.current = [];
      for (const event of queued) send(event, sessionId);
      const trigger = pendingEngagedRef.current;
      pendingEngagedRef.current = null;
      if (trigger) sendEngaged(trigger, sessionId);
    },
    [send, sendEngaged],
  );

  const track = React.useCallback(
    (event: TrackableEvent) => {
      const id = sessionIdRef.current;
      if (!id) {
        // Cola acotada: si algo saliera mal con la sesión, no crecemos sin fin.
        if (pendingEventsRef.current.length < 20) {
          pendingEventsRef.current.push(event);
        }
        return;
      }
      send(event, id);
    },
    [send],
  );

  const markEngaged = React.useCallback(
    (trigger: EngagementTrigger) => {
      if (engagedRef.current) return;
      engagedRef.current = true;
      const id = sessionIdRef.current;
      if (!id) {
        // Interactuó antes de que abriera la sesión: se manda al abrir.
        pendingEngagedRef.current = trigger;
        return;
      }
      sendEngaged(trigger, id);
    },
    [sendEngaged],
  );

  // --- Arranque + cierre -------------------------------------------------
  React.useEffect(() => {
    if (closeTimerRef.current !== null) {
      // Re-montaje inmediato (StrictMode): cancela el cierre agendado.
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    if (!startedRef.current) {
      startedRef.current = true;
      void openStudySession({
        surface,
        resourceId,
        clientKey: clientKeyRef.current as string,
      })
        .then((res) => {
          sessionIdRef.current = res.studySessionId;
          setStudySessionId(res.studySessionId);
          flushPending(res.studySessionId);
        })
        .catch(() => {
          /* la telemetría nunca rompe la lección */
        });
    }

    return () => {
      closeTimerRef.current = setTimeout(() => {
        closeTimerRef.current = null;
        const id = sessionIdRef.current;
        if (!id) return;
        void closeStudySession({ studySessionId: id }).catch(() => {});
      }, 0);
    };
    // `flushPending` es estable (depende sólo de surface/resourceId, que ya
    // están aquí): incluirlo no re-abre sesiones de más.
  }, [surface, resourceId, flushPending]);

  // --- Actividad del usuario --------------------------------------------
  React.useEffect(() => {
    lastActivityRef.current = Date.now();
    function mark() {
      lastActivityRef.current = Date.now();
    }
    const events = ["pointerdown", "keydown", "scroll", "wheel"] as const;
    for (const name of events) {
      window.addEventListener(name, mark, { passive: true });
    }
    return () => {
      for (const name of events) window.removeEventListener(name, mark);
    };
  }, []);

  // --- Heartbeat ---------------------------------------------------------
  React.useEffect(() => {
    if (!studySessionId) return;
    const timer = setInterval(() => {
      if (document.visibilityState !== "visible") return;
      if (Date.now() - lastActivityRef.current > ACTIVITY_WINDOW_MS) return;
      void pingStudySession({ studySessionId }).catch(() => {});
    }, HEARTBEAT_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [studySessionId]);

  // --- Cierre al cerrar/ocultar la pestaña ------------------------------
  React.useEffect(() => {
    if (!studySessionId) return;
    function handlePageHide() {
      sendSessionEndBeacon(studySessionId as string);
    }
    window.addEventListener("pagehide", handlePageHide);
    return () => window.removeEventListener("pagehide", handlePageHide);
  }, [studySessionId]);

  // Vista del recurso: una sola vez por sesión de estudio (el dedupe del
  // servidor lo garantiza aunque este efecto vuelva a correr).
  React.useEffect(() => {
    if (!studySessionId) return;
    const event =
      surface === "lesson"
        ? ({
            name: "lesson_view",
            lessonId: resourceId,
            studySessionId,
          } as const)
        : ({
            name: "practice_view",
            practiceExerciseId: resourceId,
            studySessionId,
          } as const);
    void trackEvent(event).catch(() => {});
    // (el dedupe del servidor hace inofensivo que este efecto vuelva a correr)
  }, [studySessionId, surface, resourceId]);

  const value = React.useMemo<StudySessionContextValue>(
    () => ({ studySessionId, surface, resourceId, track, markEngaged }),
    [studySessionId, surface, resourceId, track, markEngaged],
  );

  return (
    <StudySessionContext.Provider value={value}>
      {children}
    </StudySessionContext.Provider>
  );
}

/**
 * Acceso a la telemetría de la visita actual. Devuelve un objeto inerte si
 * no hay provider (p. ej. una pantalla sin instrumentar): los componentes
 * compartidos no tienen que saber dónde están montados.
 */
export function useStudySession(): StudySessionContextValue {
  const ctx = React.useContext(StudySessionContext);
  return ctx ?? INERT;
}

const INERT: StudySessionContextValue = {
  studySessionId: null,
  surface: null,
  resourceId: null,
  track: () => {},
  markEngaged: () => {},
};

// =====================================================================
//  Target de pistas — para que `HintsPanel` no dependa de cada pantalla
// =====================================================================

export type HintsTarget =
  | { kind: "exercise"; exerciseId: string }
  | { kind: "practice"; practiceExerciseId: string };

const HintsTargetContext = React.createContext<HintsTarget | null>(null);

/**
 * Declara a qué ejercicio pertenecen las pistas que se rendericen debajo.
 * `HintsPanel` lo lee por contexto: ni el reto de lección ni la práctica
 * tienen que pasarle props de telemetría.
 */
export function HintsTargetProvider({
  target,
  children,
}: {
  target: HintsTarget;
  children: React.ReactNode;
}) {
  const kind = target.kind;
  const id = targetId(target);
  const value = React.useMemo<HintsTarget>(
    () =>
      kind === "exercise"
        ? { kind: "exercise", exerciseId: id }
        : { kind: "practice", practiceExerciseId: id },
    [kind, id],
  );
  return (
    <HintsTargetContext.Provider value={value}>
      {children}
    </HintsTargetContext.Provider>
  );
}

export function useHintsTarget(): HintsTarget | null {
  return React.useContext(HintsTargetContext);
}

function targetId(target: HintsTarget): string {
  return target.kind === "exercise"
    ? target.exerciseId
    : target.practiceExerciseId;
}

// =====================================================================
//  Utilidades
// =====================================================================

function createClientKey(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `k-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

/**
 * Cierre "de último aliento". `sendBeacon` es lo único que el navegador
 * garantiza al cerrar la pestaña; si no existe, se intenta un fetch con
 * `keepalive`.
 */
function sendSessionEndBeacon(studySessionId: string): void {
  const payload = JSON.stringify({ studySessionId });
  const url = "/api/telemetry/session-end";
  try {
    if (typeof navigator !== "undefined" && "sendBeacon" in navigator) {
      const blob = new Blob([payload], { type: "application/json" });
      if (navigator.sendBeacon(url, blob)) return;
    }
    void fetch(url, {
      method: "POST",
      body: payload,
      headers: { "Content-Type": "application/json" },
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* nada que hacer: el barrido de huérfanas cubre este caso */
  }
}
