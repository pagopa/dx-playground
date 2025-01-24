import { completeTask } from "@/lib/api";
import { TaskId } from "@/lib/client/TaskId";
import { Checkbox, ListItem, ListItemText } from "@mui/material";
import React from "react";

interface TodoItemProps {
  id: TaskId;
  // Function to execute when a task is completed
  onComplete: (id: TaskId) => void;
  state: "COMPLETED" | "DELETED" | "INCOMPLETE";
  title: string;
}

const ToDoItem: React.FC<TodoItemProps> = ({
  id,
  onComplete,
  state,
  title,
}) => {
  const handleTaskComplete = async (taskId: TaskId) => {
    try {
      const { status } = await completeTask(taskId);
      if (status === 204) {
        onComplete(id);
      }
    } catch (error) {
      /* error when deleting the task */
    }
  };
  return (
    <ListItem dense divider={true} key={id}>
      <Checkbox
        checked={state === "COMPLETED"}
        onChange={() => handleTaskComplete(id)}
      />
      <ListItemText primary={title} />
    </ListItem>
  );
};

export default ToDoItem;
