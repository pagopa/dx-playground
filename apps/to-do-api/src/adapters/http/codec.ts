import * as H from "@pagopa/handler-kit";
import { pipe } from "fp-ts/function";

import { TaskItem as TaskItemAPI } from "../../generated/definitions/internal/TaskItem.js";
import { TaskStateEnum } from "../../generated/definitions/internal/TaskState.js";

// TODO: Here we are going to add the implementation of the function that convert a domain object into a TaskItemAPI object
export const toTaskItemAPI = (): TaskItemAPI => ({
  id: "123",
  state: TaskStateEnum.INCOMPLETE,
  title: "Task Title",
});

/**
 * This function converts any Error into an HTTP error response.
 * @param err the error to convert.
 */
export const toHttpProblemJson = (err: Error) =>
  pipe(err, H.toProblemJson, H.problemJson);
