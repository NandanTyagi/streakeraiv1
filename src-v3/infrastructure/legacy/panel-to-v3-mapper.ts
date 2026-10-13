import { DomainEvent } from "../../domain/events";
import { ISODate, ISODateTime } from "../../domain/types";
import { TimezoneService } from "../../application/ports";

export type PanelCell = {
  rowNr: number;
  colNr: number;
  isDone: boolean;
  isClear?: boolean;
  comment?: string;
  createdAt?: ISODateTime;
};

export type PanelDocument = {
  _id: string;
  user: string;
  goalToAchieve: string;
  habitsNames: string[];
  habitsValues: string[];
  cells: PanelCell[];
  createdAt?: ISODateTime;
};

export type PanelToV3Options = {
  userId: string;
  tz: string;
  month: string; // YYYY-MM
  timezoneService: TimezoneService;
  generateId: () => string;
  idempotencySalt?: string;
  resolveDate?: (cell: PanelCell, month: string) => ISODate;
};

export function panelToV3Events(panel: PanelDocument, options: PanelToV3Options): DomainEvent[] {
  const events: DomainEvent[] = [];
  const createdAt = panel.createdAt || new Date().toISOString();

  const goalId = options.generateId();
  events.push({
    type: "GOAL_CREATED",
    version: 1,
    id: options.generateId(),
    userId: options.userId,
    idempotencyKey: `legacy-goal-${panel._id}`,
    payload: { goalId, title: panel.goalToAchieve },
    createdAt,
  });

  const habitIds = panel.habitsNames.map(() => options.generateId());
  panel.habitsNames.forEach((name, index) => {
    events.push({
      type: "HABIT_CREATED",
      version: 1,
      id: options.generateId(),
      userId: options.userId,
      idempotencyKey: `legacy-habit-${panel._id}-${index}`,
      payload: {
        habitId: habitIds[index],
        goalId,
        name,
        target: panel.habitsValues[index] || "",
        order: index,
      },
      createdAt,
    });
  });

  for (const cell of panel.cells || []) {
    const date = options.resolveDate
      ? options.resolveDate(cell, options.month)
      : defaultResolveDate(cell, options.month);

    if (!date) {
      continue;
    }

    const status = cell.isDone ? "done" : cell.isClear === false ? "not_done" : undefined;
    if (!status) {
      continue;
    }

    const habitId = habitIds[cell.rowNr] || habitIds[0];
    events.push({
      type: "DAY_STATE_UPSERTED",
      version: 1,
      id: options.generateId(),
      userId: options.userId,
      idempotencyKey: `legacy-day-${panel._id}-${cell.rowNr}-${cell.colNr}-${status}-${
        options.idempotencySalt || ""
      }`,
      payload: {
        habitId,
        date,
        status,
        note: cell.comment,
      },
      createdAt: cell.createdAt || createdAt,
    });
  }

  return events;
}

function defaultResolveDate(cell: PanelCell, month: string): ISODate {
  const day = cell.colNr + 1;
  const dayStr = `${day}`.padStart(2, "0");
  return `${month}-${dayStr}`;
}
