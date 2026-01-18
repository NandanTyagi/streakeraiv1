import { NextRequest, NextResponse } from "next/server";
import { buildHandlerDeps } from "@/src-v3/interface/api/v3/deps";
import { getHistoryHandler } from "@/src-v3/interface/api/v3/handlers";
import { getQueryParam, okJson, requireParam } from "../_shared";

export async function GET(req: NextRequest) {
  const userId = getQueryParam(req, "userId");
  const tz = getQueryParam(req, "tz") || "UTC";
  const required = requireParam(userId, "userId");
  if (required instanceof NextResponse) return required;

  const deps = await buildHandlerDeps();
  const history = await getHistoryHandler({ userId: required, tz }, deps);
  return okJson(history);
}
