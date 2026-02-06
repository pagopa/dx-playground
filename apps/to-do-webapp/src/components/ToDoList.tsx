import { List } from "@mui/material";
import React from "react";

import ToDoItem from "@/components/ToDoItem";
import { TaskId } from "@/lib/client/TaskId";
import { TaskItemList } from "@/lib/client/TaskItemList";

interface TaskListProps {
  // Function to execute when a task is completed
  // Function to execute when a task is completed (async)
  onTaskComplete: (id: TaskId) => Promise<void>;
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
        <ToDoItem
          id={item.id}
          key={item.id}
          onComplete={onTaskComplete}
          state={item.state}
          title={item.title}
        />
      ))}
  </List>
);

export default ToDoList;
