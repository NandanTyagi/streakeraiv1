import { getAppUser } from "@/lib/auth";
import { identifySchema } from "@/lib/panel-schema";
import { generatePanelDraft } from "@/lib/generate-panel-draft";
import { PanelGenerationError, panelGenerationFailure } from "@/lib/panel-generation-error";
export const runtime = "nodejs";
export const maxDuration = 60;
export async function POST(req: Request) {
  const user = await getAppUser();
  if (!user?.email) return Response.json({ error: "Please sign in to generate a panel." }, { status: 401 });
  const parsed = identifySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Enter an intention between 10 and 1,000 characters and choose 1 to 5 practices." }, { status: 400 });
  if (!process.env.OPENAI_API_KEY) return Response.json({ error: "AI generation is not configured. Please try again later." }, { status: 503 });
  try { return Response.json(await generatePanelDraft(parsed.data.goal, fetch, parsed.data.practiceCount), { headers: { "Cache-Control": "no-store" } }); }
  catch (error: unknown) {
    console.error("Identify generation failed", error instanceof PanelGenerationError
      ? { status: error.status, code: error.code, type: error.type, requestId: error.requestId }
      : { name: error instanceof Error ? error.name : "UnknownError" });
    const { status, ...body } = panelGenerationFailure(error);
    return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
  }
}
