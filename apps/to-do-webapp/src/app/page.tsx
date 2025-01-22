"use client";

import ToDoList from "@/components/ToDoList";
import ToDoTextArea from "@/components/ToDoTextArea";
import { getTaskList } from "@/lib/api";
import { TaskItem } from "@/lib/client/TaskItem";
import { TaskItemList } from "@/lib/client/TaskItemList";
import { Alert, Container, Divider, Typography } from "@mui/material";
import { useEffect, useState } from "react";
export const dynamic = "force-dynamic";

export default function Home() {
  const [tasks, setTasks] = useState<TaskItemList>([]);
  const [hasErrors, setHasErrors] = useState<boolean>(false);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { status, value: taskList } = await getTaskList();
        if (status === 200) {
          setHasErrors(false);
          setTasks(taskList);
        } else {
          setHasErrors(true);
          setTasks([]);
        }
      } catch (error) {
        setHasErrors(true);
      }
    };
    fetchTasks();
  }, []);

  // Update the list of tasks with the new task
  const addTask = (task: TaskItem) => {
    setTasks((prevTasks) => [...prevTasks, task]);
  };

  // Remove the completed task from the list
  const completeTask = (taskId: string) => {
    setTasks((tasks) => tasks.filter(({ id }) => id !== taskId));
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: "20px" }}>
      <Typography component="h1" variant="h2">
        My Tasks
      </Typography>
      <Divider sx={{ mb: "20px" }} />

      <ToDoTextArea label={"Add a task to the list"} onAddTask={addTask} />

      {hasErrors ? (
        <Alert severity="error">There was an error fetching the data</Alert>
      ) : (
        <ToDoList onTaskComplete={completeTask} tasks={tasks} />
      )}
    </Container>
  );
}
