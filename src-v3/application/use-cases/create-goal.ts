import { DomainEvent } from "../../domain/events";
import { applyEvent } from "../../domain/replay";
import { computeAllStreaks } from "../../domain/streaks";
import { State } from "../../domain/types";
import { validateGoalTitleUnique } from "../../domain/invariants";
import { buildDashboardView, buildHistoryTimeline, buildMonthlyGridView } from "../projections/builders";
import { UseCaseResult } from "./types";
import { UseCaseContext } from "./context";

export type CreateGoalInput = {
  userId: string;
  tz: string;
  title: string;
  idempotencyKey: string;
};

export function createGoal(state: State, input: CreateGoalInput, ctx: UseCaseContext): UseCaseResult {
  const now = ctx.clock.now();
  const today = ctx.clock.today(input.tz);

  const titleCheck = validateGoalTitleUnique(state.goals, input.userId, input.title);
  if (!titleCheck.ok) {
    throw new Error(titleCheck.error.message);
  }

  const goalId = ctx.generateId();
  const event: DomainEvent = {
    type: "GOAL_CREATED",
    version: 1,
    id: ctx.generateId(),
    userId: input.userId,
    idempotencyKey: input.idempotencyKey,
    payload: { goalId, title: input.title },
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
