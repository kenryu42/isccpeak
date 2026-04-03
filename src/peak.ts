export type PeakStatus =
  | { peak: true; minutesLeft: number }
  | { peak: false; minutesToPeak: number };

const PT_FORMAT = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Los_Angeles",
  weekday: "short",
  hour: "numeric",
  minute: "numeric",
  hour12: false,
});

// Peak hours: Mon–Fri, 5:00am–10:59am PT
const PEAK_START = 5;
const PEAK_END = 11;
const MINUTES_PER_DAY = 24 * 60;
const PEAK_START_MIN = PEAK_START * 60;
const PEAK_END_MIN = PEAK_END * 60;

function getPTComponents(now: Date) {
  const parts = PT_FORMAT.formatToParts(now);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";

  const weekday = get("weekday"); // "Mon", "Tue", ..., "Sun"
  const hour = Number(get("hour"));
  // Intl may format midnight as 24 — normalize to 0
  const minute = Number(get("minute"));

  return { weekday, hour: hour === 24 ? 0 : hour, minute };
}

const WEEKEND = new Set(["Sat", "Sun"]);
const DAYS_UNTIL_MONDAY: Record<string, number> = {
  Mon: 0,
  Tue: 6,
  Wed: 5,
  Thu: 4,
  Fri: 3,
  Sat: 2,
  Sun: 1,
};

export function getPeakStatus(now?: Date): PeakStatus {
  const date = now ?? new Date();
  const { weekday, hour, minute } = getPTComponents(date);
  const currentMinutes = hour * 60 + minute;
  const isWeekday = !WEEKEND.has(weekday);

  if (isWeekday && hour >= PEAK_START && hour < PEAK_END) {
    return { peak: true, minutesLeft: PEAK_END_MIN - currentMinutes };
  }

  // Off-peak: calculate minutes until next Mon–Fri 5:00am PT
  if (isWeekday && currentMinutes < PEAK_START_MIN) {
    // Weekday before peak — same day
    return { peak: false, minutesToPeak: PEAK_START_MIN - currentMinutes };
  }

  // Weekday after peak or weekend — need to find next weekday 5am
  const minutesLeftToday = MINUTES_PER_DAY - currentMinutes;

  if (isWeekday && weekday !== "Fri") {
    // Mon–Thu after peak: next day 5am
    return { peak: false, minutesToPeak: minutesLeftToday + PEAK_START_MIN };
  }

  // Friday after peak, Saturday, or Sunday — count to Monday 5am
  const daysUntilMonday = DAYS_UNTIL_MONDAY[weekday] ?? 0;
  const fullDaysBetween = daysUntilMonday - 1;
  return {
    peak: false,
    minutesToPeak: minutesLeftToday + fullDaysBetween * MINUTES_PER_DAY + PEAK_START_MIN,
  };
}

export function formatCountdown(minutes: number): string {
  if (minutes < 1) return "<1m";
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
}

export function formatStatusline(status: PeakStatus): string {
  if (status.peak) {
    return `🔴 Peak · ${formatCountdown(status.minutesLeft)} left`;
  }
  return `🟢 Normal · ${formatCountdown(status.minutesToPeak)} left`;
}
