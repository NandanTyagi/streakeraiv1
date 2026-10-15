"use client";

import { useEffect, useState, useContext } from "react";
import { useSearchParams, useParams } from "next/navigation";
import { AppContext } from "@/context/appContext";
import fetchPanelById from "@/utils/v2/fetchPanelById";
import useV3Engine from "@/utils/useV3Engine";
import { loadBoardForMonth } from "@/utils/v3/loadBoardForMonth";
import dayjs from "dayjs";
import { useAppAuth } from "@/hooks/useAppAuth";
import StreakerHistoryGrid from "@/components/v1/StreakerHistoryGrid";
import Nav from "@/components/Nav";
import Loading from "@/components/Loading";

export default function HistoryPanelPage() {
  const searchParams = useSearchParams();
  const { id } = useParams();
  const year = searchParams.get("year");
  const month = searchParams.get("month");
  const { setCurrentHistoryPanel } = useContext(AppContext);
  const { user, isLoading } = useAppAuth();
  const email = user?.email;
  const isV3 = useV3Engine();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isLoading) return;
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError("");
      setItem(null);
      setCurrentHistoryPanel(undefined);
      try {
        const date = dayjs(`${month} 1, ${year}`);
        if (!id || !year || !month || !date.isValid()) throw new Error("Choose a valid history month.");
        if (!email) throw new Error("Please sign in to view your history.");
        let entry;
        if (isV3) {
          const panel = await loadBoardForMonth({userId: email, goalId: id,
            tz: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
            month: date.format("YYYY-MM")});
          entry = panel ? {...panel, year, month} : null;
        } else {
          const panel = await fetchPanelById(id);
          entry = panel?.history?.find(value => String(value.year) === year && value.month === month);
          if (!entry && panel && date.isSame(dayjs(), "month")) entry = {...panel, year, month};
        }
        if (!cancelled) {
          setItem(entry);
          setCurrentHistoryPanel(entry);
        }
      } catch {
        if (!cancelled) setError("History could not be loaded. Please reload to try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [id, year, month, email, isLoading, isV3, setCurrentHistoryPanel]);

  return <>
    <Nav isNav={false} isHistory currentHistoryItem={item} />
    {loading || isLoading ? <Loading /> : error || !item ?
      <p role="status" className="p-4">{error || "No history found for this panel and month."}</p> :
      <main className="overflow-y-scroll relative z-10">
        <StreakerHistoryGrid board={item} cells={item.cells || []} month={month} year={year} />
      </main>}
  </>;
}
