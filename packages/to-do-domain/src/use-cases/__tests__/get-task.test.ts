import * as E from "fp-ts/lib/Either.js";
import * as O from "fp-ts/lib/Option.js";
import * as TE from "fp-ts/lib/TaskEither.js";
import { describe, expect, it, vi } from "vitest";

import { aTask, makeTestEnvironment } from "../../__tests__/data.js";
import { ItemNotFound } from "../../errors";
import { getTaskById } from "../get-task.js";

describe("getTask", () => {
  const { id } = aTask;

  it("should return cached task on cache hit", async () => {
    const env = makeTestEnvironment();

    env.taskCacheRepository.get.mockReturnValueOnce(TE.right(O.some(aTask)));

    const actual = await getTaskById(id)(env)();

    expect(actual).toStrictEqual(E.right(aTask));
    expect(env.taskRepository.get).not.toHaveBeenCalled();
  });

  it("should fetch from DB and populate cache on miss", async () => {
    const env = makeTestEnvironment();

    env.taskCacheRepository.get.mockReturnValueOnce(TE.right(O.none));
    env.taskRepository.get.mockReturnValueOnce(TE.right(O.some(aTask)));
    env.taskCacheRepository.set.mockReturnValueOnce(TE.right(undefined));

    const actual = await getTaskById(id)(env)();

    expect(actual).toStrictEqual(E.right(aTask));
    expect(env.taskRepository.get).toHaveBeenCalledWith(id);
    expect(env.taskCacheRepository.set).toHaveBeenCalledWith(aTask);
  });

  it("should fetch from DB when cache read fails", async () => {
    const env = makeTestEnvironment();
    const cacheError = new Error("Redis unavailable");
    vi.spyOn(console, "warn").mockImplementation(() => undefined);

    env.taskCacheRepository.get.mockReturnValueOnce(TE.left(cacheError));
    env.taskRepository.get.mockReturnValueOnce(TE.right(O.some(aTask)));
    env.taskCacheRepository.set.mockReturnValueOnce(TE.right(undefined));

    const actual = await getTaskById(id)(env)();

    expect(actual).toStrictEqual(E.right(aTask));
    expect(env.taskRepository.get).toHaveBeenCalledWith(id);
    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining("cache read failed"),
    );

    vi.restoreAllMocks();
  });

  it("should return DB task when cache write fails", async () => {
    const env = makeTestEnvironment();
    const cacheError = new Error("Redis write error");
    vi.spyOn(console, "warn").mockImplementation(() => undefined);

    env.taskCacheRepository.get.mockReturnValueOnce(TE.right(O.none));
    env.taskRepository.get.mockReturnValueOnce(TE.right(O.some(aTask)));
    env.taskCacheRepository.set.mockReturnValueOnce(TE.left(cacheError));

    const actual = await getTaskById(id)(env)();

    expect(actual).toStrictEqual(E.right(aTask));
    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining("cache write failed"),
    );

    vi.restoreAllMocks();
  });

  it("should not cache when task is not found", async () => {
    const env = makeTestEnvironment();

    env.taskCacheRepository.get.mockReturnValueOnce(TE.right(O.none));
    env.taskRepository.get.mockReturnValueOnce(TE.right(O.none));

    const actual = await getTaskById(id)(env)();

    expect(actual).toStrictEqual(E.left(new ItemNotFound("Task not found")));
    expect(env.taskCacheRepository.set).not.toHaveBeenCalled();
  });
});
