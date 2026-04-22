import { DefaultAzureCredential } from "@azure/identity";
import { createCluster } from "@redis/client";
import {
  EntraIdCredentialsProviderFactory,
  REDIS_SCOPE_DEFAULT,
} from "@redis/entraid";
import * as net from "node:net";

import { RedisTaskCacheClient } from "./TaskCache.js";

export interface RedisConfig {
  endpoint: string;
}

interface RedisClusterClient extends RedisTaskCacheClient {
  connect: () => Promise<unknown>;
  isOpen: boolean;
  on: (event: "error", listener: (error: Error) => void) => void;
}

const makeNodeAddressMap =
  (redisHostName: string) =>
  (incomingAddress: string): { host: string; port: number } => {
    const [hostNameOrIp = redisHostName, port = "10000"] =
      incomingAddress.split(":");

    return {
      host: net.isIP(hostNameOrIp) !== 0 ? redisHostName : hostNameOrIp,
      port: Number(port),
    };
  };

export const createRedisClient = (
  config: RedisConfig,
): RedisTaskCacheClient => {
  const [redisHostName = config.endpoint] = config.endpoint.split(":");
  const credentialsProvider =
    EntraIdCredentialsProviderFactory.createForDefaultAzureCredential({
      credential: new DefaultAzureCredential(),
      scopes: REDIS_SCOPE_DEFAULT,
      tokenManagerConfig: {
        expirationRefreshRatio: 0.8,
      },
    });
  const client: RedisClusterClient = createCluster({
    defaults: {
      credentialsProvider,
      socket: {
        connectTimeout: 15000,
        tls: true,
      },
    },
    nodeAddressMap: makeNodeAddressMap(redisHostName),
    rootNodes: [{ url: `rediss://${config.endpoint}` }],
  });

  client.on("error", (error) => {
    console.error("Redis client error", error);
  });

  let connectionPromise: Promise<void> | undefined;

  const ensureConnected = () => {
    if (client.isOpen) {
      return Promise.resolve();
    }

    connectionPromise ??= client
      .connect()
      .then(() => undefined)
      .catch((error) => {
        connectionPromise = undefined;
        throw error;
      });

    return connectionPromise;
  };

  return {
    del: async (key) => {
      await ensureConnected();
      return client.del(key);
    },
    get: async (key) => {
      await ensureConnected();
      return client.get(key);
    },
    setEx: async (key, seconds, value) => {
      await ensureConnected();
      return client.setEx(key, seconds, value);
    },
  };
};
