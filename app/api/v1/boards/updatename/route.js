export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import Board from "../../../../../models/StreakerBoard";
import connectDB from "../../../../../utils/db";

export const POST = async (req, res) => {
    const {
        _id,
      goalToAchieve,
    } = await req.json();
  
    await connectDB();
  
    try {
      // console.log("Board USER", boardUser);
      const existingBoard = await Board.findOneAndUpdate(
        {_id},
        {$set: {goalToAchieve: goalToAchieve}},
        {new: true, upsert: true}
        ).exec();
        // console.log("Board EXISTING BOARD", existingBoard);
        return new NextResponse("Board created", { status: 201 });
  
    } catch (error) {
      console.error("Board operation failed", error);
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