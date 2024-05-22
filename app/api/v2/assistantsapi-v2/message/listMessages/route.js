import { NextResponse } from "next/server";
import { listMessages } from "@/utils/openai-v2/openAiFunctions";

export async function POST(req) {
//   console.log("listMessages route************************* req", await req.json());
  const formData = await req.json();
    const threadId = formData.threadId;
  try {
    const messages = await listMessages(threadId);

    return NextResponse.json({ messages });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}