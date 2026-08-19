import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";

export default {
  fetch: withSupabase(
    { auth: ["publishable", "secret"] },
    async (req, ctx) => {
      try {
        const {
          latitude,
          longitude,
          date,
        } = await req.json();

        if (
          typeof latitude !== "number" ||
          typeof longitude !== "number"
        ) {
          return Response.json(
            {
              error: "latitude and longitude are required",
            },
            {
              status: 400,
            },
          );
        }

        const astronomyApiKey =
          Deno.env.get("IPGEOLOCATION_API_KEY");
        const astronomyApiUrl =
          Deno.env.get("IPGEOLOCATION_API_URL");

        if (!astronomyApiKey || !astronomyApiUrl) {
          console.error(
            "IPGEOLOCATION_API_KEY or IPGEOLOCATION_API_URL is not configured",
          );

          return Response.json(
            {
              error: "Astronomy provider is not configured",
            },
            {
              status: 500,
            },
          );
        }

        const query = new URLSearchParams({
          apiKey: astronomyApiKey,
          lat: latitude.toString(),
          long: longitude.toString(),
        });

        if (date) {
          query.set("date", date);
        }

        const astronomyResponse = await fetch(
          `${astronomyApiUrl}?${query}`,
        );

        if (!astronomyResponse.ok) {
          const errorBody =
            await astronomyResponse.text();

          console.error(
            "IPGeolocation error:",
            astronomyResponse.status,
            errorBody,
          );

          return Response.json(
            {
              error: "Unable to retrieve astronomy data",
            },
            {
              status: 502,
            },
          );
        }

        const astronomy =
          await astronomyResponse.json();

        return Response.json({
          astronomy,
        });
      } catch (error) {
        console.error(
          "celestial-dashboard error:",
          error,
        );

        return Response.json(
          {
            error: "Unable to fetch celestial data",
          },
          {
            status: 500,
          },
        );
      }
    },
  ),
};