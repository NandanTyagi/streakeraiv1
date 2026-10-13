export const dynamic = "force-dynamic";
import { getDatabaseUser } from "@/lib/auth";
import Panel from "@/models/Panel";

export const GET = async (request, {params}) => {
  try {
    const user = await getDatabaseUser();
    if (!user) return Response.json({ message: "Unauthorized" }, { status: 401 });
    const panel = await Panel.findOne({ _id: params.id, user: user._id });
    if (!panel) {
      return new Response(JSON.stringify({ message: "Panel not found" }), {
        status: 404,
      });
    }
    return new Response(JSON.stringify(panel), {
      status: 200,
    });
  } catch (error) {
    console.error("Panel operation failed", error);
    return new Response(JSON.stringify({ message: "Error" }), {
        status: 500,
      });
  }
};
