import * as RTE from "fp-ts/lib/ReaderTaskEither.js";
import * as TE from "fp-ts/lib/TaskEither.js";
import { pipe } from "fp-ts/lib/function.js";

import { Capabilities } from "./Capabilities.js";
import { Task } from "./Task.js";

export interface TaskRepository {
  insert: (task: Task) => TE.TaskEither<Error, Task>;
  list: () => TE.TaskEither<Error, readonly Task[]>;
}

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
