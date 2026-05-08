import { TaskCodec } from "@to-do/domain";
import { aTask } from "@to-do/domain/test/data";
import * as E from "fp-ts/lib/Either.js";
import * as O from "fp-ts/lib/Option.js";
import { describe, expect, it } from "vitest";
import { mockFn } from "vitest-mock-extended";

import { makeTaskCache } from "../TaskCache.js";

describe("TaskCache", () => {
  it("should return Some with the cached task", async () => {
    const client = {
      del: mockFn(),
      get: mockFn(),
      setEx: mockFn(),
    };

    client.get.mockResolvedValueOnce(JSON.stringify(aTask));

    const cache = makeTaskCache(client, 300);

    const actual = await cache.get(aTask.id)();

    expect(actual).toStrictEqual(E.right(O.some(aTask)));
    expect(client.get).toHaveBeenCalledWith(`task:${aTask.id}`);
  });

  it("should persist the task with the configured ttl", async () => {
    const client = {
      del: mockFn(),
      get: mockFn(),
      setEx: mockFn(),
    };

    client.setEx.mockResolvedValueOnce("OK");

    const cache = makeTaskCache(client, 300);

    const actual = await cache.set(aTask)();

    expect(actual).toStrictEqual(E.right(undefined));
    expect(client.setEx).toHaveBeenCalledWith(
      `task:${aTask.id}`,
      300,
      JSON.stringify(aTask),
    );
  });

  it("should delete the cached task", async () => {
    const client = {
      del: mockFn(),
      get: mockFn(),
      setEx: mockFn(),
    };

    client.del.mockResolvedValueOnce(1);

    const cache = makeTaskCache(client, 300);

    const actual = await cache.delete(aTask.id)();

    expect(actual).toStrictEqual(E.right(undefined));
    expect(client.del).toHaveBeenCalledWith(`task:${aTask.id}`);
  });

  it("should return None when the task is not cached", async () => {
    const client = {
      del: mockFn(),
      get: mockFn(),
      setEx: mockFn(),
    };

    client.get.mockResolvedValueOnce(null);

    const cache = makeTaskCache(client, 300);

    const actual = await cache.get(aTask.id)();

    expect(actual).toStrictEqual(E.right(O.none));
  });

  it("should return a Left when the cached payload cannot be decoded", async () => {
    const client = {
      del: mockFn(),
      get: mockFn(),
      setEx: mockFn(),
    };

    client.get.mockResolvedValueOnce(JSON.stringify({ title: "aTitle" }));

    const cache = makeTaskCache(client, 300);

    const actual = await cache.get(aTask.id)();

    expect(actual).toStrictEqual(
      E.left(
        new Error(
          `Unable to parse the ${aTask.id} using codec ${TaskCodec.name}`,
        ),
      ),
    );
  });
});
