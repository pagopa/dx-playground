import { Container, ErrorResponse, FeedResponse } from "@azure/cosmos";
import {
  ItemAlreadyExists,
  ItemNotFound,
  TaskCodec,
  TaskRepository,
} from "@to-do/domain";
import * as E from "fp-ts/lib/Either.js";
import * as TE from "fp-ts/lib/TaskEither.js";
import { pipe } from "fp-ts/lib/function.js";
import * as t from "io-ts";

const cosmosErrorToDomainError = (error: Error) => {
  if (error instanceof ErrorResponse)
    if (error.code === 409)
      return new ItemAlreadyExists(
        `The item already exists; original error body: ${error.body}`,
      );
    else if (error.code === 404)
      return new ItemNotFound(
        `The item was not found; original error body: ${error.body}`,
      );
    else return error;
  else return error;
};

const decodeFromFeed =
  <A, O>(codec: t.Type<A, O>) =>
  <T extends FeedResponse<unknown>>(list: T) =>
    pipe(
      list.resources,
      t.array(codec).decode,
      E.mapLeft(
        () =>
          new Error(`Unable to parse the resources using codec ${codec.name}`),
      ),
    );

export const makeTaskRepository = (container: Container): TaskRepository => ({
  delete: () => TE.left(new Error("Not implemented")),
  get: () => TE.left(new Error("Not implemented")),
  insert: () => TE.left(new Error("Not implemented")),
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
