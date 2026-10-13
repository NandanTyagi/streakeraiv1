import { ISODate } from "./types";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function parseISODate(date: ISODate): Date {
  return new Date(`${date}T00:00:00.000Z`);
}

export function formatISODate(date: Date): ISODate {
  const year = date.getUTCFullYear();
  const month = `${date.getUTCMonth() + 1}`.padStart(2, "0");
  const day = `${date.getUTCDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function addDays(date: ISODate, days: number): ISODate {
  const base = parseISODate(date).getTime();
  return formatISODate(new Date(base + MS_PER_DAY * days));
}

export function isSameDay(a: ISODate, b: ISODate): boolean {
  return a === b;
}

export function isNextDay(prev: ISODate, next: ISODate): boolean {
  return addDays(prev, 1) === next;
}

export function isAfter(a: ISODate, b: ISODate): boolean {
  return parseISODate(a).getTime() > parseISODate(b).getTime();
}

export function isBefore(a: ISODate, b: ISODate): boolean {
  return parseISODate(a).getTime() < parseISODate(b).getTime();
}

export function daysBetween(a: ISODate, b: ISODate): number {
  const delta = parseISODate(a).getTime() - parseISODate(b).getTime();
  return Math.round(delta / MS_PER_DAY);
}
