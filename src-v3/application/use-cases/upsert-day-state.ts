import { DomainEvent } from "../../domain/events";
import { findHabit } from "../../domain/invariants";
import { selectDayState } from "../../domain/replay";
import { computeAllStreaks } from "../../domain/streaks";
import { State } from "../../domain/types";
import { upsertDayState, validateDayStateUpsert } from "../../domain/daystate";
import { buildDashboardView, buildHistoryTimeline, buildMonthlyGridView } from "../projections/builders";
import { UseCaseContext } from "./context";
import { UseCaseResult } from "./types";

export type UpsertDayStateInput = {
  userId: string;
  tz: string;
  habitId: string;
  date: string;
  status: "done" | "not_done";
  note?: string;
  idempotencyKey: string;
};

export function upsertDayStateUseCase(
  state: State,
  input: UpsertDayStateInput,
  ctx: UseCaseContext
): UseCaseResult {
  const now = ctx.clock.now();
  const today = ctx.clock.today(input.tz);

  const habit = findHabit(state.habits, input.habitId);
  if (!habit) {
    throw new Error("Habit not found.");
  }

  const existing = selectDayState(state.dayStates, input.habitId, input.date);
  const habitArchivedDate = habit.archivedAt
    ? ctx.timezoneService.toDateKey(habit.archivedAt, input.tz)
    : undefined;

  const validation = validateDayStateUpsert({
    habitId: input.habitId,
    date: input.date,
    status: input.status,
    note: input.note,
    today,
    existing,
    habitArchivedDate,
    config: ctx.config,
  });

  if (!validation.ok) {
    throw new Error(validation.error.message);
  }

  const update = upsertDayState(state.dayStates, {
    habitId: input.habitId,
    date: input.date,
    status: input.status,
    note: input.note,
    updatedAt: now,
    today,
    config: ctx.config,
  });

  if (!update.changed) {
    return { events: [], state, projections: {} };
  }

  const event: DomainEvent = {
    type: "DAY_STATE_UPSERTED",
    version: 1,
    id: ctx.generateId(),
    userId: input.userId,
    idempotencyKey: input.idempotencyKey,
    payload: {
      habitId: input.habitId,
      date: input.date,
      status: input.status,
      note: input.note,
    },
    createdAt: now,
  };

  const nextState = {
    ...state,
    dayStates: update.dayStates,
  };
  const streaks = computeAllStreaks(nextState.dayStates, today);
  const finalState = { ...nextState, streaks };

  return {
    events: [event],
    state: finalState,
    projections: {
      dashboard: buildDashboardView(finalState),
      monthlyGrid: buildMonthlyGridView(finalState, input.date.slice(0, 7), today),
      history: buildHistoryTimeline([event]),
    },
  };
}
