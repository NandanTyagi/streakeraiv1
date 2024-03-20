"use client";

import React, { use, useContext, useEffect, useState } from "react";
import styles from "../../styles/StreakerGrid.module.css";
import StreakerGridHeaders from "../../components/StreakerGridHeaders";
import StreakerGridRow from "../StreakerGridRow";
import Loading from "@/components/Loading";
import { AppContext } from "@/context/appContext";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import dayjs from "dayjs";
import getDaysInMonth from "@/utils/getDaysInMonth";
import getDayTagArray from "@/utils/getDayTagArray";
import { late } from "zod";
import fetchPanels from "@/utils/v2/fetchPanels.js";
import fetchUser from "@/utils/v2/fetchUser";
import StreakerGrid from "@/components/v1/StreakerGrid";

const StreakerEmptyGrid = () => {
  const { cells, board, isAppLoading } = useContext(AppContext);
  const { isLoading, user } = useKindeBrowserClient();
  const [cellsArray, setCellsArray] = useState([]);
  const habits = board?.habitsNames || [];
  const days = getDaysInMonth(new Date());
  const tagArr = getDayTagArray(new Date(), days);

  useEffect(() => {
    const fetchUsersFromDb = async () => {
      const userFromDb = await fetchUser();
      console.log("user from Db in EMPTY streaker grid", userFromDb);
    };
    fetchUsersFromDb();
  }, []);

  // const panels = await fetchPanels();
  // const userFromDb = await fetchUser(user?.email);
  // console.log("panels", panels);
  // console.log("user from Db", userFromDb);

  useEffect(() => {
    const date = dayjs();
    // console.log("Board date:", date);
    // console.log("Board Days Tag arr:", tagArr);
    setCellsArray(board?.cells || []);
  }, [board]);

  if (isAppLoading || isLoading) {
    return <Loading />;
  }


    return (
      <>
        <section className={styles.streakerGrid}>
          <StreakerGridHeaders />
        </section>
        <section className={styles.streakerGrid}>
          {Array.from({ length: days }).map((_, dayIndex) => {
            const today = dayjs().format("D");

            // Prepare cell data for each column in the row
            const cellProps = habits.map((_, colIndex) => {
              const cell = cellsArray.find(
                (c) => c.rowNr === dayIndex + 1 && c.colNr === colIndex + 1
              );
              return {
                rowNr: dayIndex + 1,
                colNr: colIndex + 1,
                isDone: cell?.isDone,
                isClear: cell?.isClear,
                message: cell?.comment || "",
                isToday: dayIndex + 1 === today,
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
              />
            );
          })}
        </section>
      </>
    );
};

export default StreakerEmptyGrid;
