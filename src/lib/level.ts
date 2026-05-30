// Conversión XP → nivel. Curva lineal por simplicidad: cada nivel cuesta
// 100 XP. Empezamos en nivel 1 (no nivel 0) por sensación de progreso desde
// el primer ejercicio.

export const XP_PER_LEVEL = 100;

export interface UserLevel {
  /** Nivel actual (≥1). */
  level: number;
  /** XP acumulados dentro del nivel actual. */
  xpInCurrentLevel: number;
  /** XP necesarios para alcanzar el siguiente nivel desde el inicio del actual. */
  xpForNextLevel: number;
  /** Porcentaje 0–1 hacia el siguiente nivel. */
  progress: number;
}

export function levelFromXp(totalXp: number): UserLevel {
  const safeXp = Math.max(0, totalXp);
  const level = Math.floor(safeXp / XP_PER_LEVEL) + 1;
  const xpInCurrentLevel = safeXp % XP_PER_LEVEL;
  return {
    level,
    xpInCurrentLevel,
    xpForNextLevel: XP_PER_LEVEL,
    progress: xpInCurrentLevel / XP_PER_LEVEL,
  };
}
