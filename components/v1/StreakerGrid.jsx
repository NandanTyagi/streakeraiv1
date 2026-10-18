"use client";

import React, { useContext, useEffect, useState } from "react";
import styles from "../../styles/StreakerGrid.module.css";
import StreakerGridHeaders from "../../components/StreakerGridHeaders";
import StreakerGridRow from "../StreakerGridRow";
import Loading from "@/components/Loading";
import { AppContext } from "@/context/appContext";
import { useAppAuth } from "@/hooks/useAppAuth";
import dayjs from "dayjs";
import getDaysInMonth from "@/utils/getDaysInMonth";
import getDayTagArray from "@/utils/getDayTagArray";
import fetchUser from "@/utils/v2/fetchUser";
import getCurrentUserBoardFromDb from "@/utils/getCurrentUserBoardFromDb";
import useMobileGridFit from "@/hooks/useMobileGridFit";

const StreakerGrid = () => {
  const { cells, board, isAppLoading } = useContext(AppContext);
  const { isLoading, user } = useAppAuth();
  const [cellsArray, setCellsArray] = useState(board?.cells || []);
  const [currentCellIndexLocal, setCurrentCellIndexLocal] = useState(null);
  const habits = board?.habitsNames || Array.from({ length: 5 });
  const days = getDaysInMonth(new Date());
  const tagArr = getDayTagArray(new Date(), days);

  useMobileGridFit({ fitDesktop: true });

  if (!board && !isAppLoading && !isLoading) return <p className="p-6 text-center text-sm">Choose New panel to create your first set of practices.</p>;

  return (
    <>
      {isAppLoading || isLoading ? (
        <Loading />
      ) : (
        <>
          <section className={`${styles.streakerGrid}`} data-role="streaker-grid" style={{ "--practice-count": habits.length || 5 }}>
            <StreakerGridHeaders />
          </section>
          <section className={styles.streakerGrid} data-role="streaker-grid" style={{ "--practice-count": habits.length || 5 }}>
            {Array.from({ length: days }).map((_, dayIndex) => {
              const today = dayjs().format("D");

              // Prepare cell data for each column in the row
              const cellProps = habits.map((_, colIndex) => {
                const cell = board?.cells?.find(
                  (c) => c.id === `${dayIndex + 1}-${colIndex + 1}`
                );
                return {
                  rowNr: dayIndex + 1,
                  colNr: colIndex + 1,
                  isDone: cell ? cell.isDone : false,
                  isClear: cell ? cell.isClear : true,
                  message: cell?.comment,
                  isToday: dayIndex + 1 === today,
                  cell: cell,
                };
              });

              return (
                <StreakerGridRow
                  key={`${board?._id || board?.draftId}-${dayIndex}`}
                  nr={dayIndex + 1}
                  cells={cellProps}
                  day={tagArr[dayIndex]}
                  user={user}
                  isLoading={isLoading}
                  onCellSelect={(index) => setCurrentCellIndexLocal(index)}
                  board={board}
                  habits={habits}
                />
              );
            })}
          </section>
        </>
      )}
    </>
  );
};

export default StreakerGrid;
