import { createHash } from "node:crypto";
import { identifySessionConfig } from "./identify-conversation";

type Dependencies = {
  getUser: () => Promise<{ id: string; email: string | null } | null>;
  reserve: (id: string) => Promise<{ allowed: boolean; retryAfter: number }>;
  request?: typeof fetch;
  apiKey?: string;
  model?: string;
  enabled?: boolean;
};
const headers = { "Cache-Control": "no-store" };
const fail = (error: string, status: number, extra = {}) => Response.json({ error }, { status, headers: { ...headers, ...extra } });

export async function readSdp(req: Request) {
  if (Number(req.headers.get("content-length")) > 65536) throw new Error("size");
  const reader = req.body?.getReader();
  if (!reader) throw new Error("empty");
  const chunks: Uint8Array[] = []; let bytes = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.length;
      if (bytes > 65536) { await reader.cancel(); throw new Error("size"); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const sdp = Buffer.concat(chunks).toString("utf8");
  if (!sdp.startsWith("v=0") || !sdp.includes("m=audio") || !sdp.includes("m=application")) throw new Error("sdp");
  return sdp;
}

export async function handleIdentifyRealtime(req: Request, deps: Dependencies) {
  const origin = req.headers.get("origin");
  if (origin !== new URL(req.url).origin) return fail("This request must come from Streaker.", 403);
  const user = await deps.getUser();
  if (!user?.email) return fail("Please sign in with a verified email to speak with Streaker.", 401);
  if (deps.enabled === false || !deps.apiKey) return fail("Voice conversations are unavailable. You can still draft practices using the form.", 503);
  if (req.headers.get("content-type")?.split(";")[0] !== "application/sdp") return fail("Invalid voice connection request.", 415);
  let sdp: string;
  try { sdp = await readSdp(req); } catch { return fail("Invalid voice connection request.", 400); }
  try {
    const budget = await deps.reserve(user.id);
    if (!budget.allowed) return fail("Please wait before starting another voice conversation, or use the form.", 429, { "Retry-After": String(budget.retryAfter) });
    const form = new FormData(); form.set("sdp", sdp); form.set("session", JSON.stringify(identifySessionConfig(deps.model)));
    const response = await (deps.request || fetch)("https://api.openai.com/v1/realtime/calls", {
      method: "POST", headers: { Authorization: `Bearer ${deps.apiKey}`, "OpenAI-Safety-Identifier": createHash("sha256").update(user.id).digest("hex") },
      body: form, signal: AbortSignal.timeout(25000),
    });
    if (!response.ok) {
      // Do not forward provider messages, credentials, SDP, or transcript data.
      const status = response.status === 429 ? 429 : response.status === 401 || response.status === 403 ? 503 : 502;
      return fail(status === 429 ? "Voice is busy or has reached its usage limit. Please try later or use the form." : "Voice could not connect. Please try again or use the form.", status);
    }
    const answer = await response.text();
    if (!answer.startsWith("v=0")) return fail("Voice returned an invalid connection. Please try again.", 502);
    return new Response(answer, { status: 200, headers: { ...headers, "Content-Type": "application/sdp" } });
  } catch { return fail("Voice could not connect. Please try again or use the form.", 503); }
}
