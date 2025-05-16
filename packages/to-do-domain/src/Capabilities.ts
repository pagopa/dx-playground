import { TaskIdGenerator } from "./TaskIdGenerator.js";
import { TaskRepository } from "./TaskRepository.js";

export interface Capabilities {
  taskIdGenerator: TaskIdGenerator;
  taskRepository: TaskRepository;
}
