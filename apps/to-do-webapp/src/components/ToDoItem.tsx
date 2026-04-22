import {
  Checkbox,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import React from "react";

import { completeTask } from "@/lib/api";
import { TaskId } from "@/lib/client/TaskId";

interface TodoItemProps {
  id: TaskId;
  // Function to execute when a task is completed
  onComplete: (id: TaskId) => void;
  // Function to execute when a task row is selected for details
  onSelect: (id: TaskId) => void;
  state: "COMPLETED" | "DELETED" | "INCOMPLETE";
  title: string;
}

const ToDoItem: React.FC<TodoItemProps> = ({
  id,
  onComplete,
  onSelect,
  state,
  title,
}) => {
  const handleTaskComplete = async (taskId: TaskId) => {
    try {
      const { status } = await completeTask(taskId);
      if (status === 204) {
        onComplete(id);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      /* error when deleting the task */
    }
  };
  return (
    <ListItem dense disablePadding divider={true} key={id}>
      <Checkbox
        checked={state === "COMPLETED"}
        onChange={() => handleTaskComplete(id)}
        onClick={(event) => event.stopPropagation()}
      />
      <ListItemButton onClick={() => onSelect(id)}>
        <ListItemText primary={title} />
      </ListItemButton>
    </ListItem>
  );
};

export default ToDoItem;
