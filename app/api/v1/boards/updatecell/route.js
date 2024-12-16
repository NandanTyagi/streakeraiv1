export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import Board from "../../../../../models/StreakerBoard";
import connectDB from "../../../../../utils/db";

export const POST = async (req, res) => {
  const { _id, cells, currentCellIndex, updatedCell } = await req.json();

  await connectDB();

  try {
    // console.log("update cells route", cells);
    // console.log("update cells route call", updatedCell);
    // console.log("update cells route call current cell index", currentCellIndex);
    // const updateObject = { [updateField]: cells[`${rowNr}-${colNr}`] };
    const updateField = `cells.${currentCellIndex}`;
    const existingBoard = await Board.findOneAndUpdate(
      { _id },
      { $set: { [updateField]: updatedCell } },
      { new: true, upsert: true }
    ).exec();
    // console.log("Updated cell", existingBoard.cells[currentCellIndex]);
    return new NextResponse("cells updated", {
      "updated board": existingBoard,
      status: 201,
    });
  } catch (error) {
    console.error("Board update cells failed", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};

// export const POST = async (req, res) => {
//   const { _id, cells, rowNr, colNr } = await req.json();

//   await connectDB();

//   try {
//     // Construct the dynamic field name for the update
//     const updateField = `cells.${rowNr}-${colNr}`;
//     const updateObject = { [updateField]: cells[`${rowNr}-${colNr}`] };

//     const existingBoard = await Board.findOneAndUpdate(
//       { _id },
//       { $set: updateObject },
//       { new: true, upsert: true }
//     ).exec();

//     console.log("Board update cells", existingBoard);
//     // For Next.js API routes, you should return a response using res.status().json() or similar
//     return res.status(201).json({ message: "Cells updated", updatedBoard: existingBoard });

//   } catch (error) {
//     console.error("Board update cells failed", error);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// };
