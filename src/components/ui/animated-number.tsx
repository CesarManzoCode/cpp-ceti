"use client";

import * as React from "react";

import { cn, formatNumber } from "@/lib/utils";

interface AnimatedNumberProps {
  value: number;
  /** Duration of the count-up in ms. Defaults to 1000. */
  duration?: number;
  /** Format the value before rendering. Defaults to Intl es-MX. */
  format?: (value: number) => string;
  /** Class names for the wrapper span. */
  className?: string;
}

/**
 * Cuenta de 0 (o del valor previo) hasta `value` con curva ease-out.
 * - Honra prefers-reduced-motion (muestra el valor final directo).
 * - Usa requestAnimationFrame para 60fps.
 * - tabular-nums para evitar jitter horizontal.
 */
export function AnimatedNumber({
  value,
  duration = 1000,
  format = formatNumber,
  className,
}: AnimatedNumberProps) {
  // SSR-safe: arranca en 0 para que la animación se vea en cliente.
  // Si el usuario pidió reduced motion, useSyncExternalStore lo detecta en
  // el primer render y devuelve el valor final sin animar.
  const prefersReducedMotion = usePrefersReducedMotion();

  const [display, setDisplay] = React.useState(() =>
    prefersReducedMotion ? value : 0,
  );
  const fromRef = React.useRef(prefersReducedMotion ? value : 0);

  React.useEffect(() => {
    if (prefersReducedMotion) {
      fromRef.current = value;
      return;
    }

    const from = fromRef.current;
    if (from === value) return;

    const start = performance.now();
    let rafId = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      // ease-out-quart
      const eased = 1 - Math.pow(1 - t, 4);
      const next = from + (value - from) * eased;
      setDisplay(next);
      if (t < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        fromRef.current = value;
      }
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [value, duration, prefersReducedMotion]);

  // Si el usuario tiene reduced motion, renderiza el valor final directo.
  const out = prefersReducedMotion ? value : Math.round(display);

  return (
    <span className={cn("tabular-nums", className)}>{format(out)}</span>
  );
}

/**
 * Suscripción reactiva a prefers-reduced-motion sin setState-in-effect.
 * Server: devuelve false (cliente decide después de hidratar).
 */
function usePrefersReducedMotion(): boolean {
  return React.useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    () => false,
  );
}

function subscribeReducedMotion(cb: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

function getReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
