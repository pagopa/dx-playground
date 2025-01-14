import * as H from "@pagopa/handler-kit";
import { pipe } from "fp-ts/lib/function.js";

import { Task } from "../../domain/Task.js";
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
export const toHttpProblemJson = (err: Error) =>
  pipe(err, H.toProblemJson, H.problemJson);
