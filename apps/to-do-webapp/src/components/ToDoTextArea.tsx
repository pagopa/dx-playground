import { Button, TextField } from "@mui/material";
import React, { useState } from "react";

// TaskItem type removed; this component is presentational and only deals with titles

interface Props {
  label: string;
  // Parent must return a promise so the component can await and show loading
  onAddTask: (taskTitle: string) => Promise<void>;
}

const ToDoTextArea = ({ label, onAddTask }: Props) => {
  const [taskText, setTaskText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const isEmptyText = taskText.trim().length === 0;

  const handleAddTask = async (text: string) => {
    setIsLoading(true);
    try {
      await onAddTask(text);
      setTaskText("");
    } catch {
      // let parent show error
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (text: string) => (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !isEmptyText) {
      event.preventDefault();
      handleAddTask(text);
    }
  };

  return (
    <>
      <TextField
        disabled={isLoading}
        fullWidth
        label={label}
        onChange={(e) => setTaskText(e.target.value)}
        onKeyDown={handleKeyDown(taskText)}
        value={taskText}
        variant="outlined"
      />
      <Button
        disabled={isEmptyText || isLoading}
        onClick={() => handleAddTask(taskText)}
        sx={{ mt: 1 }}
        variant="contained"
      >
        {isLoading ? "Adding..." : "Add"}
      </Button>
    </>
  );
};

export default ToDoTextArea;
