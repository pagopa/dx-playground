import * as H from "@pagopa/handler-kit";
import { httpAzureFunction } from "@pagopa/handler-kit-azure-func";
import * as RTE from "fp-ts/lib/ReaderTaskEither.js";
import { pipe } from "fp-ts/lib/function.js";

import { Capabilities } from "../../../domain/Capabilities.js";
import { TaskIdCodec } from "../../../domain/Task.js";
import { deleteTask } from "../../../domain/TaskRepository.js";
import { toHttpProblemJson } from "../../http/codec.js";
import { parsePathParameter } from "../../http/middleware.js";

type Env = Pick<Capabilities, "taskIdGenerator" | "taskRepository">;

const makeHandlerKitHandler: H.Handler<
  H.HttpRequest,
  | H.HttpResponse<H.ProblemJson, H.HttpErrorStatusCode>
  | H.HttpResponse<unknown, 204>,
  Env
> = H.of((req: H.HttpRequest) =>
  pipe(
    RTE.ask<Env>(),
    // validate request body
    RTE.apSW(
      "id",
      RTE.fromEither(parsePathParameter(TaskIdCodec, "taskId")(req)),
    ),
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
