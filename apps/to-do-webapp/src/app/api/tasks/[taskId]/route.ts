import { NextResponse } from "next/server";

import { completeTask } from "@/lib/api";

export async function DELETE(
  request: Request,
  context: { params: Promise<Record<string, string>> | Record<string, string> },
) {
  try {
    // In Next.js App Router dynamic API handlers `context.params` may be a Promise.
    // Await it before accessing properties to avoid the sync dynamic APIs error.
    const resolvedParams = await context.params;
    const taskId: string = resolvedParams?.taskId as string;

    const { status } = await completeTask(taskId);
    return new NextResponse(null, { status });
  } catch {
    return NextResponse.json(
      { message: "Error deleting task" },
      { status: 500 },
    );
  }
}
