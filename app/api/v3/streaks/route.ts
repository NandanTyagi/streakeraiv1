import { NextRequest, NextResponse } from "next/server";
import { buildHandlerDeps } from "@/src-v3/interface/api/v3/deps";
import { getStreaksHandler } from "@/src-v3/interface/api/v3/handlers";
import { requireUserEmail, getQueryParam, okJson, requireParam } from "../_shared";

export async function GET(req: NextRequest) {
  const tz = getQueryParam(req, "tz") || "UTC";
  const required = await requireUserEmail();
  if (required instanceof NextResponse) return required;

  const deps = await buildHandlerDeps();
  const streaks = await getStreaksHandler({ userId: required, tz }, deps);
  return okJson(streaks);
}
