import * as RTE from "fp-ts/lib/ReaderTaskEither.js";
import { pipe } from "fp-ts/lib/function.js";

import { Task } from "../domain/Task.js";
import { getTask } from "../domain/TaskRepository.js";
import { ItemNotFound } from "../domain/errors.js";

export const getTaskById = (id: Task["id"]) =>
  pipe(
    getTask(id),
    RTE.flatMapOption(
      (some) => some,
      () => new ItemNotFound("Task not found"),
    ),
  );
