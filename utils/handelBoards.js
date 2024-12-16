import generateUUID from "./generateUUID";
import fetch from "isomorphic-unfetch";

export default async function handelBoards(board, userEmail) {
  // debugger;
  // console.log('in handel boards', board);
  if (!board) {
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
