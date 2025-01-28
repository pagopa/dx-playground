import { insertTask } from "@/lib/api";
import { TaskItem } from "@/lib/client/TaskItem";
import { Button, TextField } from "@mui/material";
import React, { useState } from "react";

interface Props {
  label: string;
  // Function to update the list of tasks with the new task
  onAddTask: (task: TaskItem) => void;
}

const ToDoTextArea = ({ label, onAddTask }: Props) => {
  const [taskText, setTaskText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const isEmptyText = taskText.trim().length === 0;

  const handleAddTask = async (text: string) => {
    setIsLoading(true);
    try {
      const { status, value } = await insertTask(text);
      if (status === 201) {
        setTaskText("");
        onAddTask(value);
      }
    } catch (error) {
      /* error when creating a task */
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
        style={{ marginTop: "10px" }}
        variant="contained"
      >
        {isLoading ? "adding the task..." : "add"}
      </Button>
    </>
  );
};

export default ToDoTextArea;
