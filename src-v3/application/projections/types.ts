import { DomainEvent } from "../../domain/events";
import { DayState, Goal, Habit, ISODate, StreakStats } from "../../domain/types";

export type DashboardView = {
  goals: Goal[];
  habits: Habit[];
  streaks: StreakStats[];
};

export type MonthlyGridCell = {
  habitId: string;
  date: ISODate;
  status: "done" | "missed" | "unreviewed";
  note?: string;
};

export type MonthlyGridView = {
  month: string; // YYYY-MM
  cells: MonthlyGridCell[];
};

export type HistoryTimeline = {
  events: DomainEvent[];
};

export type GoalGraph = {
  goals: Goal[];
  habits: Habit[];
};

export type AIGroundingContext = {
  events: DomainEvent[];
  streakStats: StreakStats[];
  recentDayStates: DayState[];
  goalGraph: GoalGraph;
};
