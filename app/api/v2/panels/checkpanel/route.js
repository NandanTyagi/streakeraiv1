import { getDatabaseUser } from "@/lib/auth";
export const dynamic = "force-dynamic"; // defaults to force-static
import { NextResponse } from "next/server";
import Panel from "@/models/Panel";

export const POST = async (req, res) => {
  const { panelId } = await req.json();
  try {
    const user = await getDatabaseUser();
    if (!user) return Response.json({ message: "Unauthorized" }, { status: 401 });
    const existingPanel = await Panel.find({ _id: panelId, user: user._id });
    // console.log("existingPanel in check panel route", existingPanel);
    // console.log("panel id in check panel route", panelId);
    return new NextResponse(JSON.stringify(existingPanel), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("error in check panel route", error);
    return new NextResponse(JSON.stringify({ message: "Panel not found" }), {
      status: 404,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};
