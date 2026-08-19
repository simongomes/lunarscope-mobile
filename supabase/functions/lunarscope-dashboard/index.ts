import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";

type LocationBucket = {
  key: string;
  latitude: number;
  longitude: number;
}

const getLocationBucket = (
  latitude: number,
  longitude: number,
): LocationBucket => {
  const bucketLatitude = Math.round(latitude * 20) / 20;
  const bucketLongitude = Math.round(longitude * 20) / 20;

  return {
    key: `${bucketLatitude.toFixed(2)}:${bucketLongitude.toFixed(2)}`,
    latitude: bucketLatitude,
    longitude: bucketLongitude,
  };
};

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

        /*
         * 1. Validate request.
         */
        if (
          typeof latitude !== "number" ||
          typeof longitude !== "number"
        ) {
          return Response.json(
            {
              error:
                "latitude and longitude are required",
            },
            {
              status: 400,
            },
          );
        }

        if (
          typeof date !== "string" ||
          !/^\d{4}-\d{2}-\d{2}$/.test(date)
        ) {
          return Response.json(
            {
              error:
                "date is required in YYYY-MM-DD format",
            },
            {
              status: 400,
            },
          );
        }

        /*
         * 2. Calculate the geographic bucket.
         */
        const bucket = getLocationBucket(
          latitude,
          longitude,
        );

        console.log(
          "Astronomy request:",
          {
            latitude,
            longitude,
            date,
            bucket: bucket.key,
          },
        );

        /*
         * 3. Check Supabase cache.
         */
        const {
          data: cachedData,
          error: cacheLookupError,
        } =
          await ctx.supabaseAdmin
            .from("astronomy_cache")
            .select("data")
            .eq(
              "location_bucket",
              bucket.key,
            )
            .eq(
              "astronomy_date",
              date,
            )
            .maybeSingle();

        /*
         * Cache errors should NOT stop
         * the astronomy request.
         */
        if (cacheLookupError) {
          console.error(
            "Astronomy cache lookup error:",
            cacheLookupError,
          );
        }

        /*
         * 4. Cache HIT.
         */
        if (cachedData) {
          console.log(
            `Astronomy cache HIT: ${bucket.key} ${date}`,
          );

          return Response.json({
            astronomy: cachedData.data,
          });
        }

        /*
         * 5. Cache MISS.
         */
        console.log(
          `Astronomy cache MISS: ${bucket.key} ${date}`,
        );

        /*
         * 6. Get provider configuration.
         */
        const astronomyApiKey =
          Deno.env.get(
            "IPGEOLOCATION_API_KEY",
          );

        const astronomyApiUrl =
          Deno.env.get(
            "IPGEOLOCATION_API_URL",
          );

        if (
          !astronomyApiKey ||
          !astronomyApiUrl
        ) {
          console.error(
            "IPGEOLOCATION_API_KEY or IPGEOLOCATION_API_URL is not configured",
          );

          return Response.json(
            {
              error:
                "Astronomy provider is not configured",
            },
            {
              status: 500,
            },
          );
        }

        /*
         * 7. Call IPGeolocation.
         *
         * IMPORTANT:
         * use the bucket coordinates,
         * not the user's exact coordinates.
         */
        const query =
          new URLSearchParams({
            apiKey: astronomyApiKey,

            lat:
              bucket.latitude.toString(),

            long:
              bucket.longitude.toString(),

            date,
          });

        const astronomyResponse =
          await fetch(
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
              error:
                "Unable to retrieve astronomy data",
            },
            {
              status: 502,
            },
          );
        }

        /*
         * 8. Read provider response.
         */
        const astronomy =
          await astronomyResponse.json();

        /*
         * 9. Save response in cache.
         *
         * If cache saving fails,
         * still return astronomy to the user.
         */
        const {
          error: cacheWriteError,
        } =
          await ctx.supabaseAdmin
            .from("astronomy_cache")
            .upsert(
              {
                location_bucket:
                  bucket.key,

                latitude:
                  bucket.latitude,

                longitude:
                  bucket.longitude,

                astronomy_date:
                  date,

                data:
                  astronomy,
              },
              {
                onConflict:
                  "location_bucket,astronomy_date",
              },
            );

        if (cacheWriteError) {
          console.error(
            "Astronomy cache write error:",
            cacheWriteError,
          );
        } else {
          console.log(
            `Astronomy cached: ${bucket.key} ${date}`,
          );
        }

        /*
         * 10. Return astronomy.
         *
         * Same response structure as before,
         * so frontend changes are unnecessary.
         */
        return Response.json({
          astronomy,
        });
      } catch (error) {
        console.error(
          "lunarscope-dashboard error:",
          error,
        );

        return Response.json(
          {
            error:
              "Unable to fetch celestial data",
          },
          {
            status: 500,
          },
        );
      }
    },
  ),
};