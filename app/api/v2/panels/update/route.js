export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import Panel from "@/models/Panel";
import connectDB from "@/utils/db";

export const POST = async (req, res) => {
  const {
    cells,
    goalToAchieve,
    habitsNames,
    habitsValues,
    days,
    history,
    user,
    _id,
  } = await req.json();

  await connectDB();
debugger
  try {
    const existingPanel = await Panel.findByIdAndUpdate(
      _id,
      {
        cells: cells,
        goalToAchieve: goalToAchieve,
        habitsNames: habitsNames,
        habitsValues: habitsValues,
        days: days,
        history: history,
        user: user,
        _id: _id,
      },
      { new: true, upsert: true }
    );
    // console.log("Existing panel in update panel", existingPanel);
    return new NextResponse(JSON.stringify(existingPanel), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Panel update cells failed", error);
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
