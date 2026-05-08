import * as O from "fp-ts/lib/Option.js";
import * as TE from "fp-ts/lib/TaskEither.js";

import { Task } from "./Task.js";

export interface TaskCacheRepository {
  delete: (id: Task["id"]) => TE.TaskEither<Error, void>;
  get: (id: Task["id"]) => TE.TaskEither<Error, O.Option<Task>>;
  set: (task: Task) => TE.TaskEither<Error, void>;
}
