import { NextRequest, NextResponse } from "next/server";
import { buildHandlerDeps } from "@/src-v3/interface/api/v3/deps";
import { getHistoryHandler } from "@/src-v3/interface/api/v3/handlers";
import { requireUserEmail, getQueryParam, okJson, requireParam } from "../_shared";

export async function GET(req: NextRequest) {
  const tz = getQueryParam(req, "tz") || "UTC";
  const required = await requireUserEmail();
  if (required instanceof NextResponse) return required;

  const deps = await buildHandlerDeps();
  const history = await getHistoryHandler({ userId: required, tz }, deps);
  return okJson(history);
}
