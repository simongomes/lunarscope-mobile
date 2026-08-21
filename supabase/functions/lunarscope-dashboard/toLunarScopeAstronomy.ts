export type LunarScopeAstronomy = {
  date: string;
  sun: {
    sunrise: string;
    sunset: string;
    dayLength: string;
    solarNoon: string;
    goldenHour: {
      morningBegin: string;
      morningEnd: string;
      eveningBegin: string;
      eveningEnd: string;
    };
  };
  moon: {
    phase: string;
    illumination: number;
    waxing: boolean;
    moonrise: string;
    moonset: string;
  };
};

type ProviderTwilight = {
  golden_hour_begin?: unknown;
  golden_hour_end?: unknown;
};

type ProviderAstronomy = {
  date?: unknown;
  sunrise?: unknown;
  sunset?: unknown;
  day_length?: unknown;
  solar_noon?: unknown;
  moonrise?: unknown;
  moonset?: unknown;
  moon_phase?: unknown;
  moon_illumination_percentage?: unknown;
  morning?: ProviderTwilight;
  evening?: ProviderTwilight;
};

type ProviderResponse = {
  astronomy?: ProviderAstronomy;
};

const requiredString = (
  value: unknown,
  field: string,
): string => {
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`Missing astronomy field: ${field}`);
  }

  return value;
};

const formatMoonPhase = (phase: string): string => {
  return phase
    .toLowerCase()
    .split("_")
    .filter((word) => word.length > 0)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const getProviderAstronomy = (
  providerResponse: unknown,
): ProviderAstronomy => {
  if (
    !providerResponse ||
    typeof providerResponse !== "object"
  ) {
    throw new Error("Invalid astronomy provider response");
  }

  const payload = providerResponse as ProviderResponse;

  if (
    payload.astronomy &&
    typeof payload.astronomy === "object"
  ) {
    return payload.astronomy;
  }

  return providerResponse as ProviderAstronomy;
};

export const isLunarScopeAstronomy = (
  value: unknown,
): value is LunarScopeAstronomy => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const data = value as LunarScopeAstronomy;

  return (
    typeof data.date === "string" &&
    typeof data.sun?.sunrise === "string" &&
    typeof data.sun?.sunset === "string" &&
    typeof data.sun?.dayLength === "string" &&
    typeof data.sun?.solarNoon === "string" &&
    typeof data.sun?.goldenHour?.morningBegin === "string" &&
    typeof data.sun?.goldenHour?.morningEnd === "string" &&
    typeof data.sun?.goldenHour?.eveningBegin === "string" &&
    typeof data.sun?.goldenHour?.eveningEnd === "string" &&
    typeof data.moon?.phase === "string" &&
    typeof data.moon?.illumination === "number" &&
    typeof data.moon?.waxing === "boolean" &&
    typeof data.moon?.moonrise === "string" &&
    typeof data.moon?.moonset === "string"
  );
};

export const toLunarScopeAstronomy = (
  providerResponse: unknown,
): LunarScopeAstronomy => {
  const astronomy = getProviderAstronomy(providerResponse);

  const illuminationRaw = Number(
    astronomy.moon_illumination_percentage,
  );

  if (!Number.isFinite(illuminationRaw)) {
    throw new Error(
      "Missing astronomy field: moon_illumination_percentage",
    );
  }

  const phase = formatMoonPhase(
    requiredString(astronomy.moon_phase, "moon_phase"),
  );

  if (phase.length === 0) {
    throw new Error("Missing astronomy field: moon_phase");
  }

  return {
    date: requiredString(astronomy.date, "date"),
    sun: {
      sunrise: requiredString(astronomy.sunrise, "sunrise"),
      sunset: requiredString(astronomy.sunset, "sunset"),
      dayLength: requiredString(
        astronomy.day_length,
        "day_length",
      ),
      solarNoon: requiredString(
        astronomy.solar_noon,
        "solar_noon",
      ),
      goldenHour: {
        morningBegin: requiredString(
          astronomy.morning?.golden_hour_begin,
          "morning.golden_hour_begin",
        ),
        morningEnd: requiredString(
          astronomy.morning?.golden_hour_end,
          "morning.golden_hour_end",
        ),
        eveningBegin: requiredString(
          astronomy.evening?.golden_hour_begin,
          "evening.golden_hour_begin",
        ),
        eveningEnd: requiredString(
          astronomy.evening?.golden_hour_end,
          "evening.golden_hour_end",
        ),
      },
    },
    moon: {
      phase,
      illumination: Math.abs(illuminationRaw),
      waxing: illuminationRaw >= 0,
      moonrise: requiredString(
        astronomy.moonrise,
        "moonrise",
      ),
      moonset: requiredString(astronomy.moonset, "moonset"),
    },
  };
};
