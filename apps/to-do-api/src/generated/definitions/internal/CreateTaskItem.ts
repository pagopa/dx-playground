/**
 * Do not edit this file it is auto-generated by io-utils / gen-api-models.
 * See https://github.com/pagopa/io-utils
 */
/* eslint-disable  */

import { TaskTitle } from "./TaskTitle.js";
import * as t from "io-ts";

// required attributes
const CreateTaskItemR = t.interface({
  title: TaskTitle
});

// optional attributes
const CreateTaskItemO = t.partial({});

export const CreateTaskItem = t.intersection(
  [CreateTaskItemR, CreateTaskItemO],
  "CreateTaskItem"
);

export type CreateTaskItem = t.TypeOf<typeof CreateTaskItem>;