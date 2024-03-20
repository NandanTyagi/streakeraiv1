export const dynamic = "force-dynamic"; // defaults to force-static
import { NextResponse } from "next/server";
import Board from "../../../../models/StreakerBoard";
import User from "../../../../models/User";
import Panel from "../../../../models/Panel";
import connectDB from "../../../../utils/db";

export const POST = async (req, res) => {
const data = await req.json();
console.log('data in userboards route', data)
await connectDB();
const user = await User.find({'email': `${data.boardUser}`});
console.log('user in userboards route********************************* ***************', user[0]);
const latestUserBoardId = user[0].panels[user[0].panels.length - 1]._id
// const latestUserBoardId = user[0].panels[1]._id
  const boards = await Panel.find({'_id': `${latestUserBoardId}`});
  console.log('boards panel in userboard route', boards);
  console.log('data in userboard route', data);
  return new NextResponse(JSON.stringify(boards), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
