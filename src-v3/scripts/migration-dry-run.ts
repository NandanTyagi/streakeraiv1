/* eslint-disable no-console */
import mongoose from "mongoose";
import Panel from "../../models/Panel";
import { panelToV3Events } from "../infrastructure/legacy/panel-to-v3-mapper";
import { IntlTimezoneService } from "../infrastructure/adapters/timezone-service";

async function run() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is required for migration dry-run.");
  }
  await mongoose.connect(uri);

  const panels = await Panel.find({});
  const timezoneService = new IntlTimezoneService();

  let totalEvents = 0;
  for (const panel of panels) {
    const events = panelToV3Events(panel.toObject(), {
      userId: panel.user?.toString() || "unknown",
      tz: "UTC",
      month: new Date(panel.createdAt || Date.now()).toISOString().slice(0, 7),
      timezoneService,
      generateId: () => `evt_${Math.random().toString(36).slice(2, 10)}`,
    });
    totalEvents += events.length;
    console.log(`Panel ${panel._id}: ${events.length} events`);
  }

  console.log(`Total panels: ${panels.length}`);
  console.log(`Total events: ${totalEvents}`);
  await mongoose.disconnect();
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
