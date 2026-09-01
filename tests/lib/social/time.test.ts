import { describe, expect, it } from "vitest";

import {
  isNextDateOnly,
  mxDateOnly,
  mxDayKey,
  mxDayRange,
  mxWeekKey,
  mxWeekRange,
  shiftDateOnly,
} from "@/lib/social/time";

describe("mxDayKey / mxDayRange", () => {
  it("resuelve el día calendario local en UTC-6 (México sin DST)", () => {
    // 2026-03-15 05:59:59 UTC == 2026-03-14 23:59:59 en Ciudad de México.
    const justBeforeMidnight = new Date("2026-03-15T05:59:59.000Z");
    expect(mxDayKey(justBeforeMidnight)).toBe("2026-03-14");

    // Un segundo después ya es el día siguiente en México.
    const justAfterMidnight = new Date("2026-03-15T06:00:00.000Z");
    expect(mxDayKey(justAfterMidnight)).toBe("2026-03-15");
  });

  it("el rango es [start, end) exacto — el instante de start pertenece, el de end no", () => {
    const { start, end } = mxDayRange(new Date("2026-06-10T18:00:00.000Z"));
    expect(mxDayKey(start)).toBe(mxDayKey(new Date(start.getTime())));
    expect(mxDayKey(new Date(end.getTime() - 1))).toBe(mxDayKey(start));
    expect(mxDayKey(end)).not.toBe(mxDayKey(start));
    expect(end.getTime() - start.getTime()).toBe(24 * 60 * 60 * 1000);
  });
});

describe("mxWeekRange — frontera domingo/lunes", () => {
  it("un domingo tarde y el lunes siguiente temprano caen en semanas distintas", () => {
    // Domingo 2026-08-30 23:00 local (UTC-6) == lunes en UTC pero domingo local.
    const sundayNight = new Date("2026-08-31T05:00:00.000Z"); // domingo 23:00 CDMX
    const mondayMorning = new Date("2026-08-31T06:30:00.000Z"); // lunes 00:30 CDMX

    const weekOfSunday = mxWeekRange(sundayNight);
    const weekOfMonday = mxWeekRange(mondayMorning);

    expect(weekOfSunday.start.getTime()).not.toBe(weekOfMonday.start.getTime());
    // El domingo cae DENTRO del rango [start, end) de su propia semana.
    expect(sundayNight.getTime() >= weekOfSunday.start.getTime()).toBe(true);
    expect(sundayNight.getTime() < weekOfSunday.end.getTime()).toBe(true);
    // El lunes es exactamente el `start` de la semana siguiente.
    expect(mondayMorning.getTime()).toBeGreaterThanOrEqual(weekOfMonday.start.getTime());
    expect(weekOfMonday.start.getTime()).toBe(weekOfSunday.end.getTime());
  });

  it("la semana siempre dura exactamente 7 días", () => {
    const { start, end } = mxWeekRange(new Date("2026-01-15T12:00:00.000Z"));
    expect(end.getTime() - start.getTime()).toBe(7 * 24 * 60 * 60 * 1000);
  });

  it("mxWeekKey es estable para cualquier instante dentro de la misma semana", () => {
    const monday = new Date("2026-09-07T07:00:00.000Z"); // lunes 01:00 CDMX
    const sundayEnd = new Date("2026-09-14T05:59:00.000Z"); // domingo 23:59 CDMX
    expect(mxWeekKey(monday)).toBe(mxWeekKey(sundayEnd));
  });
});

describe("mxDateOnly / shiftDateOnly / isNextDateOnly", () => {
  it("dos instantes del mismo día local producen el mismo DATE-only", () => {
    const a = mxDateOnly(new Date("2026-05-01T06:01:00.000Z"));
    const b = mxDateOnly(new Date("2026-05-01T23:00:00.000Z"));
    expect(a.getTime()).toBe(b.getTime());
  });

  it("isNextDateOnly detecta consecutividad y rechaza saltos", () => {
    const day1 = mxDateOnly(new Date("2026-05-01T12:00:00.000Z"));
    const day2 = mxDateOnly(new Date("2026-05-02T12:00:00.000Z"));
    const day3 = mxDateOnly(new Date("2026-05-03T12:00:00.000Z"));
    expect(isNextDateOnly(day1, day2)).toBe(true);
    expect(isNextDateOnly(day1, day3)).toBe(false);
    expect(shiftDateOnly(day1, 1).getTime()).toBe(day2.getTime());
  });
});
