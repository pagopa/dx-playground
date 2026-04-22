"use client";

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";

import { completeTask, getTask } from "@/lib/api";
import { TaskId } from "@/lib/client/TaskId";
import { TaskItem } from "@/lib/client/TaskItem";

interface TaskDetailsDialogProps {
  onClose: () => void;
  onComplete: (id: TaskId) => void;
  open: boolean;
  taskId: null | TaskId;
}

type TaskState = TaskItem["state"];

const stateColor: Record<
  TaskState,
  "default" | "error" | "success" | "warning"
> = {
  COMPLETED: "success",
  DELETED: "error",
  INCOMPLETE: "warning",
};

const stateLabel: Record<TaskState, string> = {
  COMPLETED: "Completed",
  DELETED: "Deleted",
  INCOMPLETE: "In progress",
};

const TaskDetailsDialog: React.FC<TaskDetailsDialogProps> = ({
  onClose,
  onComplete,
  open,
  taskId,
}) => {
  const [task, setTask] = useState<null | TaskItem>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    if (!open || !taskId) {
      return;
    }

    let cancelled = false;
    const fetchTask = async () => {
      setLoading(true);
      setError(null);
      setTask(null);
      try {
        const { status, value } = await getTask(taskId);
        if (cancelled) {
          return;
        }
        if (status === 200) {
          setTask(value);
        } else {
          setError("Failed to load task details. Please try again later.");
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_err) {
        if (!cancelled) {
          setError("Failed to load task details. Please try again later.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchTask();

    return () => {
      cancelled = true;
    };
  }, [open, taskId]);

  const handleClose = () => {
    setTask(null);
    setError(null);
    setLoading(false);
    setCompleting(false);
    onClose();
  };

  const handleComplete = async () => {
    if (!task) {
      return;
    }
    setCompleting(true);
    try {
      const { status } = await completeTask(task.id);
      if (status === 204) {
        onComplete(task.id);
        handleClose();
      } else {
        setError("Failed to complete the task. Please try again later.");
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_err) {
      setError("Failed to complete the task. Please try again later.");
    } finally {
      setCompleting(false);
    }
  };

  return (
    <Dialog fullWidth maxWidth="sm" onClose={handleClose} open={open}>
      <DialogTitle>{task ? task.title : "Task details"}</DialogTitle>
      <DialogContent dividers>
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
            <CircularProgress />
          </Box>
        )}
        {error && !loading && <Alert severity="error">{error}</Alert>}
        {!loading && !error && task && (
          <Stack spacing={2}>
            <Box>
              <Typography color="text.secondary" variant="overline">
                Title
              </Typography>
              <Typography variant="body1">{task.title}</Typography>
            </Box>
            <Box>
              <Typography color="text.secondary" variant="overline">
                Status
              </Typography>
              <Box>
                <Chip
                  color={stateColor[task.state]}
                  label={stateLabel[task.state]}
                  size="small"
                />
              </Box>
            </Box>
            <Box>
              <Typography color="text.secondary" variant="overline">
                Identifier
              </Typography>
              <Typography
                sx={{ fontFamily: "monospace", wordBreak: "break-all" }}
                variant="body2"
              >
                {task.id}
              </Typography>
            </Box>
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Button disabled={completing} onClick={handleClose}>
          Close
        </Button>
        {task && task.state === "INCOMPLETE" && (
          <Button
            disabled={completing || loading}
            onClick={handleComplete}
            variant="contained"
          >
            {completing ? "Completing..." : "Mark as complete"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default TaskDetailsDialog;
