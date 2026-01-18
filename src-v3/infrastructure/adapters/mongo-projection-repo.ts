import { Collection } from "mongodb";
import { ProjectionRepository } from "../../application/ports";
import { AIGroundingContext, DashboardView, HistoryTimeline, MonthlyGridView } from "../../application/projections/types";
import { ID, State } from "../../domain/types";

type WithUserId<T> = T & { userId: ID; updatedAt: string };

export class MongoProjectionRepository implements ProjectionRepository {
  constructor(
    private readonly stateCollection: Collection<WithUserId<State>>,
    private readonly dashboardCollection: Collection<WithUserId<DashboardView>>,
    private readonly monthlyGridCollection: Collection<WithUserId<MonthlyGridView>>,
    private readonly historyCollection: Collection<WithUserId<HistoryTimeline>>,
    private readonly aiContextCollection: Collection<WithUserId<AIGroundingContext>>
  ) {}

  async saveState(userId: ID, state: State): Promise<void> {
    await this.stateCollection.updateOne(
      { userId },
      { $set: { ...state, userId, updatedAt: new Date().toISOString() } },
      { upsert: true }
    );
  }

  async saveDashboard(userId: ID, dashboard: DashboardView): Promise<void> {
    await this.dashboardCollection.updateOne(
      { userId },
      { $set: { ...dashboard, userId, updatedAt: new Date().toISOString() } },
      { upsert: true }
    );
  }

  async saveMonthlyGrid(userId: ID, grid: MonthlyGridView): Promise<void> {
    await this.monthlyGridCollection.updateOne(
      { userId, month: grid.month },
      { $set: { ...grid, userId, updatedAt: new Date().toISOString() } },
      { upsert: true }
    );
  }

  async saveHistory(userId: ID, history: HistoryTimeline): Promise<void> {
    await this.historyCollection.updateOne(
      { userId },
      { $set: { ...history, userId, updatedAt: new Date().toISOString() } },
      { upsert: true }
    );
  }

  async saveAIContext(userId: ID, context: AIGroundingContext): Promise<void> {
    await this.aiContextCollection.updateOne(
      { userId },
      { $set: { ...context, userId, updatedAt: new Date().toISOString() } },
      { upsert: true }
    );
  }
}
