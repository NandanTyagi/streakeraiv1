import { Clock } from "../../application/ports";
import { ISODate, ISODateTime } from "../../domain/types";

export class SystemClock implements Clock {
  now(): ISODateTime {
    return new Date().toISOString();
  }

  today(tz: string): ISODate {
    return formatDateForTz(new Date(), tz);
  }
}

function formatDateForTz(date: Date, tz: string): ISODate {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const parts = formatter.formatToParts(date);
  const year = parts.find((p) => p.type === "year")?.value || "1970";
  const month = parts.find((p) => p.type === "month")?.value || "01";
  const day = parts.find((p) => p.type === "day")?.value || "01";
  return `${year}-${month}-${day}`;
}
