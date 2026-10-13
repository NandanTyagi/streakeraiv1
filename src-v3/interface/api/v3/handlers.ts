import {
  archiveHabit,
  createGoal,
  createHabit,
  generateDailyReflection,
  generateWeeklyReflection,
  restoreHabit,
  updateGoal,
  updateHabit,
  upsertDayStateUseCase,
} from "../../../application/use-cases";
import { buildDashboardView, buildHistoryTimeline, buildMonthlyGridView } from "../../../application/projections/builders";
import { AIProvider, EventStore, ProjectionRepository } from "../../../application/ports";
import { UseCaseContext } from "../../../application/use-cases/context";
import { replayEvents } from "../../../domain/replay";
import { DomainEvent } from "../../../domain/events";
import { State } from "../../../domain/types";

export type HandlerDeps = {
  eventStore: EventStore;
  projectionRepo: ProjectionRepository;
  aiProvider: AIProvider;
  ctx: UseCaseContext;
};

export type CreateGoalRequest = {
  userId: string;
  tz: string;
  title: string;
};

export type CreateHabitRequest = {
  userId: string;
  tz: string;
  goalId: string;
  name: string;
  target: string;
  order: number;
};

export type UpdateGoalRequest = {
  userId: string;
  tz: string;
  goalId: string;
  title: string;
};

export type UpdateHabitRequest = {
  userId: string;
  tz: string;
  habitId: string;
  name?: string;
  target?: string;
  order?: number;
};

export type UpsertDayStateRequest = {
  userId: string;
  tz: string;
  habitId: string;
  status: "done" | "not_done";
  note?: string;
  date?: string;
  timestamp?: string;
};

export type ArchiveHabitRequest = {
  userId: string;
  tz: string;
  habitId: string;
};

export type RestoreHabitRequest = {
  userId: string;
  tz: string;
  habitId: string;
};

export type ReadRequest = {
  userId: string;
  tz: string;
  month?: string;
};

export type DailyReflectionRequest = {
  userId: string;
  tz: string;
  date: string;
};

export type WeeklyReflectionRequest = {
  userId: string;
  tz: string;
  weekEnding: string;
};

export async function createGoalHandler(input: CreateGoalRequest, deps: HandlerDeps) {
  const { state, events } = await loadState(input.userId, input.tz, deps);
  const result = createGoal(state, {
    userId: input.userId,
    tz: input.tz,
    title: input.title,
    idempotencyKey: idempotencyKey(["CreateGoal", input.userId, input.title]),
  }, deps.ctx);
  await persistResult(input.userId, result.state, result.events, result.projections, deps);
  return result;
}

export async function createHabitHandler(input: CreateHabitRequest, deps: HandlerDeps) {
  const { state } = await loadState(input.userId, input.tz, deps);
  const result = createHabit(state, {
    userId: input.userId,
    tz: input.tz,
    goalId: input.goalId,
    name: input.name,
    target: input.target,
    order: input.order,
    idempotencyKey: idempotencyKey(["CreateHabit", input.userId, input.goalId, input.name, input.target, input.order]),
  }, deps.ctx);
  await persistResult(input.userId, result.state, result.events, result.projections, deps);
  return result;
}

export async function updateGoalHandler(input: UpdateGoalRequest, deps: HandlerDeps) {
  const { state } = await loadState(input.userId, input.tz, deps);
  const result = updateGoal(
    state,
    {
      userId: input.userId,
      tz: input.tz,
      goalId: input.goalId,
      title: input.title,
      idempotencyKey: idempotencyKey(["UpdateGoal", input.userId, input.goalId, input.title]),
    },
    deps.ctx
  );
  await persistResult(input.userId, result.state, result.events, result.projections, deps);
  return result;
}

export async function updateHabitHandler(input: UpdateHabitRequest, deps: HandlerDeps) {
  const { state } = await loadState(input.userId, input.tz, deps);
  const result = updateHabit(
    state,
    {
      userId: input.userId,
      tz: input.tz,
      habitId: input.habitId,
      name: input.name,
      target: input.target,
      order: input.order,
      idempotencyKey: idempotencyKey([
        "UpdateHabit",
        input.userId,
        input.habitId,
        input.name,
        input.target,
        input.order,
      ]),
    },
    deps.ctx
  );
  await persistResult(input.userId, result.state, result.events, result.projections, deps);
  return result;
}

export async function upsertDayStateHandler(input: UpsertDayStateRequest, deps: HandlerDeps) {
  const { state } = await loadState(input.userId, input.tz, deps);
  const dateKey = input.date || deps.ctx.timezoneService.toDateKey(input.timestamp || deps.ctx.clock.now(), input.tz);
  const result = upsertDayStateUseCase(state, {
    userId: input.userId,
    tz: input.tz,
    habitId: input.habitId,
    date: dateKey,
    status: input.status,
    note: input.note,
    idempotencyKey: idempotencyKey(["UpsertDayState", input.userId, input.habitId, dateKey, input.status, input.note]),
  }, deps.ctx);
  await persistResult(input.userId, result.state, result.events, result.projections, deps);
  return result;
}

export async function archiveHabitHandler(input: ArchiveHabitRequest, deps: HandlerDeps) {
  const { state } = await loadState(input.userId, input.tz, deps);
  const result = archiveHabit(state, {
    userId: input.userId,
    tz: input.tz,
    habitId: input.habitId,
    idempotencyKey: idempotencyKey(["ArchiveHabit", input.userId, input.habitId]),
  }, deps.ctx);
  await persistResult(input.userId, result.state, result.events, result.projections, deps);
  return result;
}

export async function restoreHabitHandler(input: RestoreHabitRequest, deps: HandlerDeps) {
  const { state } = await loadState(input.userId, input.tz, deps);
  const result = restoreHabit(state, {
    userId: input.userId,
    tz: input.tz,
    habitId: input.habitId,
    idempotencyKey: idempotencyKey(["RestoreHabit", input.userId, input.habitId]),
  }, deps.ctx);
  await persistResult(input.userId, result.state, result.events, result.projections, deps);
  return result;
}

export async function getGoalsHandler(input: ReadRequest, deps: HandlerDeps) {
  const { state } = await loadState(input.userId, input.tz, deps);
  return state.goals;
}

export async function getHabitsHandler(input: ReadRequest, deps: HandlerDeps) {
  const { state } = await loadState(input.userId, input.tz, deps);
  return state.habits;
}

export async function getDayStatesHandler(input: ReadRequest, deps: HandlerDeps) {
  const { state } = await loadState(input.userId, input.tz, deps);
  const month = input.month || deps.ctx.clock.today(input.tz).slice(0, 7);
  return buildMonthlyGridView(state, month, deps.ctx.clock.today(input.tz));
}

export async function getStreaksHandler(input: ReadRequest, deps: HandlerDeps) {
  const { state } = await loadState(input.userId, input.tz, deps);
  return state.streaks;
}

export async function getHistoryHandler(input: ReadRequest, deps: HandlerDeps) {
  const events = await deps.eventStore.listByUser(input.userId);
  return buildHistoryTimeline(events);
}

export async function generateDailyReflectionHandler(input: DailyReflectionRequest, deps: HandlerDeps) {
  const events = await deps.eventStore.listByUser(input.userId);
  const state = replayEvents(events, deps.ctx.clock.today(input.tz));
  const result = await generateDailyReflection(
    state,
    { userId: input.userId, tz: input.tz, date: input.date, events },
    deps.ctx,
    deps.aiProvider
  );
  if (result.projections.aiContext) {
    await deps.projectionRepo.saveAIContext(input.userId, result.projections.aiContext);
  }
  return result;
}

export async function generateWeeklyReflectionHandler(input: WeeklyReflectionRequest, deps: HandlerDeps) {
  const events = await deps.eventStore.listByUser(input.userId);
  const state = replayEvents(events, deps.ctx.clock.today(input.tz));
  const result = await generateWeeklyReflection(
    state,
    { userId: input.userId, tz: input.tz, weekEnding: input.weekEnding, events },
    deps.ctx,
    deps.aiProvider
  );
  if (result.projections.aiContext) {
    await deps.projectionRepo.saveAIContext(input.userId, result.projections.aiContext);
  }
  return result;
}

async function loadState(userId: string, tz: string, deps: HandlerDeps): Promise<{ state: State; events: DomainEvent[] }> {
  const events = await deps.eventStore.listByUser(userId);
  const state = replayEvents(events, deps.ctx.clock.today(tz));
  return { state, events };
}

async function persistResult(
  userId: string,
  state: State,
  events: DomainEvent[],
  projections: { dashboard?: unknown; monthlyGrid?: unknown; history?: unknown },
  deps: HandlerDeps
) {
  await deps.eventStore.append(events);
  await deps.projectionRepo.saveState(userId, state);
  if (projections.dashboard) {
    await deps.projectionRepo.saveDashboard(userId, projections.dashboard as any);
  }
  if (projections.monthlyGrid) {
    await deps.projectionRepo.saveMonthlyGrid(userId, projections.monthlyGrid as any);
  }
  if (projections.history) {
    await deps.projectionRepo.saveHistory(userId, projections.history as any);
  }
}

function idempotencyKey(parts: Array<string | number | undefined>): string {
  return parts.filter((part) => part !== undefined).join(":");
}
