import * as RTE from "fp-ts/lib/ReaderTaskEither.js";
import { pipe } from "fp-ts/lib/function.js";

import { Task } from "../Task.js";
import { deleteTask, getTask } from "../TaskRepository.js";
import { ItemNotFound } from "../errors.js";

export const deleteTaskById = (id: Task["id"]) =>
  pipe(
    getTask(id),
    RTE.flatMap(RTE.fromOption(() => new ItemNotFound("Task not found"))),
    RTE.flatMap(({ id }) => deleteTask(id)),
  );
