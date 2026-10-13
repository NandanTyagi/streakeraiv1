import { NextRequest } from "next/server";
import { POST as createGoalPost } from "../goals/route";

export async function POST(req: NextRequest) {
  return createGoalPost(req);
}
