import { insertTask, makeNewTask, makeTaskId } from "@to-do/domain";
import * as RTE from "fp-ts/lib/ReaderTaskEither.js";
import { pipe } from "fp-ts/lib/function.js";

export const createTask = (title: string) =>
  pipe(
    makeTaskId(),
    RTE.map((id) => makeNewTask(id, title)),
    RTE.flatMap(insertTask),
  );
