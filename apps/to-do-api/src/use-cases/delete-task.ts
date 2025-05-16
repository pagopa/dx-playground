import { ItemNotFound, Task, deleteTask, getTask } from "@to-do/domain";
import * as RTE from "fp-ts/lib/ReaderTaskEither.js";
import { pipe } from "fp-ts/lib/function.js";

export const deleteTaskById = (id: Task["id"]) =>
  pipe(
    getTask(id),
    RTE.flatMap(RTE.fromOption(() => new ItemNotFound("Task not found"))),
    RTE.flatMap(({ id }) => deleteTask(id)),
  );
