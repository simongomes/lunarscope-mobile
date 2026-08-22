import { useEffect, useState } from "react";
import * as Location from "expo-location";

import {
  getCurrentCoordinates,
  toCurrentPlace,
  type CurrentPlace,
} from "../services/location";

export function useCurrentPlace() {
  const [place, setPlace] = useState<CurrentPlace | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const coords = await getCurrentCoordinates();

        if (cancelled) {
          return;
        }

        setPlace(toCurrentPlace(coords));
        setLoading(false);

        try {
          const [address] = await Location.reverseGeocodeAsync(coords);

          if (!cancelled) {
            setPlace(toCurrentPlace(coords, address));
          }
        } catch {
          // Keep the coordinates-only place so astronomy can still load.
        }
      } catch (caught) {
        if (cancelled) {
          return;
        }

        setPlace(null);
        setError(
          caught instanceof Error
            ? caught.message
            : "Unable to get location",
        );
        setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return { place, error, loading };
}
