import { TaskCacheRepository } from "./TaskCacheRepository.js";
import { TaskIdGenerator } from "./TaskIdGenerator.js";
import { TaskRepository } from "./TaskRepository.js";

export interface Capabilities {
  taskCacheRepository: TaskCacheRepository;
  taskIdGenerator: TaskIdGenerator;
  taskRepository: TaskRepository;
}
