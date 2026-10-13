import { getDatabaseUser } from "@/lib/auth";
export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import Panel from "@/models/Panel";

export const POST = async (req, res) => {
  const {
    cells,
    goalToAchieve,
    habitsNames,
    habitsValues,
    days,
    history,
    _id,
  } = await req.json();

  try {
    const owner = await getDatabaseUser();
    if (!owner) return Response.json({ message: "Unauthorized" }, { status: 401 });
    const existingPanel = await Panel.findOneAndUpdate(
      { _id, user: owner._id },
      {
        cells: cells,
        goalToAchieve: goalToAchieve,
        habitsNames: habitsNames,
        habitsValues: habitsValues,
        days: days,
        history: history,
        user: owner._id,
        _id: _id,
      },
      { new: true }
    );
    if (!existingPanel) return Response.json({ message: "Panel not found" }, { status: 404 });
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
