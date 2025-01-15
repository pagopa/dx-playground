import { Container, ItemDefinition, ItemResponse } from "@azure/cosmos";
import * as E from "fp-ts/lib/Either.js";
import * as O from "fp-ts/lib/Option.js";
import * as TE from "fp-ts/lib/TaskEither.js";
import { pipe } from "fp-ts/lib/function.js";
import * as t from "io-ts";

import { TaskCodec } from "../../../domain/Task.js";
import { TaskRepository } from "../../../domain/TaskRepository.js";
import { decodeFromFeed } from "./decode.js";
import { cosmosErrorToDomainError } from "./errors.js";

// TODO: Move this to a separate file (introduced in another PR)
export const decodeFromItem =
  <A, O>(codec: t.Type<A, O>) =>
  <T extends ItemDefinition>(item: ItemResponse<T>) =>
    pipe(
      O.fromNullable(item.resource),
      O.map(codec.decode),
      // transform Option<Either<L, R>> => Either<L, Option<R>>
      O.sequence(E.Applicative),
      E.mapLeft(
        () =>
          new Error(
            `Unable to parse the ${item.resource?.id} using codec ${codec.name}`,
          ),
      ),
    );

export const makeTaskRepository = (container: Container): TaskRepository => ({
  get: (id) =>
    pipe(
      TE.tryCatch(() => container.item(id, id).read(), E.toError),
      TE.flatMapEither(decodeFromItem(TaskCodec)),
      TE.mapLeft(cosmosErrorToDomainError),
    ),
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
