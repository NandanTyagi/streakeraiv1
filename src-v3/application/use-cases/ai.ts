import { DomainEvent } from "../../domain/events";
import { State } from "../../domain/types";
import { AIGroundingContext } from "../projections/types";
import { buildAIGroundingContext } from "../projections/builders";
import { AIProvider } from "../ports";
import { UseCaseContext } from "./context";

export type AIUseCaseResult = {
  events: DomainEvent[];
  state: State;
  projections: {
    aiContext?: AIGroundingContext;
  };
  aiOutput?: {
    prompt: string;
    response: string;
    model: string;
    tokensIn?: number;
    tokensOut?: number;
    latencyMs?: number;
  };
};

export type GenerateDailyReflectionInput = {
  userId: string;
  tz: string;
  date: string;
  events: DomainEvent[];
};

export type GenerateWeeklyReflectionInput = {
  userId: string;
  tz: string;
  weekEnding: string;
  events: DomainEvent[];
};

export async function generateDailyReflection(
  state: State,
  input: GenerateDailyReflectionInput,
  ctx: UseCaseContext,
  aiProvider: AIProvider
): Promise<AIUseCaseResult> {
  const today = ctx.clock.today(input.tz);
  const context = buildAIGroundingContext(state, input.events, 1, today);
  const aiOutput = await aiProvider.generateDailyReflection(context);
  return { events: [], state, projections: { aiContext: context }, aiOutput };
}

export async function generateWeeklyReflection(
  state: State,
  input: GenerateWeeklyReflectionInput,
  ctx: UseCaseContext,
  aiProvider: AIProvider
): Promise<AIUseCaseResult> {
  const today = ctx.clock.today(input.tz);
  const context = buildAIGroundingContext(state, input.events, 7, today);
  const aiOutput = await aiProvider.generateWeeklyReflection(context);
  return { events: [], state, projections: { aiContext: context }, aiOutput };
}
