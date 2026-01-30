import TasksClient from "@/components/TasksClient";
import { getTaskList } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { status, value: taskList } = await getTaskList();
  const initialTasks = status === 200 ? taskList : [];

  return <TasksClient initialTasks={initialTasks} />;
}
