"use client";

import React, { useContext, useEffect, useState } from "react";
import dayjs from "dayjs";

import { AppContext } from "@/context/appContext";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

import styles from "../../styles/StreakerGrid.module.css";

import StreakerGridHeaders from "../../components/StreakerGridHeaders";
import StreakerGridRow from "../StreakerGridRow";
import Loading from "@/components/Loading";

import getDaysInMonth from "@/utils/getDaysInMonth";
import getDayTagArray from "@/utils/getDayTagArray";

interface Cell {
  id: string;
  isDone: boolean;
  isClear: boolean;
  comment?: string;
}

interface Board {
  _id?: string;
  goalToAchieve?: string;
  habitsNames?: string[];
  habitsValues?: string[];
  days?: number;
  history?: Array<{
    year: string;
    month: string;
    cells: Cell[];
  }>;
  // etc...
}

interface StreakerHistoryGridProps {
  board: Board;
  cells: Cell[]; // these are the "history" cells we want to display
  month?: string;
}

const StreakerHistoryGrid: React.FC<StreakerHistoryGridProps> = ({
  board,
  cells,
  month
}) => {
  const { isAppLoading } = useContext(AppContext);
  const { isLoading, user } = useKindeBrowserClient();

  // Local state for cells (optional if you need to modify them)
  const [cellsArray, setCellsArray] = useState<Cell[]>(cells || []);
  // If the `cells` prop changes, sync up:
  useEffect(() => {
    setCellsArray(cells || []);
    // console.log("Cells array in History GRID:", cellsArray);
  }, [cells]);

  // If you have habits at the board level
  const habits = board?.habitsNames || Array.from({ length: 5 });
  
  // Just an example of how you might decide how many days to show:
  // If your board has a "days" field, you can use it.
  // Otherwise, you might default to the current month, etc.
  const days = board?.days ?? getDaysInMonth(new Date());
  const tagArr = getDayTagArray(new Date());

  if (isAppLoading || isLoading) {
    return <Loading />;
  }

  return (
    <>
      <section className={styles.streakerGrid}>
        <StreakerGridHeaders isHistory month={month} />
      </section>

      <section className={styles.streakerGrid}>
        {Array.from({ length: days }).map((_, dayIndex) => {
          const today = dayjs().format("D");

          // For each day row, we map across the habits columns
          const cellProps = habits.map((_, colIndex) => {
            const cellId = `${dayIndex + 1}-${colIndex + 1}`;
            // find a matching cell in your 161 cells, for example
            const cell = cellsArray.find((c) => c.id === cellId);

            return {
              rowNr: dayIndex + 1,
              colNr: colIndex + 1,
              isDone: cell?.isDone ?? false,
              isClear: cell?.isClear ?? true,
              message: cell?.comment,
              isToday: dayIndex + 1 === Number(today),
              cell,
            };
          });

          return (
            <StreakerGridRow
              key={dayIndex}
              nr={dayIndex + 1}
              cells={cellProps}
              day={tagArr[dayIndex]}
              user={user}
              isLoading={isLoading}
              board={board}
              habits={habits}
              isHistory
              onCellSelect={() => {}}
            />
          );
        })}
      </section>
    </>
  );
};

export default StreakerHistoryGrid;
