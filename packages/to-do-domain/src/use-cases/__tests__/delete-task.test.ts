import * as E from "fp-ts/lib/Either.js";
import * as O from "fp-ts/lib/Option.js";
import * as TE from "fp-ts/lib/TaskEither.js";
import { describe, expect, it } from "vitest";

import { aTask, makeTestEnvironment } from "../../__tests__/data";
import { ItemNotFound } from "../../errors";
import { deleteTaskById } from "../delete-task.js";

describe("deleteTask", () => {
  const { id } = aTask;
  it("should delete the task without fetching it first", async () => {
    const env = makeTestEnvironment();

    env.taskRepository.get.mockReturnValueOnce(TE.right(O.some(aTask)));
    env.taskRepository.delete.mockReturnValueOnce(TE.right(undefined));

    const actual = await deleteTaskById(id)(env)();
    expect(actual).toStrictEqual(E.right(void 0));
    expect(env.taskRepository.get).not.toHaveBeenCalled();
    expect(env.taskRepository.delete).nthCalledWith(1, id);
  });

  it("should return ItemNotFound from delete without fetching first", async () => {
    const env = makeTestEnvironment();

    const error = new ItemNotFound("Task not found");

    env.taskRepository.get.mockReturnValueOnce(TE.right(O.some(aTask)));
    env.taskRepository.delete.mockReturnValueOnce(TE.left(error));

    const actual = await deleteTaskById(id)(env)();

    expect(actual).toStrictEqual(E.left(error));
    expect(env.taskRepository.get).not.toHaveBeenCalled();
    expect(env.taskRepository.delete).nthCalledWith(1, id);
  });
});
