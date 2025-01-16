import * as E from "fp-ts/lib/Either.js";
import * as O from "fp-ts/lib/Option.js";
import * as TE from "fp-ts/lib/TaskEither.js";
import { describe, expect, it } from "vitest";

import { aTask, makeTestEnvironment } from "../../domain/__tests__/data.js";
import { ItemNotFound } from "../../domain/errors.js";
import { deleteTaskById } from "../delete-task.js";

describe("deleteTask", () => {
  const { id } = aTask;
  it("should delete the task", async () => {
    const env = makeTestEnvironment();

    env.taskRepository.get.mockReturnValueOnce(TE.right(O.some(aTask)));
    env.taskRepository.delete.mockReturnValueOnce(TE.right(undefined));

    const actual = await deleteTaskById(id)(env)();
    expect(actual).toStrictEqual(E.right(void 0));
    expect(env.taskRepository.get).nthCalledWith(1, id);
    expect(env.taskRepository.delete).nthCalledWith(1, id);
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
});
