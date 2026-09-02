import { afterAll, beforeEach, describe, expect, it } from "vitest";

import { getDiscoveryCandidates } from "@/features/discovery/queries";
import { db } from "@/lib/db";
import { decodeSignedToken } from "@/lib/social/signed-token";

import { createTestUser, resetSocialTables } from "./helpers";

async function makeOffering(campusCode: string, programCode: string, semesterCount = 8) {
  const campus = await db.academicCampus.upsert({
    where: { code: campusCode },
    update: {},
    create: { code: campusCode, name: campusCode },
  });
  const program = await db.academicProgram.upsert({
    where: { code: programCode },
    update: {},
    create: { code: programCode, name: `Programa ${programCode}` },
  });
  return db.academicOffering.upsert({
    where: { campusId_programId: { campusId: campus.id, programId: program.id } },
    update: {},
    create: { campusId: campus.id, programId: program.id, semesterCount },
  });
}

describe("Discovery — buckets sobre Postgres real", () => {
  beforeEach(async () => {
    await resetSocialTables();
    await db.academicOffering.deleteMany({});
    await db.academicProgram.deleteMany({});
    await db.academicCampus.deleteMany({});
  });
  afterAll(async () => {
    await resetSocialTables();
    await db.$disconnect();
  });

  it("bucket1 (mutuals) gana sobre bucket5 (mismo plantel) — primer match", async () => {
    const offering = await makeOffering("colomos", "software");
    const viewer = await db.user.create({
      data: {
        email: "v@t.com",
        name: "Viewer",
        username: "viewer1",
        academicOfferingId: offering.id,
        academicSemester: 3,
      },
    });
    const mutualFriend = await createTestUser("mf");
    const candidateWithMutual = await db.user.create({
      data: { email: "c1@t.com", name: "C1", username: "candidate_mutual", academicOfferingId: offering.id, academicSemester: 3 },
    });
    const candidateSameCampusOnly = await db.user.create({
      data: { email: "c2@t.com", name: "C2", username: "candidate_campus", academicOfferingId: offering.id, academicSemester: 1 },
    });

    // viewer<->mutualFriend accepted, mutualFriend<->candidateWithMutual accepted
    await db.friendship.createMany({
      data: [
        { requesterId: viewer.id, addresseeId: mutualFriend.id, status: "accepted", pairKey: `${[viewer.id, mutualFriend.id].sort().join(":")}` },
        { requesterId: mutualFriend.id, addresseeId: candidateWithMutual.id, status: "accepted", pairKey: `${[mutualFriend.id, candidateWithMutual.id].sort().join(":")}` },
      ],
    });

    const page = await getDiscoveryCandidates(viewer.id, { courseId: null });
    const ids = page.candidates.map((c) => c.id);
    expect(ids).toContain(candidateWithMutual.id);
    expect(ids).toContain(candidateSameCampusOnly.id);

    const mutualResult = page.candidates.find((c) => c.id === candidateWithMutual.id)!;
    expect(mutualResult.bucket).toBe(1);
    expect(mutualResult.mutualCount).toBe(1);

    const campusResult = page.candidates.find((c) => c.id === candidateSameCampusOnly.id)!;
    expect(campusResult.bucket).toBe(5);

    // bucket1 antes que bucket5 en el orden.
    expect(ids.indexOf(candidateWithMutual.id)).toBeLessThan(ids.indexOf(candidateSameCampusOnly.id));
  });

  it("excluye self, accepted, pending, blocked y usernameSetupRequired", async () => {
    const offering = await makeOffering("colomos", "software");
    const viewer = await db.user.create({
      data: { email: "v@t.com", name: "V", username: "viewer2", academicOfferingId: offering.id, academicSemester: 2 },
    });
    const friend = await db.user.create({
      data: { email: "f@t.com", name: "F", username: "friend2", academicOfferingId: offering.id, academicSemester: 2 },
    });
    const pendingUser = await db.user.create({
      data: { email: "p@t.com", name: "P", username: "pending2", academicOfferingId: offering.id, academicSemester: 2 },
    });
    const blockedUser = await db.user.create({
      data: { email: "b@t.com", name: "B", username: "blocked2", academicOfferingId: offering.id, academicSemester: 2 },
    });
    const provisional = await db.user.create({
      data: {
        email: "prov@t.com",
        name: "Prov",
        username: "alumno_provisional2",
        usernameSetupRequired: true,
        academicOfferingId: offering.id,
        academicSemester: 2,
      },
    });

    await db.friendship.createMany({
      data: [
        { requesterId: viewer.id, addresseeId: friend.id, status: "accepted", pairKey: [viewer.id, friend.id].sort().join(":") },
        { requesterId: viewer.id, addresseeId: pendingUser.id, status: "pending", pairKey: [viewer.id, pendingUser.id].sort().join(":") },
        { requesterId: viewer.id, addresseeId: blockedUser.id, status: "blocked", pairKey: [viewer.id, blockedUser.id].sort().join(":") },
      ],
    });

    const page = await getDiscoveryCandidates(viewer.id, { courseId: null });
    const ids = page.candidates.map((c) => c.id);
    expect(ids).not.toContain(viewer.id);
    expect(ids).not.toContain(friend.id);
    expect(ids).not.toContain(pendingUser.id);
    expect(ids).not.toContain(blockedUser.id);
    expect(ids).not.toContain(provisional.id);
  });

  it("keyset pagination: la segunda página no repite resultados de la primera", async () => {
    const offering = await makeOffering("colomos", "software");
    const viewer = await db.user.create({
      data: { email: "v3@t.com", name: "V3", username: "viewer3", academicOfferingId: offering.id, academicSemester: 4 },
    });
    for (let i = 0; i < 5; i++) {
      await db.user.create({
        data: {
          email: `cand${i}@t.com`,
          name: `Cand ${i}`,
          username: `candidate_p_${i}`,
          academicOfferingId: offering.id,
          academicSemester: 4,
        },
      });
    }

    const firstPage = await getDiscoveryCandidates(viewer.id, { courseId: null, pageSize: 2 });
    expect(firstPage.candidates).toHaveLength(2);
    expect(firstPage.nextCursor).not.toBeNull();

    const secondPage = await getDiscoveryCandidates(viewer.id, {
      courseId: null,
      pageSize: 2,
      cursor: firstPage.nextCursor,
    });
    expect(secondPage.candidates).toHaveLength(2);

    const firstIds = firstPage.candidates.map((c) => c.id);
    const secondIds = secondPage.candidates.map((c) => c.id);
    expect(firstIds.some((id) => secondIds.includes(id))).toBe(false);
  });

  it("un discoveryToken forjado (firma inválida) se detecta como inválido", () => {
    const forged = "eyJ2aWV3ZXJJZCI6ImV2aWwifQ.forged-signature";
    expect(decodeSignedToken(forged)).toBeNull();
  });

  it("el contextToken de un candidato decodifica al (viewer, candidate, bucket) correctos", async () => {
    const offering = await makeOffering("colomos", "software");
    const viewer = await db.user.create({
      data: { email: "v4@t.com", name: "V4", username: "viewer4", academicOfferingId: offering.id, academicSemester: 5 },
    });
    await db.user.create({
      data: { email: "c4@t.com", name: "C4", username: "candidate_ctx", academicOfferingId: offering.id, academicSemester: 5 },
    });

    const page = await getDiscoveryCandidates(viewer.id, { courseId: null });
    expect(page.candidates.length).toBeGreaterThan(0);
    const candidate = page.candidates[0]!;
    const decoded = decodeSignedToken<{ viewerId: string; candidateId: string; bucket: string }>(
      candidate.contextToken,
    );
    expect(decoded?.viewerId).toBe(viewer.id);
    expect(decoded?.candidateId).toBe(candidate.id);
  });
});
