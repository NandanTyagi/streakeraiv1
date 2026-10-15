"use client";
import { useContext } from "react";
import { Layers } from "lucide-react";
import { AppContext } from "@/context/appContext";
export default function PanelSwitcher() {
  const {board,panels,draft,mainPanelId,selectPanel,panelBusy,panelError}=useContext(AppContext);
  return <><label className="flex items-center gap-2 min-w-0 w-full text-sm text-[var(--ink-soft)]">
    <Layers size={16} aria-hidden="true"/><span className="sr-only">Choose panel</span>
    <select aria-label="Choose panel" disabled={panelBusy} value={board?.isDraft?"draft":board?._id||""} onChange={event=>selectPanel(event.target.value)} className="min-h-[36px] w-full min-w-0 bg-transparent text-[var(--ink)] truncate">
      {!board&&<option value="">Choose a panel</option>}
      {panels.map(panel=><option key={panel.id} value={panel.id}>{panel.id===mainPanelId?"★ ":""}{panel.id===board?._id?board.goalToAchieve:panel.title}</option>)}
      {draft&&<option value="draft">Draft — {board?.isDraft?board.goalToAchieve:draft.goalToAchieve}</option>}
    </select>
  </label>{panelError&&<p role="alert" className="mt-2 text-sm text-[var(--danger)]">{panelError}</p>}</>;
}
