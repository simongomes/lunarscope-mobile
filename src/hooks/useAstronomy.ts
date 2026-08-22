import { useEffect, useState } from "react";

import {
  fetchAstronomy,
  type LunarScopeAstronomy,
} from "../services/astronomy";
import { localIsoDate } from "../utils/date";

type AstronomyCoords = {
  latitude: number;
  longitude: number;
};

function isAbortError(error: unknown) {
  if (typeof error !== "object" || error === null) {
    return false;
  }

  const name = "name" in error ? String(error.name) : "";
  const message = "message" in error ? String(error.message) : "";

  return (
    name === "AbortError" ||
    message.toLowerCase().includes("aborted") ||
    message.toLowerCase().includes("abort")
  );
}

export function useAstronomy(coords: AstronomyCoords | null) {
  const [astronomy, setAstronomy] = useState<LunarScopeAstronomy | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!coords) {
      setAstronomy(null);
      setError(null);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    let cancelled = false;

    setLoading(true);
    setError(null);

    fetchAstronomy(
      {
        latitude: coords.latitude,
        longitude: coords.longitude,
        date: localIsoDate(),
      },
      controller.signal,
    )
      .then((response) => {
        if (cancelled) {
          return;
        }

        setAstronomy(response.astronomy);
        setError(null);
        setLoading(false);
      })
      .catch((caught) => {
        if (cancelled || isAbortError(caught)) {
          return;
        }

        setAstronomy(null);
        setError(
          caught instanceof Error
            ? caught.message
            : "Unable to load astronomy",
        );
        setLoading(false);
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [coords?.latitude, coords?.longitude]);

  return { astronomy, error, loading };
}
