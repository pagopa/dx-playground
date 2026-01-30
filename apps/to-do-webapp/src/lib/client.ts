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

// Only perform validation on the server. If this module is accidentally
// imported on the client, avoid throwing and instead rely on server routes
// to validate. `typeof window === 'undefined'` indicates server runtime.
let env: undefined | z.infer<typeof EnvSchema>;
if (typeof window === "undefined") {
  env = EnvSchema.parse(process.env);
}

const withApiKey: WithDefaultsT<"ApiKeyAuth"> =
  (wrappedOperation) => (params) =>
    wrappedOperation({
      ...params,
      // At runtime on the server we validated env above; assert here for TS.
      ApiKeyAuth: (env?.API_KEY ?? process.env.API_KEY) as string,
    });

export const client = createClient({
  basePath: (env?.API_BASE_PATH ?? process.env.API_BASE_PATH) as string,
  baseUrl: (env?.API_BASE_URL ?? process.env.API_BASE_URL) as string,
  fetchApi: fetch as unknown as typeof fetch,
  withDefaults: withApiKey,
});
