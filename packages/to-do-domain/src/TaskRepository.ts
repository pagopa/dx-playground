import { pipe } from "fp-ts/lib/function.js";
import * as O from "fp-ts/lib/Option.js";
import * as RTE from "fp-ts/lib/ReaderTaskEither.js";
import * as TE from "fp-ts/lib/TaskEither.js";

import { Capabilities } from "./Capabilities.js";
import { Task } from "./Task.js";

export interface TaskRepository {
  delete: (id: Task["id"]) => TE.TaskEither<Error, void>;
  get: (id: Task["id"]) => TE.TaskEither<Error, O.Option<Task>>;
  insert: (task: Task) => TE.TaskEither<Error, Task>;
  list: () => TE.TaskEither<Error, readonly Task[]>;
}

export const deleteTask = (id: Task["id"]) =>
  pipe(
    RTE.ask<Pick<Capabilities, "taskRepository">>(),
    RTE.flatMapTaskEither(({ taskRepository }) => taskRepository.delete(id)),
  );

export const getTask = (id: Task["id"]) =>
  pipe(
    RTE.ask<Pick<Capabilities, "taskRepository">>(),
    RTE.flatMapTaskEither(({ taskRepository }) => taskRepository.get(id)),
  );

export const insertTask = (task: Task) =>
  pipe(
    RTE.ask<Pick<Capabilities, "taskRepository">>(),
    RTE.flatMapTaskEither(({ taskRepository }) => taskRepository.insert(task)),
  );

export const listTasks = () =>
  pipe(
    RTE.ask<Pick<Capabilities, "taskRepository">>(),
    RTE.flatMapTaskEither(({ taskRepository }) => taskRepository.list()),
  );
