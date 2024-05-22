import { NextResponse } from "next/server";
import { createThread } from "@/utils/openai-v2/openAiFunctions";

export const maxDuration = 300;
export const dynamic = 'force-dynamic';

export async function GET(req) {
  console.log("createThread req", req);
  try {
    const newThread = await createThread();

    return NextResponse.json({ newThread: newThread });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}