import type { ImageSourcePropType } from "react-native";

import type { LunarScopeAstronomy } from "../services/astronomy";

const moonPhaseImages = {
  "new moon": require("../../assets/images/moon-phases/moon_phase_new_moon.webp"),
  "waxing crescent": require("../../assets/images/moon-phases/moon_phase_waxing_crescent.webp"),
  "first quarter": require("../../assets/images/moon-phases/moon_phase_first_quarter.webp"),
  "waxing gibbous": require("../../assets/images/moon-phases/moon_phase_waxing_gibbous.webp"),
  "full moon": require("../../assets/images/moon-phases/moon_phase_full_moon.webp"),
  "waning gibbous": require("../../assets/images/moon-phases/moon_phase_waning_gibbous.webp"),
  "last quarter": require("../../assets/images/moon-phases/moon_phase_last_quarter.webp"),
  "third quarter": require("../../assets/images/moon-phases/moon_phase_last_quarter.webp"),
  "waning crescent": require("../../assets/images/moon-phases/moon_phase_waning_crescent.webp"),
} satisfies Record<string, ImageSourcePropType>;

export type HomeAstronomyView = {
  illumination: number;
  phase: string;
  waxing: boolean;
  moonrise: string;
  moonset: string;
  sunrise: string;
  sunset: string;
  goldenHour: string;
  moonImage: ImageSourcePropType;
};

function parseHourMinute(value: string) {
  const match = value.trim().match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (!match) {
    return null;
  }

  const hour = Number(match[1]);
  const minute = Number(match[2]);

  if (hour > 23 || minute > 59) {
    return null;
  }

  return { hour, minute };
}

function to12Hour(hour: number) {
  return hour % 12 || 12;
}

function periodFor(hour: number) {
  return hour >= 12 ? "PM" : "AM";
}

export function formatClockTime(value: string): string {
  const parsed = parseHourMinute(value);
  if (!parsed) {
    return value;
  }

  return `${to12Hour(parsed.hour)}:${String(parsed.minute).padStart(2, "0")} ${periodFor(parsed.hour)}`;
}

export function formatTimeRange(start: string, end: string): string {
  const startTime = parseHourMinute(start);
  const endTime = parseHourMinute(end);

  if (!startTime || !endTime) {
    return `${start}–${end}`;
  }

  const startLabel = `${to12Hour(startTime.hour)}:${String(startTime.minute).padStart(2, "0")}`;
  const endLabel = `${to12Hour(endTime.hour)}:${String(endTime.minute).padStart(2, "0")}`;
  const startPeriod = periodFor(startTime.hour);
  const endPeriod = periodFor(endTime.hour);

  if (startPeriod === endPeriod) {
    return `${startLabel}–${endLabel} ${endPeriod}`;
  }

  return `${startLabel} ${startPeriod}–${endLabel} ${endPeriod}`;
}

export function moonImageForPhase(phase: string): ImageSourcePropType {
  const key = phase.trim().toLowerCase();
  return (
    moonPhaseImages[key as keyof typeof moonPhaseImages] ??
    moonPhaseImages["new moon"]
  );
}

export function mapAstronomyToHome(
  astronomy: LunarScopeAstronomy,
): HomeAstronomyView {
  const { sun, moon } = astronomy;

  return {
    illumination: Math.round(moon.illumination),
    phase: moon.phase,
    waxing: moon.waxing,
    moonrise: formatClockTime(moon.moonrise),
    moonset: formatClockTime(moon.moonset),
    sunrise: formatClockTime(sun.sunrise),
    sunset: formatClockTime(sun.sunset),
    goldenHour: formatTimeRange(
      sun.goldenHour.eveningBegin,
      sun.goldenHour.eveningEnd,
    ),
    moonImage: moonImageForPhase(moon.phase),
  };
}
