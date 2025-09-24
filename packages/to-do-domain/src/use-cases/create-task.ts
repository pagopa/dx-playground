import { pipe } from "fp-ts/lib/function.js";
import * as RTE from "fp-ts/lib/ReaderTaskEither.js";

import { makeNewTask } from "../Task.js";
import { makeTaskId } from "../TaskIdGenerator.js";
import { insertTask } from "../TaskRepository.js";

export const createTask = (title: string) =>
  pipe(
    makeTaskId(),
    RTE.map((id) => makeNewTask(id, title)),
    RTE.flatMap(insertTask),
  );
