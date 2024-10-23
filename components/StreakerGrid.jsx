"use client";

import React, { useContext } from "react";
import styles from "../styles/StreakerGrid.module.css";
import StreakerGridHeaders from "../components/StreakerGridHeaders";
import StreakerGridItem from "./StreakerGridItem";
import Loading from "@/components/Loading";
import { AppContext } from "@/context/appContext";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { get } from "http";

const StreakerGrid = () => {
  const { board, isAppLoading } = useContext(AppContext);
  const { isLoading } = useKindeBrowserClient();
  const days = getDaysInMonth(new Date());
  const habits = board?.habitsNames || [];

  return (
    <>
      <section className={`${styles.streakerGrid}`}>
        <StreakerGridHeaders />
      </section>
      <section className={styles.streakerGrid}>
        {isAppLoading ? <Loading /> :
          Array.from({ length: days }).map((item, i) =>
            habits.map((habit, j) => {
              console.log("habit***********************", habit);
              const cell = board?.cells?.find(
                (c) => c.rowId === i + 1 && c.columnId === j + 1
              );
              return (
                <StreakerGridItem
                  key={`${i}-${j}`}
                  type={j % 8 === 0 ? "nr" : ""}
                  rowNr={i + 1}
                  colNr={j + 1}
                  isDone={cell?.isDone}
                  isClear={cell?.isClear}
                  message={cell?.message}
                  label={habit}
                />
              );
            })
          )}
      </section>
    </>
  );
};

export default StreakerGrid;



// import React, { Suspense } from "react";
// import styles from "../styles/StreakerGrid.module.css";
// import StreakerGridHeaders from "../components/StreakerGridHeaders";
// import { useEffect, useState, useContext } from "react";
// import { AppContext } from "@/context/appContext";
// import StreakerGridItem from "./StreakerGridItem";
// import generateEmptyBoard from "@/utils/generateEmptyBoard";
// import Loading from "@/components/Loading";
// import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

// const StreakerGrid = () => {
//   const { cells, board, setBoard, setCells, isAppLoading } =
//   useContext(AppContext);
//   const { isAuthenticated, isLoading, user } = useKindeBrowserClient();
//   const days = (board && board.days) || 31;
//   let habits = (board && board.habitsNames) ;

//   useEffect(() => {
//      habits = (board && board.habitsNames) ;
//   }, [board]);


//   return (
//     <>
//       <section className={styles.streakerGrid}>
//         <StreakerGridHeaders />
//       </section>
//       <section className={styles.streakerGrid}>
//         {/* {isLoading && <Loading />} */}
//         {isAppLoading ? <Loading /> :
  
//           Array.from({ length: days }).map((item, i) =>
//             habits.map((habit, j) => {
//               const cell = board?.cells?.find(
//                 (c) => c.rowId === i + 1 && c.columnId === j + 1
//               );
//               return isLoading ? <Loading /> : (
//                 <StreakerGridItem
//                   key={`${i}-${j}`}
//                   type={j % 8 === 0 ? "nr" : ""}
//                   rowNr={i + 1}
//                   colNr={j + 1}
//                   isDone={cell?.isDone}
//                   isClear={cell?.isClear}
//                   message={cell?.message}
//                 />
//               );
//             })
//           )}
    
//       </section>
//     </>
//   );
// };

// export default StreakerGrid;
