import { DayState, DayStateStatus, DomainConfig, ISODate } from "./types";
import { addDays, isAfter, isBefore } from "./date";
import { ValidationResult, fail, ok } from "./validation";

export interface DayStateUpsertInput {
  habitId: string;
  date: ISODate;
  status: DayStateStatus;
  note?: string;
  today: ISODate;
  existing?: DayState;
  habitArchivedDate?: ISODate;
  config: DomainConfig;
}

export function validateDayStateUpsert(input: DayStateUpsertInput): ValidationResult {
  if (isAfter(input.date, input.today)) {
    return fail("FUTURE_DATE_FORBIDDEN", "DayState cannot be written for a future date.");
  }

  const backdateLimit = subtractDays(input.today, input.config.backdateWindowDays);
  if (isBefore(input.date, backdateLimit)) {
    return fail("BACKDATE_WINDOW_EXCEEDED", "DayState is older than backdate window.");
  }

  if (input.habitArchivedDate && !isBefore(input.date, input.habitArchivedDate)) {
    return fail("HABIT_ARCHIVED", "DayState cannot be written after habit is archived.");
  }

  if (input.existing && input.existing.status !== input.status && !input.config.allowReversal) {
    return fail("REVERSAL_FORBIDDEN", "Changing DayState status is not allowed.");
  }

  return ok();
}

export interface DayStateUpsertResult {
  dayStates: DayState[];
  changed: boolean;
}

export function upsertDayState(
  dayStates: DayState[],
  input: Omit<DayStateUpsertInput, "existing"> & { updatedAt: string }
): DayStateUpsertResult {
  const idx = dayStates.findIndex(
    (state) => state.habitId === input.habitId && state.date === input.date
  );

  if (idx === -1) {
    return {
      dayStates: [
        ...dayStates,
        {
          habitId: input.habitId,
          date: input.date,
          status: input.status,
          note: input.note,
          updatedAt: input.updatedAt,
        },
      ],
      changed: true,
    };
  }

  const existing = dayStates[idx];
  const next: DayState = {
    ...existing,
    status: input.status,
    note: input.note,
    updatedAt: input.updatedAt,
  };

  const changed =
    existing.status !== next.status || existing.note !== next.note || existing.updatedAt !== next.updatedAt;

  if (!changed) {
    return { dayStates, changed: false };
  }

  const updated = dayStates.slice();
  updated[idx] = next;
  return { dayStates: updated, changed: true };
}

function subtractDays(date: ISODate, days: number): ISODate {
  return addDays(date, -days);
}
