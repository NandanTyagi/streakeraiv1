import { DayState, ISODate, StreakStats } from "./types";
import { addDays, isNextDay } from "./date";

export function computeStreakForHabit(dayStates: DayState[], today: ISODate): StreakStats {
  const sorted = [...dayStates].sort((a, b) => (a.date < b.date ? -1 : 1));
  const doneDates = sorted.filter((s) => s.status === "done").map((s) => s.date);

  let longest = 0;
  let currentRun = 0;
  let lastDate: ISODate | null = null;

  for (const date of doneDates) {
    if (!lastDate || isNextDay(lastDate, date)) {
      currentRun += 1;
    } else {
      longest = Math.max(longest, currentRun);
      currentRun = 1;
    }
    lastDate = date;
  }
  longest = Math.max(longest, currentRun);

  const doneCount = sorted.filter((s) => s.status === "done").length;
  const missedCount = sorted.filter((s) => s.status === "not_done").length;
  const lastCompletedDate = doneDates.length > 0 ? doneDates[doneDates.length - 1] : undefined;

  const current = computeCurrentStreak(doneDates, today);

  return {
    habitId: dayStates[0]?.habitId || "",
    current,
    longest,
    lastCompletedDate,
    doneCount,
    missedCount,
  };
}

export function computeAllStreaks(dayStates: DayState[], today: ISODate): StreakStats[] {
  const byHabit = new Map<string, DayState[]>();
  for (const state of dayStates) {
    const list = byHabit.get(state.habitId) || [];
    list.push(state);
    byHabit.set(state.habitId, list);
  }
  return Array.from(byHabit.values()).map((states) => computeStreakForHabit(states, today));
}

function computeCurrentStreak(doneDates: ISODate[], today: ISODate): number {
  if (!doneDates.includes(today)) {
    return 0;
  }

  let count = 0;
  let cursor = today;
  const doneSet = new Set(doneDates);
  while (doneSet.has(cursor)) {
    count += 1;
    cursor = addDays(cursor, -1);
  }
  return count;
}
