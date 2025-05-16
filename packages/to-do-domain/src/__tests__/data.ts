import { mock } from "vitest-mock-extended";

import { Task } from "../Task.js";
import { TaskIdGenerator } from "../TaskIdGenerator.js";
import { TaskRepository } from "../TaskRepository.js";

const aTaskId = "aTaskId" as Task["id"];
export const aTask: Task = {
  id: aTaskId,
  state: "INCOMPLETE" as Task["state"],
  title: "aTitle",
};

export const makeTestEnvironment = () => ({
  taskIdGenerator: mock<TaskIdGenerator>(),
  taskRepository: mock<TaskRepository>(),
});
