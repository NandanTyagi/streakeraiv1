import { NextRequest, NextResponse } from "next/server";
import { buildHandlerDeps } from "@/src-v3/interface/api/v3/deps";
import { getDayStatesHandler } from "@/src-v3/interface/api/v3/handlers";
import { requireUserEmail, getQueryParam, okJson, requireParam } from "../_shared";

export async function GET(req: NextRequest) {
  const tz = getQueryParam(req, "tz") || "UTC";
  const month = getQueryParam(req, "month");
  const required = await requireUserEmail();
  if (required instanceof NextResponse) return required;

  const deps = await buildHandlerDeps();
  const grid = await getDayStatesHandler({ userId: required, tz, month: month || undefined }, deps);
  return okJson(grid);
}
