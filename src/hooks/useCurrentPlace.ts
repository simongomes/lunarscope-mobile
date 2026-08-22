import { useEffect, useState } from "react";

import {
  getCurrentPlace,
  type CurrentPlace,
} from "../services/location";

export function useCurrentPlace() {
  const [place, setPlace] = useState<CurrentPlace | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    getCurrentPlace()
      .then((result) => {
        if (!cancelled) {
          setPlace(result);
        }
      })
      .catch((caught) => {
        if (!cancelled) {
          setError(
            caught instanceof Error
              ? caught.message
              : "Unable to get location",
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { place, error, loading };
}
