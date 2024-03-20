import Panel from "@/models/Panel";
import connectDB from "@/utils/db";

export const GET = async (request) => {
  try {
    await connectDB();
    const panels = await Panel.find({});
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
