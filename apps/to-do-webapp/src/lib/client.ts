import { z } from "zod";

import { createClient, WithDefaultsT } from "@/lib/client/client";

// Server-only environment validation: ensure required env vars exist and
// fail-fast with a clear error message. This module must remain server-side
// to avoid leaking secrets into client bundles.
const EnvSchema = z.object({
  API_BASE_PATH: z.string().nonempty(),
  API_BASE_URL: z.string().nonempty(),
  API_KEY: z.string().nonempty(),
  APPINSIGHTS_SAMPLING_PERCENTAGE: z.preprocess((v) => {
    if (v == null || v === "") return undefined;
    return Number(v);
  }, z.number().optional()),
  APPLICATIONINSIGHTS_CONNECTION_STRING: z.string().optional(),
  OTEL_SERVICE_NAME: z.string().optional(),
});

// Create the API client on the server only. This will parse and validate
// environment variables and throw immediately if any required value is
// missing or invalid — preventing the app from starting with a bad config.
function createServerClient() {
  const env = EnvSchema.parse(process.env); // throws on validation error

  const withApiKey: WithDefaultsT<"ApiKeyAuth"> =
    (wrappedOperation) => (params) =>
      wrappedOperation({
        ...params,
        ApiKeyAuth: env.API_KEY,
      });

  return createClient<"ApiKeyAuth">({
    basePath: env.API_BASE_PATH,
    baseUrl: env.API_BASE_URL,
    fetchApi: fetch as unknown as typeof fetch,
    withDefaults: withApiKey,
  });
}

// Export a server-only client. If this module is imported on the client,
// accessing `client` will throw a clear error (and it will not contain
// server secrets). This keeps env values out of client bundles.
export const client =
  typeof window === "undefined"
    ? createServerClient()
    : ((): never => {
        throw new Error(
          "Attempted to initialize server-only API client on the client. Ensure this module is only imported from server code.",
        );
      })();
