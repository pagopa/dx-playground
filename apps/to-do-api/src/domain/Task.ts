import * as t from "io-ts";

interface TaskIdBrand {
  readonly TaskId: unique symbol;
}
export const TaskIdCodec = t.brand(
  t.string,
  (str): str is t.Branded<string, TaskIdBrand> => str.length > 0,
  "TaskId",
);

export const TaskCodec = t.strict({
  id: TaskIdCodec,
  state: t.union([
    t.literal("COMPLETED"),
    t.literal("DELETED"),
    t.literal("INCOMPLETE"),
  ]),
  title: t.string,
});
export type Task = t.TypeOf<typeof TaskCodec>;

export const makeNewTask = (id: Task["id"], title: string): Task => ({
  id,
  state: "INCOMPLETE",
  title,
});
