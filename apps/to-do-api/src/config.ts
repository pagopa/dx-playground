import { NonEmptyString } from "@pagopa/ts-commons/lib/strings.js";
import * as E from "fp-ts/lib/Either.js";
import { pipe } from "fp-ts/lib/function.js";
import * as t from "io-ts";
import * as PR from "io-ts/lib/PathReporter.js";

export interface Config {
  readonly cosmosDb: {
    readonly containers: {
      tasks: string;
    };
    readonly dbName: string;
    readonly endpoint: string;
  };
}

const EnvsCodec = t.type({
  COSMOSDB_DATABASE_NAME: NonEmptyString,
  COSMOSDB_ENDPOINT: NonEmptyString,
  COSMOSDB_TASKS_CONTAINER_NAME: NonEmptyString,
});

/**
 * Read the application configuration and check for invalid values.
 *
 * @returns either the configuration values or an Error
 */
export const getConfigOrError = (
  envs: Record<string, string | undefined>,
): E.Either<Error, Config> =>
  pipe(
    EnvsCodec.decode(envs),
    E.bimap(
      (errors) => new Error(PR.failure(errors).join("\n")),
      (envs) => ({
        cosmosDb: {
          containers: {
            tasks: envs.COSMOSDB_TASKS_CONTAINER_NAME,
          },
          dbName: envs.COSMOSDB_DATABASE_NAME,
          endpoint: envs.COSMOSDB_ENDPOINT,
        },
      }),
    ),
  );
