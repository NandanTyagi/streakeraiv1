"use client";

import { useEffect, useRef, useContext, useMemo, useState } from "react";
import { motion, useAnimation, useInView, useReducedMotion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { AppContext } from "../context/appContext";
import dayjs from "dayjs";
import { calculateHabitStats } from "@/utils/habitStats";

export interface Item {
  id?: string;
  year: string;
  month: string;
  goalToAchieve: string;
  habitsNames: string[];
  habitsValues: string[];
  days?: number;
  cells?: Array<{
    rowNr?: number;
    colNr?: number;
    isDone?: boolean;
    isClear?: boolean;
  }>;
}

interface HistoryListProps {
  items?: Item[] | undefined;
}

function HistoryItem({ item, index }: { item: Item; index: number }) {
  const { board, deleteHistoryMonth, panelBusy } = useContext(AppContext);
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const monthKey = dayjs(`${item.month} 1, ${item.year}`).format("YYYY-MM");
  const canDelete = monthKey < dayjs().format("YYYY-MM");
  async function removeMonth() {
    setDeleting(true); setError("");
    try { await deleteHistoryMonth(monthKey); setConfirming(false); }
    catch (error) { setError(error instanceof Error ? error.message : "The month could not be deleted."); }
    finally { setDeleting(false); }
  }
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const controls = useAnimation();
  const reduceMotion = useReducedMotion();
  const habitStats = useMemo<Array<{colNr: number; headerName: string; isDone: number; missed: number; unreviewed: number}>>(() => calculateHabitStats(item), [item]);
  const stats = useMemo(() => habitStats.reduce((total, habit) => ({
    done: total.done + habit.isDone,
    missed: total.missed + habit.missed,
    unreviewed: total.unreviewed + habit.unreviewed,
  }), {done: 0, missed: 0, unreviewed: 0}), [habitStats]);

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  return (
    <motion.div
      ref={ref}
      initial={reduceMotion ? "visible" : "hidden"}
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 6 },
        visible: {
          opacity: 1,
          y: 0,
          transition: reduceMotion ? { duration: 0 } : { delay: index * 0.1, duration: 0.25 },
        },
      }}
    >
      <Link
        href={`/history/${board._id}?year=${item.year}&month=${item.month}`}
      >
        <Card>
          <CardHeader>
            <CardTitle>
              {item.month} - {item.year}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mt-2 mb-2 text-base font-semibold text-muted-foreground">
              {item.goalToAchieve}
            </div>
            <div className="mb-3 grid grid-cols-3 gap-2 text-xs font-semibold">
              <div className="rounded-md border border-[var(--surface-border)] bg-[var(--success-veil)] px-2 py-1 text-center text-[var(--success)]">
                Done {stats.done}
              </div>
              <div className="rounded-md border border-[var(--surface-border)] bg-[var(--danger-veil)] px-2 py-1 text-center text-[var(--danger)]">
                Missed {stats.missed}
              </div>
              <div className="rounded-md border border-[var(--surface-border)] bg-[var(--paper-veil)] px-2 py-1 text-center text-[var(--ink)]">
                Unreviewed {stats.unreviewed}
              </div>
            </div>
            <table className="w-full table-fixed text-[10px] tabular-nums">
              <caption className="sr-only">Daily counts for each habit in {item.month} {item.year}</caption>
              <thead>
                <tr>
                  <th scope="col" className="w-[22%] text-left py-2 pr-1 font-medium text-[var(--ink-soft)]">Status</th>
                  {habitStats.map((habit, i) => (
                    <th key={habit.colNr} scope="col" className="px-1 py-2 align-top text-center font-semibold [overflow-wrap:anywhere]">
                      {habit.headerName}
                      <span className="block mt-1 text-[9px] font-normal text-[var(--ink-soft)]">{item.habitsValues?.[i]}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-[var(--surface-border)]">
                  <th scope="row" className="py-3 pr-1 text-left font-medium">Done</th>
                  {habitStats.map(habit => <td key={habit.colNr} className="px-1 text-center text-xs font-semibold text-[var(--success)]">{habit.isDone}</td>)}
                </tr>
                <tr className="border-t border-[var(--surface-border)]">
                  <th scope="row" className="py-3 pr-1 text-left font-medium">Missed</th>
                  {habitStats.map(habit => <td key={habit.colNr} className="px-1 text-center text-xs font-semibold text-[var(--danger)]">{habit.missed}</td>)}
                </tr>
                <tr className="border-t border-[var(--surface-border)]">
                  <th scope="row" className="py-3 pr-1 text-left text-[9px] font-medium">Unreviewed</th>
                  {habitStats.map(habit => <td key={habit.colNr} className="px-1 text-center text-xs text-[var(--ink-soft)]">{habit.unreviewed}</td>)}
                </tr>
              </tbody>
            </table>
          </CardContent>
        </Card>
      </Link>
      {canDelete && <div className="mt-2 px-2">
        {confirming ? <div role="group" aria-label={`Delete ${item.month} ${item.year}`} className="rounded-md border border-[var(--surface-border)] p-3">
          <p className="text-sm">Delete {item.month} {item.year} from this panel? Its marks and notes will be removed from history and statistics. This cannot be undone in the app.</p>
          <div className="flex flex-wrap gap-3 mt-2">
            <button type="button" disabled={panelBusy} onClick={removeMonth} className="min-h-[44px] px-3 rounded border border-[var(--danger)] text-[var(--danger)] disabled:opacity-50">{deleting ? "Deleting..." : "Delete month"}</button>
            <button type="button" disabled={deleting} onClick={()=>{setConfirming(false);setError("");}} className="min-h-[44px] px-3 underline">Cancel</button>
          </div>
        </div> : <button type="button" disabled={panelBusy} onClick={()=>setConfirming(true)} aria-label={`Delete ${item.month} ${item.year}`} className="min-h-[44px] px-3 text-sm text-[var(--danger)] underline disabled:opacity-50">Delete month</button>}
        {error && <p role="alert" className="text-sm text-[var(--danger)]">{error}</p>}
      </div>}
    </motion.div>
  );
}

export default function HistoryList({ items }: HistoryListProps) {
  const { setCurrentHistoryPanel, currentHistoryPanel } = useContext(AppContext);

  const filteredItems = useMemo(() => [...(items || [])]
    .filter(item => item.year && item.month)
    .sort((a, b) => dayjs(`${b.month} 1, ${b.year}`).valueOf() - dayjs(`${a.month} 1, ${a.year}`).valueOf()), [items]);

  return (
    <ScrollArea className="h-[calc(100vh-200px)]">
      {filteredItems && filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item, index) => (
            <HistoryItem key={`${item.year}-${item.month}`} item={item} index={index} />
          ))}
        </div>
      ) : (
        <div className="text-center text-muted-foreground">
          Your past history will be displayed here.
        </div>
      )}
    </ScrollArea>
  );
}
