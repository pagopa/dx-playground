import * as E from "fp-ts/lib/Either.js";
import * as O from "fp-ts/lib/Option.js";
import * as TE from "fp-ts/lib/TaskEither.js";
import { describe, expect, it, vi } from "vitest";

import { aTask, makeTestEnvironment } from "../../__tests__/data";
import { ItemNotFound } from "../../errors";
import { deleteTaskById } from "../delete-task.js";

describe("deleteTask", () => {
  const { id } = aTask;

  it("should delete the task and invalidate cache", async () => {
    const env = makeTestEnvironment();

    env.taskRepository.get.mockReturnValueOnce(TE.right(O.some(aTask)));
    env.taskRepository.delete.mockReturnValueOnce(TE.right(undefined));
    env.taskCacheRepository.delete.mockReturnValueOnce(TE.right(undefined));

    const actual = await deleteTaskById(id)(env)();
    expect(actual).toStrictEqual(E.right(void 0));
    expect(env.taskRepository.get).nthCalledWith(1, id);
    expect(env.taskRepository.delete).nthCalledWith(1, id);
    expect(env.taskCacheRepository.delete).toHaveBeenCalledWith(id);
  });

  it("should return ItemNotFound error", async () => {
    const env = makeTestEnvironment();

    const error = new ItemNotFound("Task not found");

    env.taskRepository.get.mockReturnValueOnce(TE.right(O.none));
    const actual = await deleteTaskById(id)(env)();

    expect(actual).toStrictEqual(E.left(error));
    expect(env.taskRepository.get).nthCalledWith(1, id);
    expect(env.taskRepository.delete).not.toHaveBeenCalled();
  });

  it("should succeed even when cache invalidation fails", async () => {
    const env = makeTestEnvironment();
    const cacheError = new Error("Redis delete failed");
    vi.spyOn(console, "warn").mockImplementation(() => undefined);

    env.taskRepository.get.mockReturnValueOnce(TE.right(O.some(aTask)));
    env.taskRepository.delete.mockReturnValueOnce(TE.right(undefined));
    env.taskCacheRepository.delete.mockReturnValueOnce(TE.left(cacheError));

    const actual = await deleteTaskById(id)(env)();

    expect(actual).toStrictEqual(E.right(void 0));
    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining("cache invalidation failed"),
    );

    vi.restoreAllMocks();
  });
});
