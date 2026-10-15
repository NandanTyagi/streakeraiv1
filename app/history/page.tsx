"use client";
import { useContext } from "react";
import HistoryList, { type Item } from "@/components/historyList";
import { AppContext } from "@/context/appContext";
import dayjs from "dayjs";
export default function HistoryPage() {
  const { board, isAppLoading, panelError } = useContext(AppContext);
  const panel = board as (Partial<Item> & { _id: string; isDraft?: boolean; history?: Item[] }) | undefined;
  const year = dayjs().format("YYYY");
  const month = dayjs().format("MMMM");
  const items: Item[] = panel && !panel.isDraft ? [
    { ...panel, id: `${panel._id}-${year}-${month}`, year, month, goalToAchieve: panel.goalToAchieve || "", habitsNames: panel.habitsNames || [], habitsValues: panel.habitsValues || [] },
    ...(panel.history || []).filter(item => !(item.year === year && item.month === month)),
  ] : [];
  return <main className="container mx-auto py-10 px-4 bg-[var(--paper)]">
    <h1 className="text-3xl font-semibold text-center mb-8 text-[var(--ink)]">My History</h1>
    {panelError && <p role="alert">{panelError}</p>}
    {isAppLoading ? <p>Loading history…</p> : <HistoryList items={items} />}
  </main>;
}
