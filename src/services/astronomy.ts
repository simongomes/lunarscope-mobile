import { apiRequest } from "./apiClient";

export const ASTRONOMY_PATH = "/functions/v1/lunarscope-dashboard";

export type AstronomyParams = {
  latitude: number;
  longitude: number;
  date: string;
};

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

export type AstronomyResponse = {
  astronomy: LunarScopeAstronomy;
};

export function fetchAstronomy(
  params: AstronomyParams,
  signal?: AbortSignal,
) {
  return apiRequest<AstronomyResponse>(ASTRONOMY_PATH, {
    method: "POST",
    body: params,
    signal,
  });
}
