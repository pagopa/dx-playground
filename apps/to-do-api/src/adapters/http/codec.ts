import * as H from "@pagopa/handler-kit";
import { pipe } from "fp-ts/lib/function.js";

import { Task } from "../../domain/Task.js";
import { ItemAlreadyExists, ItemNotFound } from "../../domain/errors.js";
import { TaskItem as TaskItemAPI } from "../../generated/definitions/internal/TaskItem.js";
import { TaskStateEnum } from "../../generated/definitions/internal/TaskState.js";

export const toTaskItemAPI = (task: Task): TaskItemAPI => ({
  ...task,
  state: TaskStateEnum[task.state],
});

/**
 * This function converts any Error into an HTTP error response.
 * @param err the error to convert.
 */
export const toHttpProblemJson = (err: Error) => {
  if (err instanceof ItemNotFound) {
    // ItemNotFound -> 404 HTTP
    return pipe(
      new H.HttpNotFoundError(err.message),
      H.toProblemJson,
      H.problemJson,
      H.withStatusCode(404),
    );
  } else if (err instanceof ItemAlreadyExists) {
    // ItemAlreadyExists -> 409 HTTP
    return pipe(
      new H.HttpConflictError(err.message),
      H.toProblemJson,
      H.problemJson,
      H.withStatusCode(409),
    );
  } else {
    // Everything else -> 500 HTTP
    return pipe(err, H.toProblemJson, H.problemJson);
  }
};
