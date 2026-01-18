import { NextRequest, NextResponse } from "next/server";
import { buildHandlerDeps } from "@/src-v3/interface/api/v3/deps";
import {
  createGoalHandler,
  getGoalsHandler,
  updateGoalHandler,
} from "@/src-v3/interface/api/v3/handlers";
import { getQueryParam, okJson, readJson, requireParam } from "../_shared";

export async function GET(req: NextRequest) {
  const userId = getQueryParam(req, "userId");
  const tz = getQueryParam(req, "tz") || "UTC";
  const required = requireParam(userId, "userId");
  if (required instanceof NextResponse) return required;

  const deps = await buildHandlerDeps();
  const goals = await getGoalsHandler({ userId: required, tz }, deps);
  return okJson(goals);
}

export async function POST(req: NextRequest) {
  const body = await readJson<{ userId?: string; tz?: string; title?: string }>(req);
  const userId = body.userId;
  const tz = body.tz || "UTC";
  const title = body.title;
  const requiredUserId = requireParam(userId, "userId");
  if (requiredUserId instanceof NextResponse) return requiredUserId;
  const requiredTitle = requireParam(title, "title");
  if (requiredTitle instanceof NextResponse) return requiredTitle;

  const deps = await buildHandlerDeps();
  const result = await createGoalHandler({ userId: requiredUserId, tz, title: requiredTitle }, deps);
  return okJson(result, 201);
}

export async function PATCH(req: NextRequest) {
  const body = await readJson<{ userId?: string; tz?: string; goalId?: string; title?: string }>(req);
  const userId = body.userId;
  const tz = body.tz || "UTC";
  const goalId = body.goalId;
  const title = body.title;

  const requiredUserId = requireParam(userId, "userId");
  if (requiredUserId instanceof NextResponse) return requiredUserId;
  const requiredGoalId = requireParam(goalId, "goalId");
  if (requiredGoalId instanceof NextResponse) return requiredGoalId;
  const requiredTitle = requireParam(title, "title");
  if (requiredTitle instanceof NextResponse) return requiredTitle;

  const deps = await buildHandlerDeps();
  const result = await updateGoalHandler(
    { userId: requiredUserId, tz, goalId: requiredGoalId, title: requiredTitle },
    deps
  );
  return okJson(result, 200);
}
