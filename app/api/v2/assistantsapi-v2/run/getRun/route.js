import { NextResponse } from "next/server";
import { getRun } from "@/utils/openai-v2/openAiFunctions";

export const maxDuration = 300;
export const dynamic = 'force-dynamic';

export async function POST(req) {
  console.log("Get run route req", req);
  const result = await req.json();
    const threadId = result.threadId;
    const runId = result.runId;
  try {
    const messages = await getRun(threadId, runId);

    return NextResponse.json({ getRunResult: messages });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}