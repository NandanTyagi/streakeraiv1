import Panel from "@/models/Panel";
import connectDB from "@/utils/db";

export const GET = async (request, {params}) => {
  try {
    await connectDB();
    const panel = await Panel.findById(params.id);
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
