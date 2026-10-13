import Panel from "@/models/Panel";
import User from "@/models/User";
import { getDatabaseUser } from "@/lib/auth";

export async function POST(request) {
  try {
    const user = await getDatabaseUser();
    if (!user) return Response.json({ message: "Sign in with a verified email address." }, { status: 401 });
    const { goalToAchieve, habitsNames, habitsValues, days, history, cells } = await request.json();
    const panel = await Panel.create({ goalToAchieve, habitsNames, habitsValues, days, history, cells, user: user._id });
    await User.updateOne({ _id: user._id }, { $push: { panels: panel._id } });
    return Response.json(panel, { status: 201 });
  } catch (error) {
    console.error("Panel operation failed", error);
    return Response.json({ message: "Error" }, { status: 500 });
  }
}
