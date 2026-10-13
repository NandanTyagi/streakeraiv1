import Panel from "@/models/Panel";
import { getDatabaseUser } from "@/lib/auth";
export const dynamic = "force-dynamic";
export async function POST() {
  try {
    const user = await getDatabaseUser();
    if (!user) return Response.json({ error: "Sign in with a verified email address." }, { status: 401 });
    const panelId = user.panels[user.panels.length - 1];
    if (!panelId) return Response.json({ error: "User has no panels" }, { status: 404 });
    const panels = await Panel.find({ _id: panelId, user: user._id });
    return Response.json(panels);
  } catch (error) {
    console.error("User boards operation failed", error);
    return Response.json({ error: "Error" }, { status: 500 });
  }
}
