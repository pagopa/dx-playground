import * as RTE from "fp-ts/lib/ReaderTaskEither.js";
import { pipe } from "fp-ts/lib/function.js";

import { Capabilities } from "./Capabilities.js";
import { Task } from "./Task.js";

export interface TaskIdGenerator {
  generate: () => Task["id"];
}

export const makeTaskId = () =>
  pipe(
    RTE.ask<Pick<Capabilities, "taskIdGenerator">>(),
    RTE.map(({ taskIdGenerator }) => taskIdGenerator.generate()),
  );
