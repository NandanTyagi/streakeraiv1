export const dynamic = "force-dynamic";
import { getDatabaseUser } from "@/lib/auth";
import Panel from "@/models/Panel";

export const GET = async (request) => {
  try {
    const user = await getDatabaseUser();
    if (!user) return Response.json({ message: "Unauthorized" }, { status: 401 });
    const panels = await Panel.find({ user: user._id });
    return new Response(JSON.stringify(panels), {
      status: 200,
    });
  } catch (error) {
    console.error("Panel operation failed", error);
    return new Response(JSON.stringify({ message: "Error" }), {
        status: 500,
      });
  }
};
