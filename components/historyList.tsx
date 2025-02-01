"use client";

import { useEffect, useRef, useContext, useMemo } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { AppContext } from "../context/appContext";
import dayjs from "dayjs";

interface Item {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  year: string;
  month: string;
  goalToAchieve: string;
  habitsNames: string[];
  habitsValues: number[];
}

interface HistoryListProps {
  items?: Item[] | undefined;
}

function HistoryItem({ item, index }: { item: Item; index: number }) {
  const { board } = useContext(AppContext);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  // Optional logging for debugging
  useEffect(() => {
    console.log("board", board);
    console.log("item", item);
  }, [board, item]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { delay: index * 0.1 },
        },
      }}
    >
      <Link
        href={`/history/${board._id}?year=${item.year}&month=${item.month}&index=${index}`}
      >
        <Card>
          <CardHeader>
            <CardTitle>
              {item.month} - {item.year}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mt-2 mb-2 text-md font-bold text-muted-foreground">
              {item.goalToAchieve}
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
    </motion.div>
  );
}

export default function HistoryList({ items }: HistoryListProps) {
  const { setCurrentHistoryPanel, currentHistoryPanel } = useContext(AppContext);

  // Memoize filtered items so that the filtering is updated whenever items changes.
  const filteredItems = useMemo(
    () =>
      items?.filter(
        (item) => item.year && item.month !== dayjs().format("MMMM")
      ),
    [items]
  );

  // useEffect(() => {
  //   console.log("history", items);
  //   console.log("filteredItems", filteredItems);
  //   console.log("Current Month:", dayjs().format("MMMM"));
  //   console.log("Current Year:", dayjs().format("YYYY"));
  //   console.log("currentHistoryPanel", currentHistoryPanel);
  //   if (filteredItems && filteredItems.length > 0) {
  //     setCurrentHistoryPanel(filteredItems[0]);
  //   }
  // }, [filteredItems, currentHistoryPanel, items, setCurrentHistoryPanel]);

  return (
    <ScrollArea className="h-[calc(100vh-200px)]">
      {filteredItems && filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item, index) => (
            <HistoryItem key={item.id} item={item} index={index} />
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
