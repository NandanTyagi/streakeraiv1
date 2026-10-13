import { createGoal } from "./create-goal";
import { createHabit } from "./create-habit";
import { State } from "../../domain/types";
import { UseCaseContext } from "./context";
export function createPanel(state: State, input: { userId: string; tz: string; draftId: string; title: string; habits: {name:string;target:string}[] }, ctx: UseCaseContext) {
  let result = createGoal(state, { ...input, idempotencyKey: `CreatePanel:${input.userId}:${input.draftId}` }, ctx);
  const goal = result.state.goals.at(-1)!;
  const events = [...result.events];
  input.habits.forEach((habit, order) => {
    result = createHabit(result.state, { ...habit, userId: input.userId, tz: input.tz, goalId: goal.id, order, idempotencyKey: `CreatePanel:${input.userId}:${input.draftId}:${order}` }, ctx);
    events.push(...result.events);
  });
  return { ...result, events, goalId: goal.id, projections: { ...result.projections, history: { events } } };
}
