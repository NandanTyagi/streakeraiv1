import { DomainEvent } from "../../domain/events";
import { DayState, ISODate, State } from "../../domain/types";
import { addDays } from "../../domain/date";
import {
  AIGroundingContext,
  DashboardView,
  HistoryTimeline,
  MonthlyGridCell,
  MonthlyGridView,
} from "./types";

export function buildDashboardView(state: State): DashboardView {
  return {
    goals: state.goals,
    habits: state.habits,
    streaks: state.streaks,
  };
}

export function buildMonthlyGridView(state: State, month: string, today: ISODate): MonthlyGridView {
  const cells: MonthlyGridCell[] = [];
  const dates = listDatesInMonth(month);
  for (const habit of state.habits) {
    const archivedDate = habit.archivedAt ? habit.archivedAt.slice(0, 10) : undefined;
    for (const date of dates) {
      if (archivedDate && date >= archivedDate) {
        continue;
      }
      const dayState = state.dayStates.find((ds) => ds.habitId === habit.id && ds.date === date);
      if (dayState) {
        cells.push({
          habitId: habit.id,
          date,
          status: dayState.status === "done" ? "done" : "missed",
          note: dayState.note,
        });
      } else {
        cells.push({
          habitId: habit.id,
          date,
          status: date <= today ? "unreviewed" : "unreviewed",
        });
      }
    }
  }
  return { month, cells };
}

export function buildHistoryTimeline(events: DomainEvent[]): HistoryTimeline {
  return { events };
}

export function buildAIGroundingContext(
  state: State,
  events: DomainEvent[],
  recentDays: number,
  today: ISODate
): AIGroundingContext {
  const start = addDays(today, -recentDays);
  const recentDayStates = state.dayStates.filter((ds) => ds.date >= start && ds.date <= today);
  return {
    events,
    streakStats: state.streaks,
    recentDayStates,
    goalGraph: {
      goals: state.goals,
      habits: state.habits,
    },
  };
}

function listDatesInMonth(month: string): ISODate[] {
  const [yearStr, monthStr] = month.split("-");
  const year = Number(yearStr);
  const monthIndex = Number(monthStr) - 1;
  const first = new Date(Date.UTC(year, monthIndex, 1));
  const dates: ISODate[] = [];
  let cursor = first;
  while (cursor.getUTCMonth() === monthIndex) {
    const date = cursor.toISOString().slice(0, 10);
    dates.push(date);
    cursor = new Date(cursor.getTime() + 24 * 60 * 60 * 1000);
  }
  return dates;
}
