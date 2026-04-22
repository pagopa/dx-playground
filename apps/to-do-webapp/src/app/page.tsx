"use client";

import { Alert, Container, Divider, Typography } from "@mui/material";
import { useEffect, useState } from "react";

import TaskDetailsDialog from "@/components/TaskDetailsDialog";
import ToDoList from "@/components/ToDoList";
import ToDoTextArea from "@/components/ToDoTextArea";
import { getTaskList } from "@/lib/api";
import { TaskId } from "@/lib/client/TaskId";
import { TaskItem } from "@/lib/client/TaskItem";
import { TaskItemList } from "@/lib/client/TaskItemList";
export const dynamic = "force-dynamic";

export default function Home() {
  const [tasks, setTasks] = useState<TaskItemList>([]);
  const [error, setError] = useState<null | string>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<null | TaskId>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { status, value: taskList } = await getTaskList();
        if (status === 200) {
          setError(null);
          setTasks(taskList);
        } else {
          setError("Failed to fetch tasks. Please try again later.");
          setTasks([]);
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setError("Failed to fetch tasks. Please try again later.");
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

      {error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <ToDoList
          onTaskComplete={completeTask}
          onTaskSelect={setSelectedTaskId}
          tasks={tasks}
        />
      )}

      <TaskDetailsDialog
        onClose={() => setSelectedTaskId(null)}
        onComplete={completeTask}
        open={selectedTaskId !== null}
        taskId={selectedTaskId}
      />
    </Container>
  );
}
