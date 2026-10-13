import { DomainEvent } from "../../domain/events";
import { State } from "../../domain/types";
import { AIGroundingContext, DashboardView, HistoryTimeline, MonthlyGridView } from "../projections/types";

export type UseCaseProjections = {
  dashboard?: DashboardView;
  monthlyGrid?: MonthlyGridView;
  history?: HistoryTimeline;
  aiContext?: AIGroundingContext;
};

export type UseCaseResult = {
  events: DomainEvent[];
  state: State;
  projections: UseCaseProjections;
};
