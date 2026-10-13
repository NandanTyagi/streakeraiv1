import { NextRequest } from "next/server";
import { POST as createHabitPost } from "../habits/route";

export async function POST(req: NextRequest) {
  return createHabitPost(req);
}
