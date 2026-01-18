import { ID, ISODate, ISODateTime } from "./types";

export type EventType =
  | "GOAL_CREATED"
  | "GOAL_UPDATED"
  | "GOAL_ARCHIVED"
  | "GOAL_RESTORED"
  | "HABIT_CREATED"
  | "HABIT_UPDATED"
  | "HABIT_ARCHIVED"
  | "HABIT_RESTORED"
  | "DAY_STATE_UPSERTED"
  | "USER_TIMEZONE_UPDATED";

export type EventVersion = 1;

export interface DomainEventBase<TPayload, TType extends EventType> {
  type: TType;
  version: EventVersion;
  id: ID;
  userId: ID;
  idempotencyKey: string;
  payload: TPayload;
  createdAt: ISODateTime;
}

export type GoalCreatedPayload = {
  goalId: ID;
  title: string;
};

export type GoalUpdatedPayload = {
  goalId: ID;
  title: string;
};

export type GoalArchivedPayload = {
  goalId: ID;
  archivedAt: ISODateTime;
};

export type GoalRestoredPayload = {
  goalId: ID;
  restoredAt: ISODateTime;
};

export type HabitCreatedPayload = {
  habitId: ID;
  goalId: ID;
  name: string;
  target: string;
  order: number;
};

export type HabitUpdatedPayload = {
  habitId: ID;
  name?: string;
  target?: string;
  order?: number;
};

export type HabitArchivedPayload = {
  habitId: ID;
  archivedAt: ISODateTime;
};

export type HabitRestoredPayload = {
  habitId: ID;
  restoredAt: ISODateTime;
};

export type DayStateUpsertedPayload = {
  habitId: ID;
  date: ISODate;
  status: "done" | "not_done";
  note?: string;
};

export type UserTimezoneUpdatedPayload = {
  tz: string;
  updatedAt: ISODateTime;
};

export type GoalCreatedEvent = DomainEventBase<GoalCreatedPayload, "GOAL_CREATED">;
export type GoalUpdatedEvent = DomainEventBase<GoalUpdatedPayload, "GOAL_UPDATED">;
export type GoalArchivedEvent = DomainEventBase<GoalArchivedPayload, "GOAL_ARCHIVED">;
export type GoalRestoredEvent = DomainEventBase<GoalRestoredPayload, "GOAL_RESTORED">;
export type HabitCreatedEvent = DomainEventBase<HabitCreatedPayload, "HABIT_CREATED">;
export type HabitUpdatedEvent = DomainEventBase<HabitUpdatedPayload, "HABIT_UPDATED">;
export type HabitArchivedEvent = DomainEventBase<HabitArchivedPayload, "HABIT_ARCHIVED">;
export type HabitRestoredEvent = DomainEventBase<HabitRestoredPayload, "HABIT_RESTORED">;
export type DayStateUpsertedEvent = DomainEventBase<DayStateUpsertedPayload, "DAY_STATE_UPSERTED">;
export type UserTimezoneUpdatedEvent = DomainEventBase<UserTimezoneUpdatedPayload, "USER_TIMEZONE_UPDATED">;

export type DomainEvent =
  | GoalCreatedEvent
  | GoalUpdatedEvent
  | GoalArchivedEvent
  | GoalRestoredEvent
  | HabitCreatedEvent
  | HabitUpdatedEvent
  | HabitArchivedEvent
  | HabitRestoredEvent
  | DayStateUpsertedEvent
  | UserTimezoneUpdatedEvent;
