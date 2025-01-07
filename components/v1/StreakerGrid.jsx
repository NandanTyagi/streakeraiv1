"use client";

import React, { useContext, useEffect, useState } from "react";
import styles from "../../styles/StreakerGrid.module.css";
import StreakerGridHeaders from "../../components/StreakerGridHeaders";
import StreakerGridRow from "../StreakerGridRow";
import Loading from "@/components/Loading";
import { AppContext } from "@/context/appContext";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import dayjs from "dayjs";
import getDaysInMonth from "@/utils/getDaysInMonth";
import getDayTagArray from "@/utils/getDayTagArray";
import fetchUser from "@/utils/v2/fetchUser";
import getCurrentUserBoardFromDb from "@/utils/getCurrentUserBoardFromDb";

const StreakerGrid = () => {
  const { cells, board, isAppLoading } = useContext(AppContext);
  const { isLoading, user } = useKindeBrowserClient();
  const [cellsArray, setCellsArray] = useState(board?.cells || []);
  const [currentCellIndexLocal, setCurrentCellIndexLocal] = useState(null);
  const habits = board?.habitsNames || Array.from({ length: 5 });
  const days = getDaysInMonth(new Date());
  const tagArr = getDayTagArray(new Date(), days);

  useEffect(() => {
    const fetchUsersFromDb = async () => {
      const userFromDb = await fetchUser();
      console.log("user from Db in NOT EMPTY streaker grid", userFromDb);
      console.log("board from Db in NOT EMPTY streaker grid", board);
      setCellsArray(await getCurrentUserBoardFromDb(userFromDb.email).cells);
      return userFromDb;
    };
    if (board) {
      fetchUsersFromDb();
    }
  }, [board]);

  useEffect(() => {
    const date = dayjs();
    // console.log("Board date:", date);
    // console.log("Board Days Tag arr:", tagArr);
    // console.log("Board", board);
  }, [board]);

  useEffect(() => {
    console.log("Board####################### in GRID:", board);
  }, [board]);

  return (
    <>
      {isAppLoading || isLoading ? (
        <Loading />
      ) : (
        <>
          <section className={`${styles.streakerGrid}`}>
            <StreakerGridHeaders />
          </section>
          <section className={styles.streakerGrid}>
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
                  key={dayIndex}
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
