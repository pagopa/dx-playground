import { Container } from "@azure/cosmos";
import * as E from "fp-ts/lib/Either.js";
import * as TE from "fp-ts/lib/TaskEither.js";
import { pipe } from "fp-ts/lib/function.js";

import { TaskRepository } from "../../../domain/TaskRepository.js";
import { cosmosErrorToDomainError } from "./errors.js";

export const makeTaskRepository = (container: Container): TaskRepository => ({
  insert: (task) =>
    pipe(
      TE.tryCatch(() => container.items.create(task), E.toError),
      TE.mapBoth(cosmosErrorToDomainError, () => task),
    ),
});
