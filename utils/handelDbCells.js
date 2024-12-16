import generateUUID from "./generateUUID";
import fetch from "isomorphic-unfetch";

export default async function handelDbCells(board, currentCellIndex, updatedCell) {
//   debugger;
  // console.log("in handel boards", board);
  if (!board) {
    return;
  }
  try {
    const res = await fetch(`/api/v1/boards/updatecell`, {
      method: "post",
      cache: "no-cache",
        next: {
          revalidate: 0
        },
      body: JSON.stringify({
        _id: board._id,
        cells: board.cells,
        currentCellIndex: currentCellIndex,
        updatedCell: updatedCell
      }),
    })
    // console.log("cells updated respons", res);
    // console.log("cells updated board.cells", board.cells);
  } catch (error) {
    console.error("Failed to update cells", error);
  }
}
