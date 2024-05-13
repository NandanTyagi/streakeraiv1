import { OpenAI } from "openai";
import { systemPrompt } from "@/utils/openai/prompt";
import * as dotenv from "dotenv";

async function createCompleation(input) {
  dotenv.config();
  const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    organization: process.env.OPENAI_API_STREAKER_AI_ORG_ID,
    project: process.env.OPENAI_API_PROJECT_ID,
    dangerouslyAllowBrowser: true
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
