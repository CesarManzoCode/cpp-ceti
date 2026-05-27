"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

/**
 * Barra fina arriba que se llena durante navegaciones internas.
 *
 * Estrategia (sin useLinkStatus, para no acoplarnos a su lifecycle):
 *  - Listener global de clicks → si es un <a> interno con destino
 *    distinto al actual, arrancamos la barra y guardamos el pathname
 *    de salida.
 *  - usePathname() → cuando cambia el pathname respecto al guardado,
 *    completamos la barra y la desvanecemos.
 *  - Safety timeout: si la nav nunca completa en 10s, soltamos la barra.
 */
export function NavigationProgress() {
  const pathname = usePathname();
  const [active, setActive] = React.useState(false);
  const [progress, setProgress] = React.useState(0);

  const trickleRef = React.useRef<ReturnType<typeof setInterval> | null>(null);
  const fadeRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const safetyRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const startedAtPathRef = React.useRef<string | null>(null);

  const stopTimers = React.useCallback(() => {
    if (trickleRef.current) {
      clearInterval(trickleRef.current);
      trickleRef.current = null;
    }
    if (fadeRef.current) {
      clearTimeout(fadeRef.current);
      fadeRef.current = null;
    }
    if (safetyRef.current) {
      clearTimeout(safetyRef.current);
      safetyRef.current = null;
    }
  }, []);

  const finish = React.useCallback(() => {
    if (trickleRef.current) {
      clearInterval(trickleRef.current);
      trickleRef.current = null;
    }
    if (safetyRef.current) {
      clearTimeout(safetyRef.current);
      safetyRef.current = null;
    }
    startedAtPathRef.current = null;
    setProgress(100);
    fadeRef.current = setTimeout(() => {
      setActive(false);
      // Reset to 0 after the fade so the next nav starts clean
      setTimeout(() => setProgress(0), 280);
      fadeRef.current = null;
    }, 220);
  }, []);

  // Limpieza al desmontar
  React.useEffect(() => {
    return () => stopTimers();
  }, [stopTimers]);

  // Cuando cambia el pathname y veníamos de un click: cerramos la barra
  React.useEffect(() => {
    if (!startedAtPathRef.current) return;
    if (startedAtPathRef.current === pathname) return; // aún no ha cambiado
    finish();
  }, [pathname, finish]);

  // Click handler: arranca la barra al clickear un Link interno
  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (e.defaultPrevented) return;
      if (e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const target = e.target as HTMLElement | null;
      const anchor = target?.closest("a");
      if (!anchor) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;

      const href = anchor.getAttribute("href");
      if (!href) return;
      if (
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("javascript:")
      ) {
        return;
      }

      let url: URL;
      try {
        url = new URL(href, window.location.origin);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      // Misma URL exacta — no se considera navegación
      if (
        url.pathname === window.location.pathname &&
        url.search === window.location.search
      ) {
        return;
      }

      // Arranca
      if (fadeRef.current) {
        clearTimeout(fadeRef.current);
        fadeRef.current = null;
      }
      startedAtPathRef.current = window.location.pathname;
      setActive(true);
      setProgress((p) => (p > 0 && p < 90 ? p : 8));
      if (!trickleRef.current) {
        trickleRef.current = setInterval(() => {
          setProgress((p) => {
            if (p >= 86) return p;
            const remaining = 90 - p;
            return p + Math.max(0.5, remaining * 0.08);
          });
        }, 180);
      }
      if (safetyRef.current) clearTimeout(safetyRef.current);
      safetyRef.current = setTimeout(() => {
        // Navegación colgada → soltamos la barra y reseteamos el latch
        startedAtPathRef.current = null;
        if (trickleRef.current) {
          clearInterval(trickleRef.current);
          trickleRef.current = null;
        }
        setActive(false);
        setProgress(0);
        safetyRef.current = null;
      }, 10000);
    }

    document.addEventListener("click", handleClick, { capture: true });
    return () =>
      document.removeEventListener("click", handleClick, { capture: true });
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
