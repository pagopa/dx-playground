import { pipe } from "fp-ts/lib/function.js";
import * as RTE from "fp-ts/lib/ReaderTaskEither.js";
import * as TE from "fp-ts/lib/TaskEither.js";

import { Capabilities } from "../Capabilities.js";
import { ItemNotFound } from "../errors.js";
import { Task } from "../Task.js";
import { deleteTask, getTask } from "../TaskRepository.js";

type InvalidateCacheEnv = Pick<
  Capabilities,
  "taskCacheRepository" | "taskRepository"
>;

const invalidateCache = (
  id: Task["id"],
): RTE.ReaderTaskEither<InvalidateCacheEnv, Error, undefined> =>
  pipe(
    RTE.ask<InvalidateCacheEnv>(),
    RTE.flatMapTaskEither(({ taskCacheRepository }) =>
      pipe(
        taskCacheRepository.delete(id),
        TE.map(() => undefined),
        TE.orElse((error) => {
          console.warn(
            `Task ${id} cache invalidation failed: ${error.message}`,
          );
          return TE.right(undefined);
        }),
      ),
    ),
  );

export const deleteTaskById = (id: Task["id"]) =>
  pipe(
    getTask(id),
    RTE.flatMap(RTE.fromOption(() => new ItemNotFound("Task not found"))),
    RTE.flatMap((task) => deleteTask(task.id)),
    RTE.flatMap(() => invalidateCache(id)),
  );
