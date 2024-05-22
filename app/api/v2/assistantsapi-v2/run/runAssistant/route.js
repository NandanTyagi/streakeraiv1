import { NextResponse } from "next/server";
import { runAssistant } from "@/utils/openai-v2/openAiFunctions";

export async function POST(req) {
  console.log("Run Assistant with thread req", req);
  const result = await req.json();
    const threadId = result.threadId;
  try {
    const messages = await runAssistant(threadId);

    return NextResponse.json({ runAssistantResult: messages });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}