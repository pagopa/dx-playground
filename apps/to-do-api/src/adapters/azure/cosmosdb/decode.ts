import { FeedResponse, ItemDefinition, ItemResponse } from "@azure/cosmos";
import * as O from "fp-ts/Option";
import * as E from "fp-ts/lib/Either.js";
import { pipe } from "fp-ts/lib/function.js";
import * as t from "io-ts";

/**
 * Decode a list of resources, extracted from a FeedResponse, using a codec.
 *
 * @param codec the io-ts codec to use to decode the resources
 */
export const decodeFromFeed =
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

/**
 * Decode a single resource, extracted from an ItemResponse, using a codec.
 * @param codec the io-ts codec to use to decode the resource
 */
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
