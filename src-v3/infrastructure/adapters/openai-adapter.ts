import OpenAI from "openai";
import { AIProvider, AIReflection } from "../../application/ports";
import { AIGroundingContext } from "../../application/projections/types";

export class OpenAIAdapter implements AIProvider {
  private readonly client: OpenAI;
  private readonly model: string;

  constructor(apiKey: string, model = "gpt-4o-mini") {
    this.client = new OpenAI({ apiKey });
    this.model = model;
  }

  async generateDailyReflection(context: AIGroundingContext): Promise<AIReflection> {
    return this.generateReflection("Daily reflection", context);
  }

  async generateWeeklyReflection(context: AIGroundingContext): Promise<AIReflection> {
    return this.generateReflection("Weekly reflection", context);
  }

  private async generateReflection(title: string, context: AIGroundingContext): Promise<AIReflection> {
    const prompt = `${title} grounded in event data:\n${JSON.stringify(context)}`;
    const start = Date.now();
    const completion = await this.client.chat.completions.create({
      model: this.model,
      messages: [{ role: "user", content: prompt }],
    });
    const end = Date.now();

    const response = completion.choices[0]?.message?.content || "";
    return {
      prompt,
      response,
      model: this.model,
      tokensIn: completion.usage?.prompt_tokens,
      tokensOut: completion.usage?.completion_tokens,
      latencyMs: end - start,
    };
  }
}
