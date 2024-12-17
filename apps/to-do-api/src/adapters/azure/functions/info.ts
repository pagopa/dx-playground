import { CosmosClient } from "@azure/cosmos";
import * as H from "@pagopa/handler-kit";
import { httpAzureFunction } from "@pagopa/handler-kit-azure-func";
import * as E from "fp-ts/lib/Either.js";
import * as RTE from "fp-ts/lib/ReaderTaskEither.js";
import * as RA from "fp-ts/lib/ReadonlyArray.js";
import * as T from "fp-ts/lib/Task.js";
import * as TE from "fp-ts/lib/TaskEither.js";
import { pipe } from "fp-ts/lib/function.js";

import { ApplicationInfo } from "../../../generated/definitions/internal/ApplicationInfo.js";

export interface InfoEnv {
  readonly cosmosClient: CosmosClient;
}

const cosmosHealthCheck = ({ cosmosClient }: InfoEnv) =>
  pipe(
    TE.tryCatch(() => cosmosClient.getDatabaseAccount(), E.toError),
    TE.bimap(
      ({ message }) => [message],
      () => true,
    ),
  );

const AccumulateErrors = RTE.getApplicativeReaderTaskValidation(
  T.ApplicativePar,
  RA.getSemigroup<string>(),
);

export const makeHandlerKitHandler: H.Handler<
  H.HttpRequest,
  H.HttpResponse<ApplicationInfo>,
  InfoEnv
> = H.of(() =>
  pipe(
    [cosmosHealthCheck],
    RA.sequence(AccumulateErrors),
    RTE.map(() => H.successJson({ name: "ToDo", version: "0.0.0" })),
    RTE.mapLeft((problems) => new H.HttpError(problems.join("\n\n"))),
  ),
);

export const makeInfoHandler = httpAzureFunction(makeHandlerKitHandler);
