import { displayImages } from "@/lib/display-image";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "no-store, max-age=0", "CDN-Cache-Control": "no-store", "Vercel-CDN-Cache-Control": "no-store", "X-Content-Type-Options": "nosniff", "Referrer-Policy": "no-referrer" };

// The unguessable URL lets a display fetch its image without a browser login.
export async function GET(_req, { params }) {
  if (!/^[a-f0-9]{48}$/.test(params.token)) return new Response("Not found", { status: 404, headers });
  try {
    const record = await (await displayImages()).findOne({ token: params.token });
    if (!record?.image) return new Response("Not found", { status: 404, headers });
    return new Response(Buffer.from(record.image, "base64"), { headers: { ...headers, "Content-Type": "image/png", "Last-Modified": (record.updatedAt || new Date()).toUTCString() } });
  } catch { return new Response("Display temporarily unavailable", { status: 503, headers }); }
}
