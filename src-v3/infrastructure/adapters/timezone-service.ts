import { TimezoneService } from "../../application/ports";
import { ISODate, ISODateTime } from "../../domain/types";

export class IntlTimezoneService implements TimezoneService {
  toDateKey(timestamp: ISODateTime, tz: string): ISODate {
    const date = new Date(timestamp);
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
}
