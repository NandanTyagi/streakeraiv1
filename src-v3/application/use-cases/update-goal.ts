import { DomainEvent } from "../../domain/events";
import { applyEvent } from "../../domain/replay";
import { computeAllStreaks } from "../../domain/streaks";
import { findGoal } from "../../domain/invariants";
import { State } from "../../domain/types";
import { buildDashboardView, buildHistoryTimeline, buildMonthlyGridView } from "../projections/builders";
import { UseCaseContext } from "./context";
import { UseCaseResult } from "./types";

export type UpdateGoalInput = {
  userId: string;
  tz: string;
  goalId: string;
  title: string;
  idempotencyKey: string;
};

export function updateGoal(state: State, input: UpdateGoalInput, ctx: UseCaseContext): UseCaseResult {
  const now = ctx.clock.now();
  const today = ctx.clock.today(input.tz);

  const goal = findGoal(state.goals, input.goalId);
  if (!goal) {
    throw new Error("Goal not found.");
  }

  const event: DomainEvent = {
    type: "GOAL_UPDATED",
    version: 1,
    id: ctx.generateId(),
    userId: input.userId,
    idempotencyKey: input.idempotencyKey,
    payload: {
      goalId: input.goalId,
      title: input.title,
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
