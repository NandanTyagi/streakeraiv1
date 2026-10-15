import { DomainEvent } from "../../domain/events";
import { replayEvents } from "../../domain/replay";
import { UseCaseContext } from "./context";

export function deleteHistoryMonth(events: DomainEvent[], input: {
  userId: string; goalId: string; month: string; tz: string;
}, ctx: UseCaseContext) {
  const today = ctx.clock.today(input.tz);
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(input.month) || input.month >= today.slice(0, 7)) {
    throw Object.assign(new Error("Only completed history months can be deleted. Use Reset for the current month."), {status: 400});
  }
  const state = replayEvents(events, today);
  if (!state.goals.some(goal => goal.id === input.goalId && goal.userId === input.userId)) {
    throw Object.assign(new Error("Panel not found."), {status: 404});
  }
  const event: DomainEvent = {
    type: "HISTORY_MONTH_DELETED", version: 1, id: ctx.generateId(), userId: input.userId,
    idempotencyKey: `DeleteHistoryMonth:${input.userId}:${input.goalId}:${input.month}:${ctx.generateId()}`,
    payload: {goalId: input.goalId, month: input.month}, createdAt: ctx.clock.now(),
  };
  return {event, state: replayEvents([...events, event], today)};
}
