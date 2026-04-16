import { Task } from "../Task.js";
import { deleteTask } from "../TaskRepository.js";

export const deleteTaskById = (id: Task["id"]) => deleteTask(id);
