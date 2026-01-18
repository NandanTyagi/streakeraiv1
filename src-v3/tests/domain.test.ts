import assert from "node:assert/strict";
import { validateDayStateUpsert } from "../domain/daystate";
import { computeStreakForHabit } from "../domain/streaks";
import { replayEvents } from "../domain/replay";
import { buildMonthlyGridView } from "../application/projections/builders";
import { DomainEvent } from "../domain/events";
import { State } from "../domain/types";

type TestCase = { name: string; run: () => void };
const tests: TestCase[] = [];

function test(name: string, run: () => void) {
  tests.push({ name, run });
}

test("DayState reversal is forbidden by default", () => {
  const validation = validateDayStateUpsert({
    habitId: "hab_1",
    date: "2025-02-10",
    status: "not_done",
    today: "2025-02-10",
    existing: { habitId: "hab_1", date: "2025-02-10", status: "done", updatedAt: "2025-02-10T00:00:00Z" },
    config: { allowReversal: false, backdateWindowDays: 7 },
  });
  assert.equal(validation.ok, false);
});

test("Streak computation is deterministic", () => {
  const streak = computeStreakForHabit(
    [
      { habitId: "hab_1", date: "2025-02-08", status: "done", updatedAt: "2025-02-08T00:00:00Z" },
      { habitId: "hab_1", date: "2025-02-09", status: "done", updatedAt: "2025-02-09T00:00:00Z" },
      { habitId: "hab_1", date: "2025-02-10", status: "not_done", updatedAt: "2025-02-10T00:00:00Z" },
    ],
    "2025-02-10"
  );
  assert.equal(streak.longest, 2);
  assert.equal(streak.current, 0);
  assert.equal(streak.doneCount, 2);
  assert.equal(streak.missedCount, 1);
});

test("Event replay rebuilds state deterministically", () => {
  const events: DomainEvent[] = [
    {
      type: "GOAL_CREATED",
      version: 1,
      id: "evt_1",
      userId: "usr_1",
      idempotencyKey: "k1",
      payload: { goalId: "goal_1", title: "Fitness" },
      createdAt: "2025-02-01T00:00:00Z",
    },
    {
      type: "HABIT_CREATED",
      version: 1,
      id: "evt_2",
      userId: "usr_1",
      idempotencyKey: "k2",
      payload: { habitId: "hab_1", goalId: "goal_1", name: "Run", target: "5k", order: 0 },
      createdAt: "2025-02-01T00:00:10Z",
    },
    {
      type: "DAY_STATE_UPSERTED",
      version: 1,
      id: "evt_3",
      userId: "usr_1",
      idempotencyKey: "k3",
      payload: { habitId: "hab_1", date: "2025-02-02", status: "done" },
      createdAt: "2025-02-02T00:00:00Z",
    },
  ];
  const state = replayEvents(events, "2025-02-02");
  assert.equal(state.goals.length, 1);
  assert.equal(state.habits.length, 1);
  assert.equal(state.dayStates.length, 1);
});

test("Monthly grid projection derives missed/unreviewed", () => {
  const state: State = {
    goals: [],
    habits: [{ id: "hab_1", goalId: "goal_1", name: "Run", target: "5k", order: 0, createdAt: "2025-02-01T00:00:00Z" }],
    dayStates: [{ habitId: "hab_1", date: "2025-02-02", status: "not_done", updatedAt: "2025-02-02T00:00:00Z" }],
    streaks: [],
  };
  const grid = buildMonthlyGridView(state, "2025-02", "2025-02-03");
  const cell = grid.cells.find((c) => c.habitId === "hab_1" && c.date === "2025-02-02");
  assert.equal(cell?.status, "missed");
});

for (const t of tests) {
  try {
    t.run();
    console.log(`ok - ${t.name}`);
  } catch (error) {
    console.error(`fail - ${t.name}`);
    console.error(error);
    process.exitCode = 1;
  }
}
