import * as E from "fp-ts/lib/Either.js";
import { describe, expect, it } from "vitest";

import { getConfigOrError } from "../config.js";

describe("getConfigOrError", () => {
  it("should return the redis endpoint when the env is valid", () => {
    const actual = getConfigOrError({
      COSMOSDB_DATABASE_NAME: "tasks-db",
      COSMOSDB_ENDPOINT: "https://cosmos.example.com",
      COSMOSDB_TASKS_CONTAINER_NAME: "tasks",
      REDIS_ENDPOINT: "cache.example.redis.azure.net:10000",
    });

    expect(actual).toStrictEqual(
      E.right({
        cosmosDb: {
          containers: {
            tasks: "tasks",
          },
          dbName: "tasks-db",
          endpoint: "https://cosmos.example.com",
        },
        redis: {
          endpoint: "cache.example.redis.azure.net:10000",
        },
      }),
    );
  });

  it("should return an error when REDIS_ENDPOINT is missing", () => {
    const actual = getConfigOrError({
      COSMOSDB_DATABASE_NAME: "tasks-db",
      COSMOSDB_ENDPOINT: "https://cosmos.example.com",
      COSMOSDB_TASKS_CONTAINER_NAME: "tasks",
    });

    expect(E.isLeft(actual)).toBe(true);
    if (E.isRight(actual)) {
      throw new Error("Expected getConfigOrError to fail");
    }
    expect(actual.left.message).toContain("REDIS_ENDPOINT");
  });
});
