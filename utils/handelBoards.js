import generateUUID from "./generateUUID";
import fetch from "isomorphic-unfetch";
import useV3Engine from "@/utils/useV3Engine";
import { ensureGoalAndHabits } from "@/utils/v3/saveBoardToV3";

export default async function handelBoards(board, userEmail) {
  // debugger;
  // console.log('in handel boards', board);
  if (!board) {
    return;
  }
  if (useV3Engine()) {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
    await ensureGoalAndHabits({ board, userId: userEmail, tz });
    return;
  }
  const res = await fetch(`/api/v1/boards`, {
    method: "post",
    body: JSON.stringify({
      boardId: generateUUID(),
      goalToAchieve: board.goalToAchieve,
      habitsNames: board.habitsNames,
      habitsValues: board.habitsValues,
      days: board.days,
      cells: board.cells,
      boardUser: userEmail,
    }),
  });
}
