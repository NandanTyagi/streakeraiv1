import Panel from "@/models/Panel";
import User from "@/models/User";
import connectDB from "@/utils/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export const POST = async (request, { params }) => {
  const session = getKindeServerSession(request);
  const user = await session.getUser();

  if (!user) {
    return new Response(
      JSON.stringify({ message: "Please log in to save panel." }),
      {
        status: 403,
      }
    );
  }

  try {
    const {
      goalToAchieve,
      habitsNames,
      habitsValues,
      days,
      history,
      cells
    } = await request.json();
    await connectDB();
    const exisitingUser = await User.findOne({ email: user.email });
    if (!exisitingUser) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }
    const panel = await Panel.create({
      goalToAchieve,
      habitsNames,
      habitsValues,
      days,
      history,
      cells,
      user: exisitingUser._id,
    });
    const updatedUser = await User.updateOne(
      { _id: exisitingUser._id },
      { $push: { panels: panel._id } }
    );
    return new Response(JSON.stringify(panel, updatedUser), {
      status: 201,
    });
  } catch (error) {
    console.error("Panel operation failed", error);
    return new Response(JSON.stringify({ message: "Error" }), {
      status: 500,
    });
  }
};
