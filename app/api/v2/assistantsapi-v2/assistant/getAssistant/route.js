import { NextResponse } from "next/server";
import { getAssistant } from "@/utils/openai-v2/openAiFunctions";

export async function GET(req) {
  try {
    const assistant = await getAssistant();

    return NextResponse.json({ assistant });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
