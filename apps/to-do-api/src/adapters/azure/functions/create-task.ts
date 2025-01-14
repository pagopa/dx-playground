import * as H from "@pagopa/handler-kit";
import { httpAzureFunction } from "@pagopa/handler-kit-azure-func";
import * as RTE from "fp-ts/lib/ReaderTaskEither.js";
import { flow, pipe } from "fp-ts/lib/function.js";

import { CreateTaskItem } from "../../../generated/definitions/internal/CreateTaskItem.js";
import { TaskItem } from "../../../generated/definitions/internal/TaskItem.js";
import { TaskStateEnum } from "../../../generated/definitions/internal/TaskState.js";
import { toHttpProblemJson, toTaskItemAPI } from "../../http/codec.js";
import { parseRequestBody } from "../../http/middleware.js";

const makeHandlerKitHandler: H.Handler<
  H.HttpRequest,
  | H.HttpResponse<H.ProblemJson, H.HttpErrorStatusCode>
  | H.HttpResponse<TaskItem, 201>
> = H.of((req: H.HttpRequest) =>
  pipe(
    RTE.fromEither(parseRequestBody(CreateTaskItem)(req)),
    RTE.flatMap(({ title }) =>
      // TODO: Here we are going to add the call to a use case (or in general to the function that creates the task)
      RTE.of({
        id: "123",
        state: TaskStateEnum.INCOMPLETE,
        title,
      }),
    ),
    RTE.mapBoth(toHttpProblemJson, flow(toTaskItemAPI, H.createdJson)),
    RTE.orElseW(RTE.of),
  ),
);

export const makePostTaskHandler = httpAzureFunction(makeHandlerKitHandler);
