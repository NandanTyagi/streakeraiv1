import { NextRequest, NextResponse } from "next/server";
import { buildHandlerDeps } from "@/src-v3/interface/api/v3/deps";
import { upsertDayStateHandler } from "@/src-v3/interface/api/v3/handlers";
import { okJson, readJson, requireParam } from "../_shared";

export async function POST(req: NextRequest) {
  const body = await readJson<{
    userId?: string;
    tz?: string;
    habitId?: string;
    status?: "done" | "not_done";
    note?: string;
    date?: string;
    timestamp?: string;
  }>(req);
  const userId = body.userId;
  const tz = body.tz || "UTC";
  const habitId = body.habitId;
  const status = body.status;

  const requiredUserId = requireParam(userId, "userId");
  if (requiredUserId instanceof NextResponse) return requiredUserId;
  const requiredHabitId = requireParam(habitId, "habitId");
  if (requiredHabitId instanceof NextResponse) return requiredHabitId;
  const requiredStatus = requireParam(status, "status");
  if (requiredStatus instanceof NextResponse) return requiredStatus;

  const deps = await buildHandlerDeps();
  const result = await upsertDayStateHandler(
    {
      userId: requiredUserId,
      tz,
      habitId: requiredHabitId,
      status: requiredStatus as "done" | "not_done",
      note: body.note,
      date: body.date,
      timestamp: body.timestamp,
    },
    deps
  );
  return okJson(result, 201);
}
