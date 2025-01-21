import {createClient, WithDefaultsT} from "@/lib/client/client";
import {config} from "@/lib/config";

const withApiKey: WithDefaultsT<"ApiKeyAuth"> =
    wrappedOperation =>
        params => {
          return wrappedOperation({
            ...params,
            ApiKeyAuth: config.server.apiKey!
          });
        };

export const client = createClient({
  baseUrl: config.server.url!,
  basePath: config.server.basePath,
  fetchApi: fetch as unknown as typeof fetch,
  withDefaults: withApiKey
});
