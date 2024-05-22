import { NextResponse } from "next/server";
import { createMessage } from "@/utils/openai-v2/openAiFunctions";

export async function POST(req) {
  console.log("createMessageNew************************* req", req.body);
  const formData = await req.json();
    const threadId = formData.threadId;
    const content = formData.content;
  try {
    const messages = await createMessage(threadId, content);

    return NextResponse.json({ messages });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}