import OpenAI from "openai";
import { systemPrompt } from "@/utils/openai/prompt";

const apiKey = process.env.NEXT_PUBLIC_AI_API_KEY;
async function createCompleation(input) {
  const openai = new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true,
  });
  const compleation = await openai.chat.completions.create({
    model: "gpt-4-1106-preview",
    messages: [
      {
        role: "system",
        //@ts-ignore
        content: [{ type: "text", text: systemPrompt }],
      },
      {
        role: "user",
        //@ts-ignore
        content: [{ type: "text", text: input.goal }],
      },
    ],
  });
  console.log(
    "******************>>>>>>>*>*",
    compleation.choices[0].message.content
  );
  return compleation.choices[0].message.content;
}

export default createCompleation;
