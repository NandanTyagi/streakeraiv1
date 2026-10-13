import { getAppUser } from "@/lib/auth";
import { identifySchema } from "@/lib/panel-schema";
import { generatePanelDraft } from "@/lib/generate-panel-draft";
export const runtime = "nodejs";
export const maxDuration = 60;
export async function POST(req: Request) {
  const user = await getAppUser();
  if (!user?.email) return Response.json({ error: "Please sign in to generate a panel." }, { status: 401 });
  const parsed = identifySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Enter an intention between 10 and 1,000 characters." }, { status: 400 });
  if (!process.env.OPENAI_API_KEY) return Response.json({ error: "AI generation is not configured. Please try again later." }, { status: 503 });
  try { return Response.json(await generatePanelDraft(parsed.data.goal), { headers: { "Cache-Control": "no-store" } }); }
  catch (error: any) {
    console.error("Identify generation failed", error?.status || error?.name);
    return Response.json({ error: error?.status === 429 ? "AI generation is busy or its quota is unavailable. Please try again later." : "A complete draft could not be generated. Your saved panels are unchanged. Please try again." }, { status: 502 });
  }
}
