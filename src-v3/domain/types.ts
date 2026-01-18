export type ID = string;
export type ISODate = string; // YYYY-MM-DD (user timezone normalized)
export type ISODateTime = string; // ISO-8601 timestamp

export interface User {
  id: ID;
  email: string;
  tz: string; // IANA timezone
  name?: string;
  avatarUrl?: string;
  createdAt: ISODateTime;
}

export interface Goal {
  id: ID;
  userId: ID;
  title: string;
  createdAt: ISODateTime;
  archivedAt?: ISODateTime;
}

export interface Habit {
  id: ID;
  goalId: ID;
  name: string;
  target: string;
  order: number;
  createdAt: ISODateTime;
  archivedAt?: ISODateTime;
}

export type DayStateStatus = "done" | "not_done";

export interface DayState {
  habitId: ID;
  date: ISODate;
  status: DayStateStatus;
  note?: string;
  updatedAt: ISODateTime;
}

export interface StreakStats {
  habitId: ID;
  current: number;
  longest: number;
  lastCompletedDate?: ISODate;
  doneCount: number;
  missedCount: number;
}

export interface State {
  goals: Goal[];
  habits: Habit[];
  dayStates: DayState[];
  streaks: StreakStats[];
}

export interface DomainConfig {
  allowReversal: boolean;
  backdateWindowDays: number;
}
