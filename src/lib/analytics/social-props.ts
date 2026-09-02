import { z } from "zod";

/**
 * Contratos de `props` para los ProductEvent sociales que SÍ hace falta
 * agregar (no hay tabla de dominio que los reconstruya) — ver
 * `<analytics>` del contrato. Nunca candidate username/id, group, campus
 * ni program en props.
 */

export const discoveryImpressionPropsSchema = z.object({
  discoverySessionKey: z.string().min(1).max(100),
  resultCount: z.number().int().min(0),
  bucketCounts: z.record(z.string(), z.number().int().min(0)),
});

export const discoveryProfileOpenPropsSchema = z.object({
  bucket: z.number().int().min(1).max(5),
  discoverySessionKey: z.string().min(1).max(100),
});

export const leagueViewPropsSchema = z.object({
  tier: z.string().min(1).max(20),
});

/** `friends_ranking_view` e `invite_link_copied` no llevan props. */
export const emptyPropsSchema = z.object({});
