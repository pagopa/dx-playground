import { NextResponse } from "next/server";

import { insertTask } from "@/lib/api";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title } = body;
    const { status, value } = await insertTask(title);
    return NextResponse.json(value, { status });
  } catch {
    return NextResponse.json(
      { message: "Error creating task" },
      { status: 500 },
    );
  }
}
