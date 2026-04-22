import * as E from "fp-ts/lib/Either.js";
import { pipe } from "fp-ts/lib/function.js";
import * as O from "fp-ts/lib/Option.js";
import * as RTE from "fp-ts/lib/ReaderTaskEither.js";
import * as TE from "fp-ts/lib/TaskEither.js";

import { Capabilities } from "../Capabilities.js";
import { ItemNotFound } from "../errors.js";
import { Task } from "../Task.js";
import { TaskCacheRepository } from "../TaskCacheRepository.js";
import { TaskRepository } from "../TaskRepository.js";

type GetTaskEnv = Pick<Capabilities, "taskCacheRepository" | "taskRepository">;

const getTaskFromDb = (
  id: Task["id"],
  taskRepository: TaskRepository,
): TE.TaskEither<Error, Task> =>
  pipe(
    taskRepository.get(id),
    TE.flatMap(TE.fromOption(() => new ItemNotFound("Task not found"))),
  );

const getTaskWithCache =
  (
    id: Task["id"],
    taskRepository: TaskRepository,
    taskCacheRepository: TaskCacheRepository,
  ): TE.TaskEither<Error, Task> =>
  async () => {
    const cacheResult = await taskCacheRepository.get(id)();

    if (E.isRight(cacheResult) && O.isSome(cacheResult.right)) {
      console.log(`Task ${id} served from cache`);
      return E.right(cacheResult.right.value);
    }

    if (E.isLeft(cacheResult)) {
      console.warn(`Task ${id} cache read failed: ${cacheResult.left.message}`);
    }

    const dbResult = await getTaskFromDb(id, taskRepository)();

    if (E.isLeft(dbResult)) {
      return dbResult;
    }

    const cacheWrite = await taskCacheRepository.set(dbResult.right)();
    if (E.isLeft(cacheWrite)) {
      console.warn(`Task ${id} cache write failed: ${cacheWrite.left.message}`);
    }

    console.log(`Task ${id} served from database`);
    return dbResult;
  };

export const getTaskById = (id: Task["id"]) =>
  pipe(
    RTE.ask<GetTaskEnv>(),
    RTE.flatMapTaskEither(({ taskCacheRepository, taskRepository }) =>
      getTaskWithCache(id, taskRepository, taskCacheRepository),
    ),
  );
