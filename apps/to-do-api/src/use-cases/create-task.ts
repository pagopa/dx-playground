import * as RTE from "fp-ts/lib/ReaderTaskEither.js";
import { pipe } from "fp-ts/lib/function.js";

import { makeNewTask } from "../domain/Task.js";
import { makeTaskId } from "../domain/TaskIdGenerator.js";
import { insertTask } from "../domain/TaskRepository.js";

export const createTask = (title: string) =>
  pipe(
    makeTaskId(),
    RTE.map((id) => makeNewTask(id, title)),
    RTE.flatMap(insertTask),
  );
