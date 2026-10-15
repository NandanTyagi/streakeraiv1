"use client";

import { useEffect, useRef, useContext, useMemo, useState } from "react";
import { motion, useAnimation, useInView, useReducedMotion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
        <Card className="min-h-0 justify-start overflow-hidden">
          <CardHeader className="p-4 pb-2 sm:p-5 sm:pb-2">
            <CardTitle className="text-xl leading-tight">
              {item.month} {item.year}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 sm:p-5 sm:pt-0">
            <div className="mb-3 text-sm leading-relaxed text-[var(--ink-soft)]">
              {item.goalToAchieve}
            </div>
            <div className="mb-4 flex flex-wrap gap-x-4 gap-y-1 text-xs [font-family:var(--font-sans)]">
              <span className="text-[var(--success)]"><strong>{stats.done}</strong> done</span>
              <span className="text-[var(--danger)]"><strong>{stats.missed}</strong> missed</span>
              <span className="text-[var(--ink-soft)]"><strong>{stats.unreviewed}</strong> unreviewed</span>
            </div>
            <table className="w-full table-fixed text-sm tabular-nums [font-family:var(--font-sans)]">
              <caption className="sr-only">Daily counts for each habit in {item.month} {item.year}</caption>
              <colgroup><col className="w-[38%]"/><col className="w-[18%]"/><col className="w-[18%]"/><col className="w-[26%]"/></colgroup>
              <thead>
                <tr className="border-b border-[var(--surface-border)] text-[10px] sm:text-xs text-[var(--ink-soft)]">
                  <th scope="col" className="pb-2 pr-2 text-left font-medium">Habit</th>
                  <th scope="col" className="pb-2 text-center font-medium">Done</th>
                  <th scope="col" className="pb-2 text-center font-medium">Missed</th>
                  <th scope="col" className="pb-2 text-right font-medium">Unreviewed</th>
                </tr>
              </thead>
              <tbody>
                {habitStats.map((habit, i) => (
                  <tr key={habit.colNr} className="border-b border-[var(--surface-border)] last:border-0">
                    <th scope="row" className="py-3 pr-2 text-left font-medium [overflow-wrap:anywhere]">
                      {habit.headerName}
                      <span className="mt-0.5 block text-xs font-normal text-[var(--ink-soft)]">{item.habitsValues?.[i]}</span>
                    </th>
                    <td className="text-center font-semibold text-[var(--success)]">{habit.isDone}</td>
                    <td className="text-center font-semibold text-[var(--danger)]">{habit.missed}</td>
                    <td className="text-right text-[var(--ink-soft)]">{habit.unreviewed}</td>
                  </tr>
                ))}
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

  const filteredItems = useMemo(() => [...(items || [])]
    .filter(item => item.year && item.month)
    .sort((a, b) => dayjs(`${b.month} 1, ${b.year}`).valueOf() - dayjs(`${a.month} 1, ${a.year}`).valueOf()), [items]);

  return (
    <div>
      {filteredItems && filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredItems.map((item, index) => (
            <HistoryItem key={`${item.year}-${item.month}`} item={item} index={index} />
          ))}
        </div>
      ) : (
        <div className="text-center text-muted-foreground">
          Your past history will be displayed here.
        </div>
      )}
    </div>
  );
}
