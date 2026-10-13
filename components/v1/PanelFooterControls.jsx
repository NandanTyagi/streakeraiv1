"use client";
import { useContext, useState } from "react";
import Link from "next/link";
import { CalendarDays, RotateCcw, Plus, Star, Image as ImageIcon, Save, X } from "lucide-react";
import { AppContext } from "@/context/appContext";
import SyncStatus from "./SyncStatus";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/shad-dialog";
export default function PanelFooterControls() {
  const {board,setBoard,setIsSaved,saveDraft,discardDraft,mainPanelId,makeMainPanel,panelBusy,panelError,displayUrl}=useContext(AppContext);
  const [resetOpen,setResetOpen]=useState(false);
  const style="flex min-h-[44px] min-w-[44px] flex-1 flex-col items-center justify-center gap-1 rounded-md px-1 font-sans text-[10px] sm:text-xs font-semibold hover:bg-[var(--paper)] focus-visible:outline focus-visible:outline-2 disabled:opacity-40";
  const isMain=board?._id===mainPanelId && !!mainPanelId;
  return <div className="w-full">
    <div className="flex gap-1 items-center">
      <button className={style} onClick={()=>document.querySelector('[data-today-row="true"]')?.scrollIntoView({behavior:"smooth",block:"end"})} title="Scroll to today"><CalendarDays size={18}/>Today</button>
      {board?.isDraft?<>
        <button className={style} disabled={panelBusy} onClick={saveDraft}><Save size={18}/>Save panel</button>
        <button className={style} disabled={panelBusy} onClick={discardDraft}><X size={18}/>Discard</button>
      </>:<>
        <button className={style} disabled={!board||panelBusy} onClick={()=>setResetOpen(true)}><RotateCcw size={18}/>Reset</button>
        <button className={style} disabled={!board||panelBusy||isMain} onClick={makeMainPanel} title={isMain?"This panel supplies the display image":"Use this panel for the display image"}><Star size={18} fill={isMain?"currentColor":"none"}/>{isMain?"Main panel":"Make main"}</button>
      </>}
      <Link href="/generategoals" className={style}><Plus size={18}/>New panel</Link>
      {!board?.isDraft&&(displayUrl?<a href={displayUrl} target="_blank" rel="noreferrer" className={style} aria-label="View main panel display image"><ImageIcon size={18}/>View image</a>:<button className={style} disabled><ImageIcon size={18}/>View image</button>)}
    </div>
    {panelError?<p role="alert" className="text-xs text-center text-[var(--danger)] py-1">{panelError}</p>:panelBusy?<p role="status" className="text-xs text-center py-1">Updating panels…</p>:<SyncStatus/>}
    <Dialog open={resetOpen} onOpenChange={setResetOpen}><DialogContent><DialogHeader><DialogTitle>Reset this panel?</DialogTitle><DialogDescription>This clears this month’s marks in “{board?.goalToAchieve}”. Other panels are unchanged.</DialogDescription></DialogHeader><DialogFooter><button className="min-h-[44px] px-4" onClick={()=>setResetOpen(false)}>Cancel</button><button className="min-h-[44px] px-4 text-[var(--danger)]" onClick={()=>{setBoard(prev=>({...prev,cells:[]}));setIsSaved(false);setResetOpen(false);}}>Reset panel</button></DialogFooter></DialogContent></Dialog>
  </div>;
}
