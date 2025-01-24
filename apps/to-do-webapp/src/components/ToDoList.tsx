import ToDoItem from "@/components/ToDoItem";
import { TaskId } from "@/lib/client/TaskId";
import { TaskItemList } from "@/lib/client/TaskItemList";
import { List } from "@mui/material";
import React from "react";

interface TaskListProps {
  // Function to execute when a task is completed
  onTaskComplete: (id: TaskId) => void;
  tasks: TaskItemList;
}

const ToDoList: React.FC<TaskListProps> = ({
  onTaskComplete,
  tasks,
}: TaskListProps) => (
  <List>
    {tasks
      .filter(({ state }) => state === "INCOMPLETE")
      .map((item) => (
        <ToDoItem {...item} key={item.id} onComplete={onTaskComplete} />
      ))}
  </List>
);

export default ToDoList;
