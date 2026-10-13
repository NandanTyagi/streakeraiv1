"use client";
import { useContext } from "react";
import { AppContext } from "@/context/appContext";
import HeaderItem from "./HeaderItem";
import dayjs from "dayjs";
export default function StreakerGridHeaders({isHistory,month}) {
  const {board,currentHistoryPanel}=useContext(AppContext);
  const panel=isHistory?currentHistoryPanel:board;
  return <>
    <div className="flex flex-col justify-center items-center text-[0.7rem] sm:text-[0.85rem]"><strong className="text-[0.75rem] uppercase tracking-[0.22em]">{isHistory?(month||currentHistoryPanel?.month)?.slice(0,3):dayjs().format("MMM")}</strong></div>
    {panel?.habitsNames?.map((name,i)=><HeaderItem key={`${panel?._id||panel?.draftId||"history"}-${i}`} column={i} description={name} value={panel.habitsValues?.[i]||""} isHistory={isHistory}/>)}
  </>;
}
