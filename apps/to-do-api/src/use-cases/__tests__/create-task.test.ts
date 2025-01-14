import * as E from "fp-ts/lib/Either.js";
import * as TE from "fp-ts/lib/TaskEither.js";
import { describe, expect, it } from "vitest";

import { aTask, makeTestEnvironment } from "../../domain/__tests__/data.js";
import { createTask } from "../create-task.js";

describe("createTask", () => {
  const id = aTask.id;
  const title = "My task";
  it("should return an error", async () => {
    const env = makeTestEnvironment();
    const error = new Error("Error");

    env.taskIdGenerator.generate.mockReturnValueOnce(id);
    env.taskRepository.insert.mockReturnValueOnce(TE.left(error));

    const actual = await createTask(title)(env)();

    expect(actual).toStrictEqual(E.left(error));
  });

  it("should return the created task", async () => {
    const env = makeTestEnvironment();

    const task = { ...aTask, id, title };
    env.taskIdGenerator.generate.mockReturnValueOnce(id);

    env.taskRepository.insert.mockReturnValueOnce(TE.right(task));
    const actual = await createTask(title)(env)();

    expect(actual).toStrictEqual(E.right(task));
    expect(env.taskRepository.insert).toHaveBeenCalledWith(task);
  });
});
