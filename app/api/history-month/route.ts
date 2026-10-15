import { getAppUser, getDatabaseUser } from "@/lib/auth";
import { buildHandlerDeps } from "@/src-v3/interface/api/v3/deps";
import { deleteHistoryMonthHandler } from "@/src-v3/interface/api/v3/handlers";
import Panel from "@/models/Panel";
import { z } from "zod";
export const runtime = "nodejs";
const schema = z.object({panelId: z.string().min(1).max(200), month: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/), tz: z.string().max(100).default("UTC")});
export async function DELETE(req: Request) {
  const user = await getAppUser();
  if (!user?.email) return Response.json({error:"Please sign in."},{status:401});
  const parsed = schema.safeParse(await req.json().catch(()=>null));
  if (!parsed.success) return Response.json({error:"Choose a valid panel and month."},{status:400});
  const {panelId, month, tz} = parsed.data;
  try {
    // Validate timezone before using it to determine the current month.
    const parts = new Intl.DateTimeFormat("en-US", {timeZone:tz, year:"numeric",month:"2-digit"}).formatToParts(new Date());
    const current = `${parts.find(p=>p.type==="year")?.value}-${parts.find(p=>p.type==="month")?.value}`;
    if (month >= current) return Response.json({error:"Only completed history months can be deleted. Use Reset for the current month."},{status:400});
    if (process.env.NEXT_PUBLIC_USE_V3_ENGINE === "true") {
      await deleteHistoryMonthHandler({userId:user.email,goalId:panelId,month,tz},await buildHandlerDeps());
    } else {
      const owner = await getDatabaseUser();
      const monthName = new Intl.DateTimeFormat("en-US",{month:"long",timeZone:"UTC"}).format(new Date(`${month}-01T12:00:00Z`));
      const result = await Panel.updateOne({_id:panelId,user:owner._id},{$pull:{history:{year:month.slice(0,4),month:monthName}}});
      if (!result.matchedCount) return Response.json({error:"Panel not found."},{status:404});
    }
    return Response.json({deleted:true},{headers:{"Cache-Control":"no-store"}});
  } catch (error: any) {
    return Response.json({error:error?.status===404?"Panel not found.":"The month could not be deleted. Please try again."},{status:error?.status===404?404:500});
  }
}
