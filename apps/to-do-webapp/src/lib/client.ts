import { createClient, WithDefaultsT } from "@/lib/client/client";

const withApiKey: WithDefaultsT<"ApiKeyAuth"> =
  (wrappedOperation) => (params) =>
    wrappedOperation({
      ...params,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      ApiKeyAuth: process.env.API_KEY!,
    });

export const client = createClient({
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  basePath: process.env.API_BASE_PATH!,
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  baseUrl: process.env.API_BASE_URL!,
  fetchApi: fetch as unknown as typeof fetch,
  withDefaults: withApiKey,
});
