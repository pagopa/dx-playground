import * as H from "@pagopa/handler-kit";
import { httpAzureFunction } from "@pagopa/handler-kit-azure-func";
import { createCosmosClient } from "@to-do/azure-adapters/cosmosdb";
import * as E from "fp-ts/lib/Either.js";
import * as RTE from "fp-ts/lib/ReaderTaskEither.js";
import * as TE from "fp-ts/lib/TaskEither.js";
import { pipe } from "fp-ts/lib/function.js";

import { ApplicationInfo } from "../../../generated/definitions/internal/ApplicationInfo.js";

export interface InfoEnv {
  readonly cosmosClient: ReturnType<typeof createCosmosClient>;
}

const cosmosHealthCheck: RTE.ReaderTaskEither<
  InfoEnv,
  readonly string[],
  boolean
> = ({ cosmosClient }: InfoEnv) =>
  pipe(
    TE.tryCatch(() => cosmosClient.getDatabaseAccount(), E.toError),
    TE.bimap(
      ({ message }) => [message],
      () => true,
    ),
  );

export const makeHandlerKitHandler: H.Handler<
  H.HttpRequest,
  H.HttpResponse<ApplicationInfo>,
  InfoEnv
> = H.of(() =>
  pipe(
    cosmosHealthCheck,
    RTE.bimap(
      (problemMessages: readonly string[]) =>
        new H.HttpError(problemMessages.join("\n\n")),
      () => H.successJson({ name: "ToDo", version: "0.0.0" }),
    ),
  ),
);

export const makeInfoHandler = httpAzureFunction(makeHandlerKitHandler);
