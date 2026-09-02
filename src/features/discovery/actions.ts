"use server";

import { z } from "zod";

import { ActionError, withActionErrorHandling } from "@/lib/action-error";
import { discoveryImpressionPropsSchema, discoveryProfileOpenPropsSchema } from "@/lib/analytics/social-props";
import { recordProductEventSafely } from "@/lib/analytics/record";
import { readSelectedCourseSlug } from "@/lib/course-selection";
import { db } from "@/lib/db";
import { getDiscoveryCandidates, type DiscoveryPage } from "@/features/discovery/queries";
import { requireSession } from "@/lib/get-session";
import { enforceRateLimit } from "@/lib/rate-limit";

const pageSchema = z.object({
  cursor: z.string().nullish(),
  discoverySessionKey: z.string().min(1).max(100),
});

export const getDiscoveryPage = withActionErrorHandling(
  "getDiscoveryPage",
  async (input: { cursor?: string | null; discoverySessionKey: string }): Promise<DiscoveryPage> => {
    const session = await requireSession();
    if (session.user.usernameSetupRequired) {
      throw new ActionError("Confirma tu nombre de usuario para descubrir compañeros");
    }
    await enforceRateLimit(session.user.id, "discovery");
    const { cursor, discoverySessionKey } = pageSchema.parse(input);

    const courseSlug = await readSelectedCourseSlug();
    let courseId: string | null = null;
    if (courseSlug) {
      const course = await db.course.findUnique({
        where: { slug: courseSlug, published: true },
        select: { id: true },
      });
      courseId = course?.id ?? null;
    }

    const page = await getDiscoveryCandidates(session.user.id, {
      courseId,
      cursor: cursor ?? null,
    });

    const bucketCounts: Record<string, number> = {};
    for (const c of page.candidates) {
      bucketCounts[c.bucket] = (bucketCounts[c.bucket] ?? 0) + 1;
    }
    await recordProductEventSafely(db, {
      userId: session.user.id,
      name: "discovery_impression",
      surface: "social",
      props: discoveryImpressionPropsSchema.parse({
        discoverySessionKey,
        resultCount: page.candidates.length,
        bucketCounts,
      }),
    });

    return page;
  },
);

const impressionSchema = z.object({
  discoverySessionKey: z.string().min(1).max(100),
  resultCount: z.number().int().min(0),
  bucketCounts: z.record(z.string(), z.number().int().min(0)),
});

/**
 * Impresión de la PRIMERA página de discovery. La lista se renderiza en
 * una pestaña (Radix monta el contenido sólo cuando está activa), así que
 * el evento se registra cuando el alumno la ve de verdad — no cuando el
 * servidor precarga los candidatos. Las páginas siguientes las registra
 * `getDiscoveryPage`.
 */
export const trackDiscoveryImpression = withActionErrorHandling(
  "trackDiscoveryImpression",
  async (input: {
    discoverySessionKey: string;
    resultCount: number;
    bucketCounts: Record<string, number>;
  }): Promise<void> => {
    const session = await requireSession();
    const props = impressionSchema.parse(input);
    await recordProductEventSafely(db, {
      userId: session.user.id,
      name: "discovery_impression",
      surface: "social",
      props: discoveryImpressionPropsSchema.parse(props),
    });
  },
);

const profileOpenSchema = z.object({
  bucket: z.number().int().min(1).max(5),
  discoverySessionKey: z.string().min(1).max(100),
});

export const trackDiscoveryProfileOpen = withActionErrorHandling(
  "trackDiscoveryProfileOpen",
  async (input: { bucket: number; discoverySessionKey: string }): Promise<void> => {
    const session = await requireSession();
    const { bucket, discoverySessionKey } = profileOpenSchema.parse(input);
    await recordProductEventSafely(db, {
      userId: session.user.id,
      name: "discovery_profile_open",
      surface: "social",
      props: discoveryProfileOpenPropsSchema.parse({ bucket, discoverySessionKey }),
    });
  },
);
