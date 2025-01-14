import * as TE from "fp-ts/lib/TaskEither.js";

import { TaskRepository } from "../../../domain/TaskRepository.js";

// FIXME: Implements using cosmosDB SDK
export const makeTaskRepository = (): TaskRepository => ({
  insert: (task) => TE.of(task),
});
