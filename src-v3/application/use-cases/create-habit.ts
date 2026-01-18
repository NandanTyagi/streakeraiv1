import { DomainEvent } from "../../domain/events";
import { applyEvent } from "../../domain/replay";
import { computeAllStreaks } from "../../domain/streaks";
import { findGoal } from "../../domain/invariants";
import { State } from "../../domain/types";
import { buildDashboardView, buildHistoryTimeline, buildMonthlyGridView } from "../projections/builders";
import { UseCaseContext } from "./context";
import { UseCaseResult } from "./types";

export type CreateHabitInput = {
  userId: string;
  tz: string;
  goalId: string;
  name: string;
  target: string;
  order: number;
  idempotencyKey: string;
};

export function createHabit(state: State, input: CreateHabitInput, ctx: UseCaseContext): UseCaseResult {
  const now = ctx.clock.now();
  const today = ctx.clock.today(input.tz);

  const goal = findGoal(state.goals, input.goalId);
  if (!goal || goal.archivedAt) {
    throw new Error("Goal does not exist or is archived.");
  }

  const habitId = ctx.generateId();
  const event: DomainEvent = {
    type: "HABIT_CREATED",
    version: 1,
    id: ctx.generateId(),
    userId: input.userId,
    idempotencyKey: input.idempotencyKey,
    payload: {
      habitId,
      goalId: input.goalId,
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
