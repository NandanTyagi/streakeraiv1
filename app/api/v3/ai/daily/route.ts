import { NextRequest, NextResponse } from "next/server";
import { buildHandlerDeps } from "@/src-v3/interface/api/v3/deps";
import { generateDailyReflectionHandler } from "@/src-v3/interface/api/v3/handlers";
import { okJson, readJson, requireParam } from "../../_shared";

export async function POST(req: NextRequest) {
  const body = await readJson<{ userId?: string; tz?: string; date?: string }>(req);
  const userId = body.userId;
  const tz = body.tz || "UTC";
  const date = body.date;

  const requiredUserId = requireParam(userId, "userId");
  if (requiredUserId instanceof NextResponse) return requiredUserId;
  const requiredDate = requireParam(date, "date");
  if (requiredDate instanceof NextResponse) return requiredDate;

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: "OPENAI_API_KEY is required" }, { status: 500 });
  }

  const deps = await buildHandlerDeps();
  const result = await generateDailyReflectionHandler({ userId: requiredUserId, tz, date: requiredDate }, deps);
  return okJson(result, 201);
}
