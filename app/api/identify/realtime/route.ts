import { getAppUser } from "@/lib/auth";
import { handleIdentifyRealtime } from "@/lib/identify-realtime-server";
import { reserveIdentifyConnection } from "@/lib/identify-realtime-budget";
export const runtime = "nodejs";
export const maxDuration = 30;
export async function POST(req: Request) {
  return handleIdentifyRealtime(req, { getUser: getAppUser, reserve: reserveIdentifyConnection,
    apiKey: process.env.OPENAI_API_KEY, model: process.env.OPENAI_REALTIME_MODEL,
    enabled: process.env.STREAKER_REALTIME_ENABLED !== "false" });
}
