import { Container } from "@azure/cosmos";
import * as E from "fp-ts/lib/Either.js";
import * as O from "fp-ts/lib/Option.js";
import * as TE from "fp-ts/lib/TaskEither.js";
import { pipe } from "fp-ts/lib/function.js";

import { TaskCodec } from "../../../domain/Task.js";
import { TaskRepository } from "../../../domain/TaskRepository.js";
import { decodeFromFeed } from "./decode.js";
import { cosmosErrorToDomainError } from "./errors.js";

export const makeTaskRepository = (container: Container): TaskRepository => ({
  get: () => TE.right(O.none),
  insert: (task) =>
    pipe(
      TE.tryCatch(() => container.items.create(task), E.toError),
      TE.mapBoth(cosmosErrorToDomainError, () => task),
    ),
  list: () =>
    pipe(
      TE.tryCatch(
        () => container.items.query("SELECT * FROM c").fetchAll(),
        E.toError,
      ),
      TE.flatMapEither(decodeFromFeed(TaskCodec)),
      TE.mapLeft(cosmosErrorToDomainError),
    ),
});
