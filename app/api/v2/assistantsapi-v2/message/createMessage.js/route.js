import { NextResponse } from "next/server";
import { createMessage } from "@/utils/openai-v2/openAiFunctions";

export async function POST(req) {
  console.log("createMessage req", req);
  const { threadId, message } = await req.body;
  try {
    const messages = await createMessage(threadId, message);

    return NextResponse.json({ assistant: messages });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}