import { createHash } from "node:crypto";
import { getMongoDb } from "../src-v3/infrastructure/adapters/mongo-client";

type Budget = { _id: string; count: number; nextAt: Date; expiresAt: Date };
/** Shared atomic connection budget. Stores neither audio nor conversation text. */
export async function reserveIdentifyConnection(userId: string, now = new Date()) {
  const collection = (await getMongoDb()).collection<Budget>("identifyVoiceBudgets");
  await collection.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
  const day = now.toISOString().slice(0, 10);
  const id = createHash("sha256").update(`${userId}:${day}`).digest("hex");
  const nextDay = Date.parse(`${day}T00:00:00.000Z`) + 86400000;
  try {
    await collection.updateOne({ _id: id }, { $setOnInsert: { count: 0, nextAt: new Date(0), expiresAt: new Date(nextDay + 86400000) } }, { upsert: true });
  } catch (error) { if (!(error && typeof error === "object" && "code" in error && error.code === 11000)) throw error; }
  const result = await collection.updateOne({ _id: id, count: { $lt: 20 }, nextAt: { $lte: now } }, { $inc: { count: 1 }, $set: { nextAt: new Date(now.getTime() + 10000) } });
  if (result.modifiedCount === 1) return { allowed: true, retryAfter: 0 };
  const budget = await collection.findOne({ _id: id });
  return { allowed: false, retryAfter: budget && budget.count >= 20 ? Math.max(1, Math.ceil((nextDay - now.getTime()) / 1000)) : 10 };
}
