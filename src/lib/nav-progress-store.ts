"use client";

/**
 * Mini-store sin dependencias para coordinar el estado pendiente
 * de las navegaciones. Múltiples <LoadingLink> reportan su
 * estado y <NavigationProgress> arriba renderiza la barra.
 *
 * Diseñado para ser barato: un contador atómico + listeners.
 */

let pendingCount = 0;
const listeners = new Set<(pending: boolean) => void>();

function emit() {
  const pending = pendingCount > 0;
  for (const l of listeners) l(pending);
}

export function incrementPending() {
  pendingCount += 1;
  emit();
}

export function decrementPending() {
  pendingCount = Math.max(0, pendingCount - 1);
  emit();
}

export function subscribePending(listener: (pending: boolean) => void) {
  listeners.add(listener);
  // Push current state immediately
  listener(pendingCount > 0);
  return () => {
    listeners.delete(listener);
  };
}

export function getPending() {
  return pendingCount > 0;
}
