import { monotonicFactory } from "ulid";

import { Task } from "../../domain/Task.js";
import { TaskIdGenerator } from "../../domain/TaskIdGenerator.js";

const ulid = monotonicFactory();

export const makeTaskIdGenerator = (): TaskIdGenerator => ({
  generate: () => ulid() as Task["id"],
});
