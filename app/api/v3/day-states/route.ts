import { NextRequest, NextResponse } from "next/server";
import { buildHandlerDeps } from "@/src-v3/interface/api/v3/deps";
import { getDayStatesHandler } from "@/src-v3/interface/api/v3/handlers";
import { getQueryParam, okJson, requireParam } from "../_shared";

export async function GET(req: NextRequest) {
  const userId = getQueryParam(req, "userId");
  const tz = getQueryParam(req, "tz") || "UTC";
  const month = getQueryParam(req, "month");
  const required = requireParam(userId, "userId");
  if (required instanceof NextResponse) return required;

  const deps = await buildHandlerDeps();
  const grid = await getDayStatesHandler({ userId: required, tz, month: month || undefined }, deps);
  return okJson(grid);
}
