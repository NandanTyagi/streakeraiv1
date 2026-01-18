import { NextRequest, NextResponse } from "next/server";
import { buildHandlerDeps } from "@/src-v3/interface/api/v3/deps";
import { generateWeeklyReflectionHandler } from "@/src-v3/interface/api/v3/handlers";
import { okJson, readJson, requireParam } from "../../_shared";

export async function POST(req: NextRequest) {
  const body = await readJson<{ userId?: string; tz?: string; weekEnding?: string }>(req);
  const userId = body.userId;
  const tz = body.tz || "UTC";
  const weekEnding = body.weekEnding;

  const requiredUserId = requireParam(userId, "userId");
  if (requiredUserId instanceof NextResponse) return requiredUserId;
  const requiredWeek = requireParam(weekEnding, "weekEnding");
  if (requiredWeek instanceof NextResponse) return requiredWeek;

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: "OPENAI_API_KEY is required" }, { status: 500 });
  }

  const deps = await buildHandlerDeps();
  const result = await generateWeeklyReflectionHandler(
    { userId: requiredUserId, tz, weekEnding: requiredWeek },
    deps
  );
  return okJson(result, 201);
}
