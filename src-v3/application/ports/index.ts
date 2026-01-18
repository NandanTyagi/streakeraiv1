import { DomainEvent } from "../../domain/events";
import { ID, ISODate, ISODateTime, State } from "../../domain/types";
import {
  AIGroundingContext,
  DashboardView,
  HistoryTimeline,
  MonthlyGridView,
} from "../projections/types";

export interface EventStore {
  append(events: DomainEvent[]): Promise<void>;
  listByUser(userId: ID): Promise<DomainEvent[]>;
  listByUserAndRange(userId: ID, from: ISODateTime, to: ISODateTime): Promise<DomainEvent[]>;
}

export interface ProjectionRepository {
  saveState(userId: ID, state: State): Promise<void>;
  saveDashboard(userId: ID, dashboard: DashboardView): Promise<void>;
  saveMonthlyGrid(userId: ID, grid: MonthlyGridView): Promise<void>;
  saveHistory(userId: ID, history: HistoryTimeline): Promise<void>;
  saveAIContext(userId: ID, context: AIGroundingContext): Promise<void>;
}

export interface AIProvider {
  generateDailyReflection(context: AIGroundingContext): Promise<AIReflection>;
  generateWeeklyReflection(context: AIGroundingContext): Promise<AIReflection>;
}

export interface AuthProvider {
  requireUser(userId: ID): Promise<{ id: ID; tz: string }>;
}

export interface Clock {
  now(): ISODateTime;
  today(tz: string): ISODate;
}

export interface TimezoneService {
  toDateKey(timestamp: ISODateTime, tz: string): ISODate;
}

export type AIReflection = {
  prompt: string;
  response: string;
  model: string;
  tokensIn?: number;
  tokensOut?: number;
  latencyMs?: number;
};
