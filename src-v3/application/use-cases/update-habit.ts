import { DomainEvent } from "../../domain/events";
import { applyEvent } from "../../domain/replay";
import { computeAllStreaks } from "../../domain/streaks";
import { findHabit } from "../../domain/invariants";
import { State } from "../../domain/types";
import { buildDashboardView, buildHistoryTimeline, buildMonthlyGridView } from "../projections/builders";
import { UseCaseContext } from "./context";
import { UseCaseResult } from "./types";

export type UpdateHabitInput = {
  userId: string;
  tz: string;
  habitId: string;
  name?: string;
  target?: string;
  order?: number;
  idempotencyKey: string;
};

export function updateHabit(state: State, input: UpdateHabitInput, ctx: UseCaseContext): UseCaseResult {
  const now = ctx.clock.now();
  const today = ctx.clock.today(input.tz);

  const habit = findHabit(state.habits, input.habitId);
  if (!habit) {
    throw new Error("Habit not found.");
  }

  const event: DomainEvent = {
    type: "HABIT_UPDATED",
    version: 1,
    id: ctx.generateId(),
    userId: input.userId,
    idempotencyKey: input.idempotencyKey,
    payload: {
      habitId: input.habitId,
      name: input.name,
      target: input.target,
      order: input.order,
    },
    createdAt: now,
  };

  const next = applyEvent(state, event);
  const streaks = computeAllStreaks(next.dayStates, today);
  const nextState = { ...next, streaks };

  return {
    events: [event],
    state: nextState,
    projections: {
      dashboard: buildDashboardView(nextState),
      monthlyGrid: buildMonthlyGridView(nextState, today.slice(0, 7), today),
      history: buildHistoryTimeline([event]),
    },
  };
}
