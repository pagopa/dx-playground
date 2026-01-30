"use client";

import { Alert, Container, Divider, Typography } from "@mui/material";
import { useState } from "react";

import type { TaskItemList } from "@/lib/client/TaskItemList";

import ToDoList from "@/components/ToDoList";
import ToDoTextArea from "@/components/ToDoTextArea";

export default function TasksClient({
  initialTasks,
}: {
  initialTasks: TaskItemList;
}) {
  const [tasks, setTasks] = useState(initialTasks);
  const [error, setError] = useState<null | string>(null);

  const addTask = async (title: string): Promise<void> => {
    setError(null);
    try {
      const res = await fetch("/api/tasks", {
        body: JSON.stringify({ title }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      if (res.ok) {
        const created = await res.json();
        setTasks((p) => [...p, created]);
      } else {
        const body = await res.json().catch(() => null);
        setError(body?.message ?? "Failed creating task");
      }
    } catch (err) {
      setError("Failed creating task");
      throw err instanceof Error ? err : new Error(String(err));
    }
  };

  const completeTask = async (id: string): Promise<void> => {
    setError(null);
    try {
      const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
      if (res.ok) {
        setTasks((p) => p.filter((t) => t.id !== id));
      } else {
        setError("Failed deleting task");
      }
    } catch (err) {
      setError("Failed deleting task");
      throw err instanceof Error ? err : new Error(String(err));
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 3 }}>
      <Typography component="h1" variant="h2">
        My Tasks
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <ToDoTextArea label={"Add a task to the list"} onAddTask={addTask} />

      {error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <ToDoList onTaskComplete={completeTask} tasks={tasks} />
      )}
    </Container>
  );
}
