import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";
import {
  isLunarScopeAstronomy,
  toLunarScopeAstronomy,
} from "./toLunarScopeAstronomy.ts";

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
         *
         * Only return cached rows that already
         * match the LunarScope contract.
         * Raw provider rows are remapped below.
         */
        if (
          cachedData &&
          isLunarScopeAstronomy(cachedData.data)
        ) {
          console.log(
            `Astronomy cache HIT: ${bucket.key} ${date}`,
          );

          return Response.json({
            astronomy: cachedData.data,
          });
        }

        /*
         * 5. Remap stale cache rows.
         *
         * Older rows stored the raw provider
         * payload. Convert them in place so
         * LunarScope never receives that shape.
         */
        if (cachedData) {
          try {
            const astronomy = toLunarScopeAstronomy(
              cachedData.data,
            );

            const {
              error: cacheRewriteError,
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

            if (cacheRewriteError) {
              console.error(
                "Astronomy cache rewrite error:",
                cacheRewriteError,
              );
            } else {
              console.log(
                `Astronomy cache remapped: ${bucket.key} ${date}`,
              );
            }

            return Response.json({
              astronomy,
            });
          } catch (error) {
            console.error(
              "Astronomy cache remap error:",
              error,
            );
          }
        }

        /*
         * 6. Cache MISS.
         */
        console.log(
          `Astronomy cache MISS: ${bucket.key} ${date}`,
        );

        /*
         * 7. Get provider configuration.
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
         * 8. Call IPGeolocation.
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
         * 9. Read provider response.
         *
         * Keep this payload private.
         * Do not cache or return it.
         */
        const providerAstronomy =
          await astronomyResponse.json();

        /*
         * 10. Map to the LunarScope contract.
         *
         * LunarScope never sees raw
         * IPGeolocation fields or types.
         */
        let astronomy;

        try {
          astronomy = toLunarScopeAstronomy(
            providerAstronomy,
          );
        } catch (error) {
          console.error(
            "Astronomy mapping error:",
            error,
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
         * 11. Save LunarScope astronomy in cache.
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
         * 12. Return LunarScope astronomy.
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