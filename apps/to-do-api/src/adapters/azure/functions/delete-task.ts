import * as H from "@pagopa/handler-kit";
import { httpAzureFunction } from "@pagopa/handler-kit-azure-func";
import * as RTE from "fp-ts/lib/ReaderTaskEither.js";
import { pipe } from "fp-ts/lib/function.js";

import { aTask } from "../../../domain/__tests__/data.js";
import { Capabilities } from "../../../domain/Capabilities.js";
import { deleteTask } from "../../../domain/TaskRepository.js";
import { toHttpProblemJson } from "../../http/codec.js";

type Env = Pick<Capabilities, "taskIdGenerator" | "taskRepository">;

const makeHandlerKitHandler: H.Handler<
  H.HttpRequest,
  | H.HttpResponse<H.ProblemJson, H.HttpErrorStatusCode>
  | H.HttpResponse<unknown, 204>,
  Env
> = H.of(() =>
  pipe(
    RTE.ask<Env>(),
    // validate request body
    RTE.apSW("id", RTE.of(aTask.id)),
    // execute use case
    RTE.flatMap(({ id }) => deleteTask(id)),
    // handle result and prepare response
    RTE.mapBoth(toHttpProblemJson, () =>
      pipe(H.successJson({}), H.withStatusCode(204)),
    ),
    RTE.orElseW(RTE.of),
  ),
);

export const makeDeleteTaskHandler = httpAzureFunction(makeHandlerKitHandler);
