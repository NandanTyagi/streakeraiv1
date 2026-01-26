import { Configuration, OpenAIApi } from "openai-edge";
import { systemPrompt } from "@/utils/openai/prompt";

export const runtime = "edge";
export const maxDuration = 300;
export const dynamic = "force-dynamic";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function POST(request: Request) {
  const { message } = await request.json();
  // console.log("input from request", message.goal);

  // Create the stream
  const response = await openai.createChatCompletion({
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
    stream: true,
  });

  // Pass through the OpenAI SSE stream directly so EventSource can consume it.
  return new Response(response.body, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
