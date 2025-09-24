import * as H from "@pagopa/handler-kit";
import { httpAzureFunction } from "@pagopa/handler-kit-azure-func";
import { Capabilities, listTasks } from "@to-do/domain";
import { flow, pipe } from "fp-ts/lib/function.js";
import * as RTE from "fp-ts/lib/ReaderTaskEither.js";
import * as RA from "fp-ts/lib/ReadonlyArray.js";

import { TaskItemList } from "../../../generated/definitions/internal/TaskItemList.js";
import { toHttpProblemJson, toTaskItemAPI } from "../../http/codec.js";

type Env = Pick<Capabilities, "taskRepository">;

const makeHandlerKitHandler: H.Handler<
  H.HttpRequest,
  | H.HttpResponse<H.ProblemJson, H.HttpErrorStatusCode>
  | H.HttpResponse<TaskItemList>,
  Env
> = H.of(() =>
  pipe(
    RTE.ask<Env>(),
    // execute use case
    RTE.flatMap(listTasks),
    // handle result and prepare response
    RTE.mapBoth(toHttpProblemJson, flow(RA.map(toTaskItemAPI), H.successJson)),
    RTE.orElseW(RTE.of),
  ),
);

export const makeGetTasksHandler = httpAzureFunction(makeHandlerKitHandler);
