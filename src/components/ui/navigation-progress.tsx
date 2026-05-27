"use client";

import * as React from "react";

import { subscribePending } from "@/lib/nav-progress-store";

/**
 * Barra fina arriba de la pantalla que se llena progresivamente
 * mientras hay navegaciones pendientes. Estilo YouTube/Linear/Vercel.
 *
 * Lógica:
 * - cuando pending pasa a true, arrancamos a "trickle" hasta ~85%
 * - cuando pending pasa a false, completamos a 100% y desvanecemos
 * - todo en JS para mantener animación responsiva al estado real
 */
export function NavigationProgress() {
  const [active, setActive] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const trickleRef = React.useRef<ReturnType<typeof setInterval> | null>(null);
  const fadeRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    return subscribePending((pending) => {
      if (pending) {
        // Cancel any pending fade-out
        if (fadeRef.current) {
          clearTimeout(fadeRef.current);
          fadeRef.current = null;
        }
        setActive(true);
        setProgress((p) => (p > 0 ? p : 8));
        if (!trickleRef.current) {
          trickleRef.current = setInterval(() => {
            setProgress((p) => {
              if (p >= 86) return p;
              // Asymptotic crawl: faster at the start, slower as it approaches 90.
              const remaining = 90 - p;
              return p + Math.max(0.5, remaining * 0.08);
            });
          }, 180);
        }
      } else {
        if (trickleRef.current) {
          clearInterval(trickleRef.current);
          trickleRef.current = null;
        }
        setProgress(100);
        fadeRef.current = setTimeout(() => {
          setActive(false);
          // Reset to 0 after fade so the next nav can start clean
          setTimeout(() => setProgress(0), 280);
        }, 220);
      }
    });
  }, []);

  React.useEffect(() => {
    return () => {
      if (trickleRef.current) clearInterval(trickleRef.current);
      if (fadeRef.current) clearTimeout(fadeRef.current);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2.5px]"
      style={{
        opacity: active ? 1 : 0,
        transition: "opacity 220ms ease",
      }}
    >
      <div
        className="h-full origin-left bg-gradient-to-r from-primary via-primary to-primary/40 shadow-[0_0_8px_var(--primary)]"
        style={{
          transform: `scaleX(${progress / 100})`,
          transition: "transform 220ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      />
    </div>
  );
}
