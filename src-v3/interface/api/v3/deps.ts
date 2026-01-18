import { HandlerDeps } from "./handlers";
import { MongoEventStore } from "../../../infrastructure/adapters/mongo-event-store";
import { MongoProjectionRepository } from "../../../infrastructure/adapters/mongo-projection-repo";
import { OpenAIAdapter } from "../../../infrastructure/adapters/openai-adapter";
import { SystemClock } from "../../../infrastructure/adapters/clock";
import { IntlTimezoneService } from "../../../infrastructure/adapters/timezone-service";
import { getMongoDb } from "../../../infrastructure/adapters/mongo-client";
import { DomainConfig } from "../../../domain/types";

const defaultConfig: DomainConfig = {
  allowReversal: false,
  backdateWindowDays: 7,
};

export async function buildHandlerDeps(): Promise<HandlerDeps> {
  const db = await getMongoDb();
  const eventStore = new MongoEventStore(db.collection("v3_events"));
  const projectionRepo = new MongoProjectionRepository(
    db.collection("v3_state"),
    db.collection("v3_dashboard"),
    db.collection("v3_monthly_grid"),
    db.collection("v3_history"),
    db.collection("v3_ai_context")
  );
  const apiKey = process.env.OPENAI_API_KEY || "";
  const aiProvider = apiKey
    ? new OpenAIAdapter(apiKey)
    : {
        async generateDailyReflection() {
          throw new Error("OPENAI_API_KEY is required");
        },
        async generateWeeklyReflection() {
          throw new Error("OPENAI_API_KEY is required");
        },
      };

  return {
    eventStore,
    projectionRepo,
    aiProvider,
    ctx: {
      clock: new SystemClock(),
      timezoneService: new IntlTimezoneService(),
      config: defaultConfig,
      generateId: () => (globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : `evt_${Date.now()}`),
    },
  };
}
