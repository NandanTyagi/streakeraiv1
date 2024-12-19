"use client";

import { useEffect, useRef, useContext, useState } from "react";
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
}

interface HistoryListProps {
  items?: Item[] | undefined;
}

function HistoryItem({ item, index }: { item: Item; index: number }) {
  const { cells, board, isAppLoading } = useContext(AppContext);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  useEffect(() => {
    console.log("board", board);
    console.log("item", item);
  }, [cells, board, item]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { delay: index * 0.1 } },
      }}
    >
      <Link href={`/panel/${board._id}?year=${item.year}&month=${item.month}`}>
        <Card>
          <CardHeader>
            <CardTitle>
              {item.month} - {item.year}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-md text-muted-foreground mt-2 mb-2 font-bold">
              {board.goalToAchieve}
            </div>
            <div key={index} className="flex items-center gap-2">
              {board &&
                board.habitsNames.map((habit, index) => (
                  <p
                    key={index}
                    className="  text-sm text-muted-foreground flex flex-col sm:flex-row sm:gap-2"
                  >
                    <span>{habit}</span>
                    <span className="text-xs">{board.habitsValues[index]}</span>
                    <span className="hidden sm:block">|</span>
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
  const [filteredItems, setFilteredItems] = useState(
    items?.filter(
      (item) =>
       item.year && item.month !== dayjs().format('MMMM') && item.year !== dayjs().format('YYYY')
    )
  );

  useEffect(() => {
    console.log("theItem", filteredItems);
    console.log('dayjs().month()', dayjs().month());
    console.log('dayjs().year()', dayjs().year());
  } , [filteredItems]);
  return (
    <ScrollArea className="h-[calc(100vh-200px)]">
      <div className="space-y-4 sm:pr-4">
        {filteredItems &&
          filteredItems?.map((item, index) => (
            <HistoryItem key={item.id} item={item} index={index} />
          ))}

        {!filteredItems?.length && (
          <div className="text-muted-foreground text-center">
            Your past history will be displayed here.
          </div>
        )}

      </div>
    </ScrollArea>
  );
}

