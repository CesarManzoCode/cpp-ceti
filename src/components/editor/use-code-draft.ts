"use client";

import * as React from "react";

// Persiste el código que el usuario va escribiendo en un ejercicio entre
// recargas y navegaciones, usando localStorage por (exerciseId).
//
// Prioridad de inicialización:
//   1. Borrador local (localStorage) si existe — gana sobre todo lo demás.
//   2. Mejor intento del servidor (serverBest) — código de la última corrida.
//   3. Fallback (starterCode) — primer ingreso.

interface UseCodeDraftOptions {
  /** Identificador estable del ejercicio (lesson exerciseId o practice id). */
  key: string;
  /** Código por defecto si no hay nada guardado. */
  fallback: string;
  /** Mejor intento devuelto por el servidor. Cuando hay borrador local, este se ignora. */
  serverBest?: string | null;
}

const PREFIX = "cpp-ceti:draft:";

export function useCodeDraft({
  key,
  fallback,
  serverBest,
}: UseCodeDraftOptions): [string, (code: string) => void, () => void] {
  // SSR-safe: el primer render usa serverBest/fallback. localStorage se lee
  // en useEffect para evitar hydration mismatch.
  const [code, setCodeState] = React.useState<string>(serverBest ?? fallback);
  const storageKey = PREFIX + key;
  const hydratedRef = React.useRef(false);

  React.useEffect(() => {
    if (hydratedRef.current) return;
    hydratedRef.current = true;
    try {
      const stored = window.localStorage.getItem(storageKey);
      if (stored != null && stored !== "") {
        // Post-mount hydration: setState aquí es intencional (no podemos leer
        // localStorage durante el initial render server-side).
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCodeState(stored);
      }
    } catch {
      // localStorage podría estar deshabilitado (modo privado o cuota llena).
    }
  }, [storageKey]);

  const setCode = React.useCallback(
    (next: string) => {
      setCodeState(next);
      try {
        window.localStorage.setItem(storageKey, next);
      } catch {
        // Sin-op: si no podemos persistir, el código sigue funcionando en memoria.
      }
    },
    [storageKey],
  );

  const reset = React.useCallback(() => {
    try {
      window.localStorage.removeItem(storageKey);
    } catch {
      // ignore
    }
    setCodeState(fallback);
  }, [storageKey, fallback]);

  return [code, setCode, reset];
}
