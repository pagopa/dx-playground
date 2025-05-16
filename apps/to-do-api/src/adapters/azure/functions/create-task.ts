import { emitCustomEvent } from "@pagopa/azure-tracing/logger";
import * as H from "@pagopa/handler-kit";
import { httpAzureFunction } from "@pagopa/handler-kit-azure-func";
import { Capabilities, createTask } from "@to-do/domain";
import * as RTE from "fp-ts/lib/ReaderTaskEither.js";
import { flow, pipe } from "fp-ts/lib/function.js";

import { CreateTaskItem } from "../../../generated/definitions/internal/CreateTaskItem.js";
import { TaskItem } from "../../../generated/definitions/internal/TaskItem.js";
import { toHttpProblemJson, toTaskItemAPI } from "../../http/codec.js";
import { parseRequestBody } from "../../http/middleware.js";

type Env = Pick<Capabilities, "taskIdGenerator" | "taskRepository">;

const makeHandlerKitHandler: H.Handler<
  H.HttpRequest,
  | H.HttpResponse<H.ProblemJson, H.HttpErrorStatusCode>
  | H.HttpResponse<TaskItem, 201>,
  Env
> = H.of((req: H.HttpRequest) =>
  pipe(
    RTE.ask<Env>(),
    // validate request body
    RTE.apSW("item", RTE.fromEither(parseRequestBody(CreateTaskItem)(req))),
    // execute use case
    RTE.flatMap(({ item }) => createTask(item.title)),
    RTE.chainFirst((task) => {
      emitCustomEvent("taskCreated", { id: task.id })("CreateTaskHandler");
      return RTE.of(task);
    }),
    // handle result and prepare response
    RTE.mapBoth(toHttpProblemJson, flow(toTaskItemAPI, H.createdJson)),
    RTE.orElseW(RTE.of),
  ),
);

export const makePostTaskHandler = httpAzureFunction(makeHandlerKitHandler);
