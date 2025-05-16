import { Task, TaskIdGenerator } from "@to-do/domain";
import { monotonicFactory } from "ulid";

const ulid = monotonicFactory();

export const makeTaskIdGenerator = (): TaskIdGenerator => ({
  generate: () => ulid() as Task["id"],
});
