import OpenAI from "openai";


import { NextResponse } from "next/server";
import createCompleation from "@/utils/openai/createCompleation";
import {systemPrompt} from "@/utils/openai/prompt";

export const maxDuration = 300;
export const dynamic = "force-dynamic";

const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
const openai = new OpenAI({
    apiKey: apiKey,
});

export async function POST(request, response) {
  const { message } = await request.json();
  // console.log("input from request", message.goal);

  // Create the stream
  const compleation = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        //@ts-ignore
        content: [{ type: "text", text: systemPrompt }],
      },
      {
        role: "user",
        //@ts-ignore
        content: [{ type: "text", text: message.goal }],
      },
    ],
    stream: false,
  });

 return new NextResponse(compleation, { status: 201 });
}
