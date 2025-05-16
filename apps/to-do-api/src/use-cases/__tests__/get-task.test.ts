import { ItemNotFound } from "@to-do/domain";
import { aTask, makeTestEnvironment } from "@to-do/domain/test/data";
import * as E from "fp-ts/lib/Either.js";
import * as O from "fp-ts/lib/Option.js";
import * as TE from "fp-ts/lib/TaskEither.js";
import { describe, expect, it } from "vitest";

import { getTaskById } from "../get-task.js";

describe("getTask", () => {
  const { id } = aTask;
  it("should return the desired task", async () => {
    const env = makeTestEnvironment();

    env.taskRepository.get.mockReturnValueOnce(TE.right(O.some(aTask)));

    const actual = await getTaskById(id)(env)();
    expect(actual).toStrictEqual(E.right(aTask));
    expect(env.taskRepository.get).toHaveBeenCalledWith(id);
  });

  it("should return ItemNotFound error", async () => {
    const env = makeTestEnvironment();

    const error = new ItemNotFound("Task not found");

    env.taskRepository.get.mockReturnValueOnce(TE.right(O.none));
    const actual = await getTaskById(id)(env)();

    expect(actual).toStrictEqual(E.left(error));
  });
});
