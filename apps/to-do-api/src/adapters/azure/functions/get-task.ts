import * as H from "@pagopa/handler-kit";
import { httpAzureFunction } from "@pagopa/handler-kit-azure-func";
import { Capabilities, TaskIdCodec } from "@to-do/domain";
import { getTaskById } from "@to-do/domain";
import * as RTE from "fp-ts/lib/ReaderTaskEither.js";
import { flow, pipe } from "fp-ts/lib/function.js";

import { TaskItem } from "../../../generated/definitions/internal/TaskItem.js";
import { toHttpProblemJson, toTaskItemAPI } from "../../http/codec.js";
import { parsePathParameter } from "../../http/middleware.js";

type Env = Pick<Capabilities, "taskIdGenerator" | "taskRepository">;

const makeHandlerKitHandler: H.Handler<
  H.HttpRequest,
  | H.HttpResponse<H.ProblemJson, H.HttpErrorStatusCode>
  | H.HttpResponse<TaskItem>,
  Env
> = H.of((req: H.HttpRequest) =>
  pipe(
    RTE.ask<Env>(),
    // validate and extract path parameter
    RTE.apSW(
      "id",
      RTE.fromEither(parsePathParameter(TaskIdCodec, "taskId")(req)),
    ),
    // execute use case
    RTE.flatMap(({ id }) => getTaskById(id)),
    // handle result and prepare response
    RTE.mapBoth(toHttpProblemJson, flow(toTaskItemAPI, H.successJson)),
    RTE.orElseW(RTE.of),
  ),
);

export const makeGetTaskHandler = httpAzureFunction(makeHandlerKitHandler);
