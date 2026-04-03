import { afterEach, describe, expect, setSystemTime, test } from "bun:test";
import { formatCountdown, formatStatusline, getPeakStatus } from "@/peak";

// Helper: create a Date at a specific PT wall-clock time.
// During PST (winter): PT = UTC-8. During PDT (summer): PT = UTC-7.
// We use January dates (PST) for predictability: UTC = PT + 8h.
function ptDate(year: number, month: number, day: number, hour: number, minute: number): Date {
  // Month is 1-based here, convert to 0-based for UTC
  return new Date(Date.UTC(year, month - 1, day, hour + 8, minute));
}

afterEach(() => {
  setSystemTime();
});

describe("getPeakStatus", () => {
  // 2026-01-05 is a Monday (PST)
  test("weekday peak start — Mon 5:00am PT", () => {
    setSystemTime(ptDate(2026, 1, 5, 5, 0));
    const status = getPeakStatus();
    expect(status).toEqual({ peak: true, minutesLeft: 360 });
  });

  test("weekday peak middle — Mon 8:00am PT", () => {
    setSystemTime(ptDate(2026, 1, 5, 8, 0));
    const status = getPeakStatus();
    expect(status).toEqual({ peak: true, minutesLeft: 180 });
  });

  test("weekday peak end edge — Mon 10:59am PT", () => {
    setSystemTime(ptDate(2026, 1, 5, 10, 59));
    const status = getPeakStatus();
    expect(status).toEqual({ peak: true, minutesLeft: 1 });
  });

  test("weekday before peak — Mon 3:00am PT", () => {
    setSystemTime(ptDate(2026, 1, 5, 3, 0));
    const status = getPeakStatus();
    expect(status).toEqual({ peak: false, minutesToPeak: 120 });
  });

  test("weekday after peak — Mon 11:00am PT", () => {
    setSystemTime(ptDate(2026, 1, 5, 11, 0));
    const status = getPeakStatus();
    expect(status).toEqual({ peak: false, minutesToPeak: 1080 });
  });

  test("weekday midnight — Tue 0:00am PT", () => {
    // 2026-01-06 is Tuesday
    setSystemTime(ptDate(2026, 1, 6, 0, 0));
    const status = getPeakStatus();
    expect(status).toEqual({ peak: false, minutesToPeak: 300 });
  });

  test("Friday after peak — Fri 11:00am PT", () => {
    // 2026-01-09 is Friday
    setSystemTime(ptDate(2026, 1, 9, 11, 0));
    const status = getPeakStatus();
    // Fri 11am → Mon 5am = 13h Fri + 24h Sat + 24h Sun + 5h Mon = 66h = 3960m
    expect(status).toEqual({ peak: false, minutesToPeak: 3960 });
  });

  test("Saturday noon — Sat 12:00pm PT", () => {
    // 2026-01-10 is Saturday
    setSystemTime(ptDate(2026, 1, 10, 12, 0));
    const status = getPeakStatus();
    // Sat 12pm → Mon 5am = 12h Sat + 24h Sun + 5h Mon = 41h = 2460m
    expect(status).toEqual({ peak: false, minutesToPeak: 2460 });
  });

  test("Sunday 11pm — Sun 23:00 PT", () => {
    // 2026-01-11 is Sunday
    setSystemTime(ptDate(2026, 1, 11, 23, 0));
    const status = getPeakStatus();
    // Sun 23:00 → Mon 5:00 = 6h = 360m
    expect(status).toEqual({ peak: false, minutesToPeak: 360 });
  });

  test("accepts explicit Date argument", () => {
    const date = ptDate(2026, 1, 5, 8, 0);
    const status = getPeakStatus(date);
    expect(status).toEqual({ peak: true, minutesLeft: 180 });
  });
});

describe("formatCountdown", () => {
  test("0 minutes → <1m", () => {
    expect(formatCountdown(0)).toBe("<1m");
  });

  test("1 minute → 1m", () => {
    expect(formatCountdown(1)).toBe("1m");
  });

  test("42 minutes → 42m", () => {
    expect(formatCountdown(42)).toBe("42m");
  });

  test("60 minutes → 1h 0m", () => {
    expect(formatCountdown(60)).toBe("1h 0m");
  });

  test("90 minutes → 1h 30m", () => {
    expect(formatCountdown(90)).toBe("1h 30m");
  });

  test("3960 minutes → 66h 0m", () => {
    expect(formatCountdown(3960)).toBe("66h 0m");
  });
});

describe("formatStatusline", () => {
  test("peak status shows red circle", () => {
    const line = formatStatusline({ peak: true, minutesLeft: 135 });
    expect(line).toBe("🔴 Peak · 2h 15m left");
  });

  test("off-peak status shows green circle", () => {
    const line = formatStatusline({ peak: false, minutesToPeak: 225 });
    expect(line).toBe("🟢 Normal · 3h 45m left");
  });

  test("peak with less than 1 minute", () => {
    const line = formatStatusline({ peak: true, minutesLeft: 0 });
    expect(line).toBe("🔴 Peak · <1m left");
  });

  test("off-peak with minutes only", () => {
    const line = formatStatusline({ peak: false, minutesToPeak: 42 });
    expect(line).toBe("🟢 Normal · 42m left");
  });
});
