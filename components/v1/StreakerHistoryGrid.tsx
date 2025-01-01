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

interface Cell {
  id: string;
  isDone: boolean;
  isClear: boolean;
  comment?: string;
}

interface Board {
  cells: Cell[];
  habitsNames: string[];
}

interface StreakerHistoryGridProps {
  board: Board;
}

const StreakerHistoryGrid: React.FC<StreakerHistoryGridProps> = ({ board }) => {
  const { isAppLoading } = useContext(AppContext);
  const { isLoading, user } = useKindeBrowserClient();

  const [cellsArray, setCellsArray] = useState<Cell[]>(board?.cells || []);
  const [currentCellIndexLocal, setCurrentCellIndexLocal] = useState<number | null>(null);

  // We’ll keep using the habits from the prop unless you have a reason to fetch them too
  const habits = board?.habitsNames || Array.from({ length: 5 });

  const days = getDaysInMonth(new Date());
  const tagArr = getDayTagArray(new Date());

  useEffect(() => {
    if (!board) {
      console.warn("No board prop was passed in!");
      return;
    }

    const fetchUsersFromDb = async () => {
      try {
        console.log("Attempting to fetch user from DB...");
        const userFromDb = await fetchUser();
        if (!userFromDb) {
          console.error("No user returned from fetchUser() in production!");
          return;
        }
        console.log("userFromDb:", userFromDb);

        console.log("Now fetching current user's board from DB...");
        const userBoard = await getCurrentUserBoardFromDb(userFromDb.email);

        if (!userBoard || !userBoard.cells) {
          console.warn(
            "userBoard is empty or undefined. Possibly no board found for this user in production."
          );
        } else {
          console.log("Successfully fetched userBoard:", userBoard);
        }

        setCellsArray(userBoard?.cells || []);
      } catch (error) {
        console.error("Error while fetching user or board from DB:", error);
      }
    };

    fetchUsersFromDb();
  }, [board]);

  // Additional logs if you need them:
  useEffect(() => {
    console.log("Board prop changed. board:", board);
  }, [board]);

  return (
    <>
      {isAppLoading || isLoading ? (
        <Loading />
      ) : (
        <>
          <section className={styles.streakerGrid}>
            <StreakerGridHeaders isHistory />
          </section>

          <section className={styles.streakerGrid}>
            {Array.from({ length: days }).map((_, dayIndex) => {
              const today = Number(dayjs().format("D"));

              // Render using cellsArray
              const cellProps = habits.map((_, colIndex) => {
                const cellId = `${dayIndex + 1}-${colIndex + 1}`;
                const cell = cellsArray.find((c) => c.id === cellId);

                return {
                  rowNr: dayIndex + 1,
                  colNr: colIndex + 1,
                  isDone: cell?.isDone ?? false,
                  isClear: cell?.isClear ?? true,
                  message: cell?.comment,
                  isToday: dayIndex + 1 === today,
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
                  onCellSelect={(index: number | null) => setCurrentCellIndexLocal(index)}
                  board={board}
                  habits={habits}
                  isHistory
                />
              );
            })}
          </section>
        </>
      )}
    </>
  );
};

export default StreakerHistoryGrid;
















// "use client";

// import React, { useContext, useEffect, useState } from "react";
// import styles from "../../styles/StreakerGrid.module.css";
// import StreakerGridHeaders from "../../components/StreakerGridHeaders";
// import StreakerGridRow from "../StreakerGridRow";
// import Loading from "@/components/Loading";
// import { AppContext } from "@/context/appContext";
// import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
// import dayjs from "dayjs";
// import getDaysInMonth from "@/utils/getDaysInMonth";
// import getDayTagArray from "@/utils/getDayTagArray";
// import fetchUser from "@/utils/v2/fetchUser";
// import getCurrentUserBoardFromDb from "@/utils/getCurrentUserBoardFromDb";

// interface Board {
//   cells: Array<{ id: string; isDone: boolean; isClear: boolean; comment?: string }>;
//   habitsNames: string[];
// }

// interface StreakerHistoryGridProps {
//   board: Board;
//   cells: any;
// }

// const StreakerHistoryGrid: React.FC<StreakerHistoryGridProps> = ({ board, cells }) => {
//   const { isAppLoading } = useContext(AppContext);
//   const { isLoading, user } = useKindeBrowserClient();
//   const [cellsArray, setCellsArray] = useState(board?.cells || []);
//   const [currentCellIndexLocal, setCurrentCellIndexLocal] = useState<number | null>(null);
//   const habits = board?.habitsNames || Array.from({ length: 5 });
//   const days = getDaysInMonth(new Date());
//   const tagArr = getDayTagArray(new Date());

//   useEffect(() => {
//     const fetchUsersFromDb = async () => {
//       const userFromDb = await fetchUser();
//       console.log("user from Db in NOT EMPTY streaker grid", userFromDb);
//       console.log("board from Db in NOT EMPTY streaker grid", board);
//       const userBoard = await getCurrentUserBoardFromDb(userFromDb.email);
//       setCellsArray(userBoard.cells);
//       return userFromDb;
//     };
//     if (board) {
//       fetchUsersFromDb();
//     }
//   }, [board]);

//   useEffect(() => {
//     const date = dayjs();
//     // console.log("Board date:", date);
//     // console.log("Board Days Tag arr:", tagArr);
//     // console.log("Board", board);
//   }, [board]);

//   useEffect(() => {
//     console.log("Board####################### in History GRID:", board);
//   }, [board]);

//   return (
//     <>
//       {isAppLoading || isLoading ? (
//         <Loading />
//       ) : (
//         <>
//           <section className={styles.streakerGrid}>
//             <StreakerGridHeaders isHistory />
//           </section>
//           <section className={styles.streakerGrid}>
//             {Array.from({ length: days }).map((_, dayIndex) => {
//               const today = dayjs().format("D");

//               // Prepare cell data for each column in the row
//               const cellProps = habits.map((_, colIndex) => {
//                 // const cell = board?.cells?.find(
//                 const cell = cellsArray.find(
//                   (c) => c.id === `${dayIndex + 1}-${colIndex + 1}`
//                 );
//                 return {
//                   rowNr: dayIndex + 1,
//                   colNr: colIndex + 1,
//                   isDone: cell ? cell.isDone : false,
//                   isClear: cell ? cell.isClear : true,
//                   message: cell?.comment,
//                   isToday: dayIndex + 1 === Number(today),
//                   cell: cell,
//                 };
//               });

//             interface CellProps {
//                 rowNr: number;
//                 colNr: number;
//                 isDone: boolean;
//                 isClear: boolean;
//                 message?: string;
//                 isToday: boolean;
//                 cell?: {
//                     id: string;
//                     isDone: boolean;
//                     isClear: boolean;
//                     comment?: string;
//                 };
//             }

//             interface StreakerGridRowProps {
//                 key: number;
//                 nr: number;
//                 cells: CellProps[];
//                 day: string;
//                 user: any;
//                 isLoading: boolean;
//                 onCellSelect: (index: number | null) => void;
//                 board: Board;
//                 habits: string[];
//             }

//             return (
//                 <StreakerGridRow
//                     key={dayIndex}
//                     nr={dayIndex + 1}
//                     cells={cellProps}
//                     day={tagArr[dayIndex]}
//                     user={user}
//                     isLoading={isLoading}
//                     onCellSelect={(index: number | null) => setCurrentCellIndexLocal(index)}
//                     board={board}
//                     habits={habits}
//                     isHistory
//                 />
//             );
//             })}
//           </section>
//         </>
//       )}
//     </>
//   );
// };

// export default StreakerHistoryGrid;
