"use client";
import Link from "next/link";
import { useContext } from "react";
import { ArrowLeft, ChartNoAxesCombined } from "lucide-react";
import { AppContext } from "@/context/appContext";
import DialogButton from "@/components/ui/Dialog";
import PanelSwitcher from "./v1/PanelSwitcher";
import { useAppAuth } from "@/hooks/useAppAuth";
import { RegisterLink } from "@/components/auth/AuthLinks";
export default function Nav({isNav=true,isHistory,currentHistoryItem}) {
  const {board,setBoard,setIsSaved}=useContext(AppContext);
  const {user}=useAppAuth();
  if(isNav)return <nav className="flex gap-6 p-4"><Link href="/generategoals">Identify</Link><Link href="/panel">Track</Link></nav>;
  return <div className="panel-header bg-[var(--paper-veil)] border-b border-[var(--surface-border)] px-4 py-2">
    {isHistory?<div className="flex justify-between mb-1"><Link href="/history" aria-label="Back to history"><ArrowLeft size={18}/></Link><Link href="/history/dashboard" aria-label="History dashboard"><ChartNoAxesCombined size={18}/></Link></div>:user&&<PanelSwitcher/>}
    <div className="flex justify-center min-w-0 font-semibold">
      {!user?<RegisterLink>Sign up to preserve the ledger</RegisterLink>:board||isHistory?<DialogButton value={isHistory?currentHistoryItem?.goalToAchieve:board?.goalToAchieve||""} isHistory={isHistory} onChange={event=>{const value=event.target.value;setBoard(prev=>({...prev,goalToAchieve:value}));setIsSaved(false);}}/>:<span className="py-2">Create your first panel</span>}
    </div>
  </div>;
}
