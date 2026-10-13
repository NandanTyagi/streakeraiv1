import { getAppUser, getDatabaseUser } from "@/lib/auth";
import { buildHandlerDeps } from "@/src-v3/interface/api/v3/deps";
import { createPanelHandler, getGoalsHandler } from "@/src-v3/interface/api/v3/handlers";
import { displayImages, newDisplayToken } from "@/lib/display-image";
import { habitDraftSchema } from "@/lib/panel-schema";
import Panel from "@/models/Panel";
import { z } from "zod";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
const isV3 = process.env.NEXT_PUBLIC_USE_V3_ENGINE === "true";
async function library(email: string, tz: string) {
  if (isV3) return (await getGoalsHandler({ userId: email, tz }, await buildHandlerDeps())).filter(g => !g.archivedAt).map(g => ({ id: g.id, title: g.title }));
  const owner = await getDatabaseUser();
  return (await Panel.find({user:owner._id})).map(p => ({id:String(p._id),title:p.goalToAchieve}));
}
export async function GET(req: Request) {
  const user = await getAppUser();
  if (!user?.email) return Response.json({ error: "Please sign in." }, { status: 401 });
  try {
    const panels = await library(user.email, new URL(req.url).searchParams.get("tz") || "UTC");
    const images = await displayImages();
    let record = await images.findOne({_id:user.email});
    if (panels.length && !panels.some(p => p.id === record?.sourcePanelId)) {
      // Preserve the existing display URL when adopting the first saved panel.
      await images.updateOne({_id:user.email}, {$setOnInsert:{token:newDisplayToken()}}, {upsert:true});
      await images.updateOne({_id:user.email, sourcePanelId:record?.sourcePanelId || {$exists:false}}, {$set:{sourcePanelId:panels[0].id}});
      record = await images.findOne({_id:user.email});
    }
    return Response.json({ panels, mainPanelId: record?.sourcePanelId || null }, {headers:{"Cache-Control":"no-store"}});
  } catch { return Response.json({error:"Your panels could not be loaded. Please retry."},{status:503}); }
}
export async function POST(req: Request) {
  const user=await getAppUser();
  if (!user?.email) return Response.json({error:"Please sign in."},{status:401});
  const parsed=habitDraftSchema.extend({draftId:z.string().uuid(),tz:z.string().max(100).default("UTC")}).safeParse(await req.json().catch(()=>null));
  if (!parsed.success) return Response.json({error:"A panel needs a title and five named habits with targets."},{status:400});
  try {
    if (isV3) {
      const result=await createPanelHandler({...parsed.data,userId:user.email},await buildHandlerDeps());
      return Response.json({id:result.goalId},{status:201});
    }
    const owner=await getDatabaseUser();
    const existing=await Panel.findOne({user:owner._id,boardId:parsed.data.draftId});
    if(existing) return Response.json({id:String(existing._id)});
    const panel=await Panel.create({user:owner._id,boardId:parsed.data.draftId,goalToAchieve:parsed.data.title,habitsNames:parsed.data.habits.map(h=>h.name),habitsValues:parsed.data.habits.map(h=>h.target),days:31,cells:[],history:[]});
    return Response.json({id:String(panel._id)},{status:201});
  } catch(error:any) { return Response.json({error:error?.message?.includes("unique")?"You already have a panel with this title. Give this draft a different name.":"The panel could not be saved. Please retry."},{status:409}); }
}
export async function PATCH(req: Request) {
  const user=await getAppUser();
  if(!user?.email)return Response.json({error:"Please sign in."},{status:401});
  const body=await req.json().catch(()=>({}));
  try {
    const panels=await library(user.email,body.tz||"UTC");
    if(!panels.some(p=>p.id===body.panelId))return Response.json({error:"Panel not found."},{status:404});
    await (await displayImages()).updateOne({_id:user.email},{$set:{sourcePanelId:body.panelId},$setOnInsert:{token:newDisplayToken()}},{upsert:true});
    return Response.json({mainPanelId:body.panelId});
  }catch{return Response.json({error:"Could not change the main panel. Please retry."},{status:503});}
}
