"use client";

import { useEffect, useRef, useContext, useMemo, useState } from "react";
import { motion, useAnimation, useInView, useReducedMotion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { AppContext } from "../context/appContext";
import dayjs from "dayjs";

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
  const stats = useMemo(() => {
    const habitsCount = item.habitsNames?.length || item.habitsValues?.length || 0;
    const monthRef = dayjs(`${item.month} 1, ${item.year}`);
    const daysInMonth = item.days || (monthRef.isValid() ? monthRef.daysInMonth() : 0);
    const totalSlots = habitsCount * daysInMonth;
    const cells = item.cells || [];
    let done = 0;
    let missed = 0;
    let unreviewed = 0;

    const activeCells = daysInMonth
      ? cells.filter((cell) => (cell.rowNr ? cell.rowNr <= daysInMonth : true))
      : cells;

    activeCells.forEach((cell) => {
      if (cell.isDone) {
        done += 1;
        return;
      }
      if (cell.isClear === false) {
        missed += 1;
        return;
      }
      unreviewed += 1;
    });

    if (totalSlots > 0) {
      const missing = Math.max(totalSlots - (done + missed + unreviewed), 0);
      unreviewed += missing;
    }

    return { done, missed, unreviewed, totalSlots };
  }, [item]);

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
            <div className="flex flex-col items-start gap-2">
              {item.habitsNames?.map((habit, i) => (
                <p key={i} className="flex gap-2 text-sm text-muted-foreground">
                  <span>{habit}</span>
                  <span className="ml-1">{item.habitsValues[i]}</span>
                </p>
              ))}
            </div>
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
