export const dynamic = "force-dynamic"; // defaults to force-static
import { NextResponse } from "next/server";
import User from "../../../../models/User";
import Panel from "../../../../models/Panel";
import connectDB from "../../../../utils/db";

export const POST = async (req, res) => {
  const data = await req.json();
  // console.log("data in userboards route", data);

  await connectDB();

  try {
    const user = await User.find({ email: `${data.boardUser}` });
    // console.log(
    //   "user in userboards route********************************* ***************",
    //   user[0]
    // );
    let userHasPanels = user[0].panels.length > 0;
    if (userHasPanels) {
      const latestUserBoardId = user[0].panels[user[0].panels.length - 1]._id;
      const boards = await Panel.find({ _id: `${latestUserBoardId}` });
      // console.log("boards panel in userboard route", boards[0]);
      return new NextResponse(JSON.stringify(boards), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } else {

      return new NextResponse(JSON.stringify({ error: "User has no panels" }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  } catch (error) {
    console.error(error);
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};
