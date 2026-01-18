import { NextRequest, NextResponse } from "next/server";
import { buildHandlerDeps } from "@/src-v3/interface/api/v3/deps";
import {
  createHabitHandler,
  getHabitsHandler,
  updateHabitHandler,
} from "@/src-v3/interface/api/v3/handlers";
import { getQueryParam, okJson, readJson, requireParam } from "../_shared";

export async function GET(req: NextRequest) {
  const userId = getQueryParam(req, "userId");
  const tz = getQueryParam(req, "tz") || "UTC";
  const goalId = getQueryParam(req, "goalId");
  const required = requireParam(userId, "userId");
  if (required instanceof NextResponse) return required;

  const deps = await buildHandlerDeps();
  const habits = await getHabitsHandler({ userId: required, tz }, deps);
  const filtered = goalId ? habits.filter((habit) => habit.goalId === goalId) : habits;
  return okJson(filtered);
}

export async function POST(req: NextRequest) {
  const body = await readJson<{
    userId?: string;
    tz?: string;
    goalId?: string;
    name?: string;
    target?: string;
    order?: number;
  }>(req);
  const userId = body.userId;
  const tz = body.tz || "UTC";
  const goalId = body.goalId;
  const name = body.name;
  const target = body.target;
  const order = body.order ?? 0;

  const requiredUserId = requireParam(userId, "userId");
  if (requiredUserId instanceof NextResponse) return requiredUserId;
  const requiredGoalId = requireParam(goalId, "goalId");
  if (requiredGoalId instanceof NextResponse) return requiredGoalId;
  const requiredName = requireParam(name, "name");
  if (requiredName instanceof NextResponse) return requiredName;
  const requiredTarget = requireParam(target, "target");
  if (requiredTarget instanceof NextResponse) return requiredTarget;

  const deps = await buildHandlerDeps();
  const result = await createHabitHandler(
    { userId: requiredUserId, tz, goalId: requiredGoalId, name: requiredName, target: requiredTarget, order },
    deps
  );
  return okJson(result, 201);
}

export async function PATCH(req: NextRequest) {
  const body = await readJson<{
    userId?: string;
    tz?: string;
    habitId?: string;
    name?: string;
    target?: string;
    order?: number;
  }>(req);
  const userId = body.userId;
  const tz = body.tz || "UTC";
  const habitId = body.habitId;

  const requiredUserId = requireParam(userId, "userId");
  if (requiredUserId instanceof NextResponse) return requiredUserId;
  const requiredHabitId = requireParam(habitId, "habitId");
  if (requiredHabitId instanceof NextResponse) return requiredHabitId;

  const deps = await buildHandlerDeps();
  const result = await updateHabitHandler(
    {
      userId: requiredUserId,
      tz,
      habitId: requiredHabitId,
      name: body.name,
      target: body.target,
      order: body.order,
    },
    deps
  );
  return okJson(result, 200);
}
