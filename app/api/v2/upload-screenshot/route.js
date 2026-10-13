import { getAppUser } from "@/lib/auth";
import { decodeDisplayImage, displayImages, displayImageUrl, newDisplayToken } from "@/lib/display-image";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getAppUser();
  if (!user?.email) return Response.json({ error: "Please sign in." }, { status: 401 });
  try {
    const record = await (await displayImages()).findOne({ _id: user.email }, { projection: { token: 1, image: 1 } });
    return Response.json({ url: record?.image ? displayImageUrl(record.token) : null }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "Display storage is unavailable." }, { status: 503 });
  }
}

export async function POST(req) {
  const user = await getAppUser();
  if (!user?.email) return Response.json({ error: "Please sign in to send your panel." }, { status: 401 });
  if (Number(req.headers.get("content-length")) > 2800000) return Response.json({ error: "Image is too large." }, { status: 413 });
  let png, panelId;
  try { const body = await req.json(); png = decodeDisplayImage(body.image); panelId = body.panelId; if (typeof panelId !== "string") throw new Error(); }
  catch { return Response.json({ error: "Send a 480 × 800 PNG image smaller than 2 MB." }, { status: 400 }); }
  try {
    const collection = await displayImages();
    const result = await collection.findOneAndUpdate(
      { _id: user.email, sourcePanelId: panelId },
      { $set: { image: png.toString("base64"), updatedAt: new Date() } },
      { returnDocument: "after" }
    );
    if (!result.value) return Response.json({ error: "Only your main panel can update the display." }, { status: 409 });
    return Response.json({ url: displayImageUrl(result.value.token) }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Display image storage failed", error?.name);
    return Response.json({ error: "The display image could not be stored. Please try again." }, { status: 503 });
  }
}
