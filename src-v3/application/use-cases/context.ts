import { DomainConfig } from "../../domain/types";
import { Clock, TimezoneService } from "../ports";

export interface UseCaseContext {
  clock: Clock;
  timezoneService: TimezoneService;
  config: DomainConfig;
  generateId: () => string;
}
