import { Checkbox, ListItem, ListItemText } from "@mui/material";
import React from "react";

import { TaskId } from "@/lib/client/TaskId";

interface TodoItemProps {
  id: TaskId;
  onComplete: (id: TaskId) => Promise<void>;
  state: "COMPLETED" | "DELETED" | "INCOMPLETE";
  title: string;
}

const ToDoItem: React.FC<TodoItemProps> = ({
  id,
  onComplete,
  state,
  title,
}) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleChange = async () => {
    setIsLoading(true);
    try {
      await onComplete(id);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ListItem dense divider={true}>
      <Checkbox
        checked={state === "COMPLETED"}
        disabled={isLoading}
        onChange={handleChange}
      />
      <ListItemText primary={title} />
    </ListItem>
  );
};

export default ToDoItem;
