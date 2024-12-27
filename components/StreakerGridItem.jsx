"use client";

import Image from "next/image";
import styles from "../styles/StreakerGridItem.module.css";
import { useState, useEffect, useContext, useRef } from "react";
import { AppContext } from "@/context/appContext";
import dayjs from "dayjs";
import handelDbCells from "../utils/handelDbCells";

const StreakerGridItem = ({
  type,
  isDone,
  isClear,
  message,
  rowNr,
  colNr,
  isToday,
  day,
  user,
  isLoading,
  cell,
  label,
  board,
  onCellClick,
  isHistory,
}) => {
  const {
    setBoard,
    setCells,
    isCellLoading,
    setIsCellLoading,
    isAppLoading,
    isSaved,
    setIsSaved,
  } = useContext(AppContext);

  const [isDoneLocal, setIsDoneLocal] = useState(isDone);
  const [isClearLocal, setIsClearLocal] = useState(isClear);
  const [messageLocal, setMessageLocal] = useState(message);
  const [clickTimeout, setClickTimeout] = useState(null);
  const [todaysDate, settodaysDate] = useState(dayjs().format("D"));
  const [isTodayLocal, setIsTodayLocal] = useState(isToday);
  const [labelLocal, setLabelLocal] = useState(label);
  const [timer, setTimer] = useState(null);

  // Find the current cell index from the board
  const currentCellIndexLocal = board?.cells?.findIndex(
    (cell) => cell.id === `${rowNr}-${colNr}`
  );

  const todayRef = useRef(null);

  useEffect(() => {
    if (currentCellIndexLocal == null || currentCellIndexLocal < 0) return;
    const setCurrentCellLabelToCorespondingHabitName = () => {
      const habits = board?.habitsNames;
      if (!habits || habits.length === 0) return;
      // Adjust indexing if needed; currently using (currentCellIndexLocal % 4) + 1
      // Consider if you want to just use (currentCellIndexLocal % habits.length)
      const currentCellLabel = habits[currentCellIndexLocal % habits.length];
      setLabelLocal(currentCellLabel);
    };
    setCurrentCellLabelToCorespondingHabitName();
  }, [currentCellIndexLocal, board]);

  useEffect(() => {
    if (todaysDate == rowNr) {
      setIsTodayLocal(true);
    }
    if (todayRef.current !== null) {
      todayRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [isTodayLocal, rowNr, todaysDate]);

  const handelCells = (cellProps) => {
    setIsCellLoading(true);
    const cellId = `${rowNr}-${colNr}`;
    const updatedCell = {
      ...cellProps,
      boardId: board?.boardId,
    };

    setCells((prevCells) => ({
      ...prevCells,
      [cellId]: updatedCell,
    }));

    setBoard((prevBoard) => {
      if (prevBoard?.boardUser && prevBoard.boardUser !== user?.email) {
        prevBoard.boardUser = user?.email;
      }
      const cellIndex = prevBoard?.cells?.findIndex(
        (cell) => cell.id === cellId
      );
      if (cellIndex !== -1) {
        return {
          ...prevBoard,
          cells: prevBoard?.cells?.map((cell, index) =>
            index === cellIndex ? updatedCell : cell
          ),
        };
      }
      return {
        ...prevBoard,
        cells: [...prevBoard.cells, updatedCell],
      };
    });

    if (!user?.email) {
      setIsCellLoading(false);
      return;
    }

    handelDbCells(board, currentCellIndexLocal, updatedCell);
    setIsCellLoading(false);
  };

  const handleMouseDown = () => {
    if (isSaved) {
      setIsSaved(false);
    }
    const timeoutId = window.setTimeout(() => {
      let input;
      if (board?.cells?.[currentCellIndexLocal]?.updatedAt) {
        if (isHistory) {
          window.alert(
            `Note: "${messageLocal}"\n\nLast updated: ${board.cells[currentCellIndexLocal].updatedAt}"`
          );
          return;
        }
        input = window.prompt(
          `Previous note: "${messageLocal}"\n\nLast updated: ${board.cells[currentCellIndexLocal].updatedAt}"`
        );
      } else {
        if (!messageLocal) {
          if (isHistory) {
            return;
          }
          input = window.prompt(`Enter a new note:`);
        } else {
          if (isHistory) {
            window.alert(
              `Note: "${messageLocal}"\n\nLast updated: ${board.cells[currentCellIndexLocal].updatedAt}"`
            );
            return;
          }
          input = window.prompt(`Note:\n"${messageLocal}"\n\nUpdate note:`);
        }
      }
      if (!input) {
        return;
      }
      if (isHistory) return;
      setMessageLocal(input);
      if (!isClearLocal) {
        const updatedCell = {
          ...board.cells[currentCellIndexLocal],
          comment: input,
        };
        handelCells(updatedCell);
      } else {
        const newCell = {
          ...board.cells[currentCellIndexLocal],
          comment: input,
        };
        handelCells(newCell);
      }
    }, 2000);
    setTimer(timeoutId);
  };

  const handleMouseUp = () => {
    if (isHistory) return;
    clearTimeout(timer);
    setTimer(null);
  };

  const checkIfCurrentRowIsAfterToday = () => {
    const currentDay = dayjs().date();
    if (currentDay < rowNr) {
      alert("This cell is in the future. You can't mark it as done yet.");
      return true;
    }
    return false; 
  };

  const handleClick = (e) => {
    if(checkIfCurrentRowIsAfterToday()) return;
  
    if (isHistory) return;
    if (isSaved) {
      setIsSaved(false);
    }

    // Handle double-click detection
    if (clickTimeout) {
      clearTimeout(clickTimeout);
      setClickTimeout(null);
      handleDoubleClick();
    } else {
      // Start a timeout for single-click
      const newTimeout = setTimeout(() => {
        // Single-click logic

        // Notify parent of current cell index
        if (
          onCellClick &&
          currentCellIndexLocal != null &&
          currentCellIndexLocal >= 0
        ) {
          onCellClick(currentCellIndexLocal);
        }

        setIsDoneLocal(!isDoneLocal);
        let cellExists = board?.cells?.[currentCellIndexLocal];
        if (
          cellExists &&
          board.cells[currentCellIndexLocal].id === `${rowNr}-${colNr}`
        ) {
          setIsClearLocal(false);
          const updatedCell = {
            ...board.cells[currentCellIndexLocal],
            isDone: !isDoneLocal,
            isClear: false,
            label: labelLocal,
          };
          handelCells(updatedCell);
        } else {
          setIsClearLocal(false);

          const newCell = {
            id: `${rowNr}-${colNr}`,
            boardId: board?.boardId,
            rowNr: rowNr,
            colNr: colNr,
            isDone: !isDoneLocal,
            isClear: false,
            label: labelLocal,
          };
          handelCells(newCell);
        }
        setClickTimeout(null);
      }, 400);
      setClickTimeout(newTimeout);
    }
  };

  const handleDoubleClick = () => {
    if (isHistory) return;
    if (isSaved) {
      setIsSaved(false);
    }
    setIsClearLocal(true);
    let cellExists = board?.cells?.[currentCellIndexLocal];
    if (
      cellExists &&
      board.cells[currentCellIndexLocal].id === `${rowNr}-${colNr}`
    ) {
      const updatedCell = {
        ...board.cells[currentCellIndexLocal],
        isDone: false,
        isClear: true,
        label: labelLocal,
      };
      setIsDoneLocal(false);
      handelCells(updatedCell);
    } else {
      const newCell = {
        id: `${rowNr}-${colNr}`,
        boardId: board.id,
        rowNr: rowNr,
        colNr: colNr,
        isDone: false,
        isClear: true,
        label: labelLocal,
      };
      setIsDoneLocal(false);
      handelCells(newCell);
    }
  };

  useEffect(() => {
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [timer]);

  return (
    <>
      {type === "nr" ? (
        <div
          ref={isTodayLocal ? todayRef : null}
          className={`${styles.streakerGridItem} ${styles.streakerGridItemNoBg} flex flex-col`}
          onClick={handleClick}
        >
          <div className="font-bold text-[0.8rem]">{rowNr}</div>
          <div className="font-semibold mt-[-4px] text-[0.6rem]">{day}</div>
        </div>
      ) : isClearLocal ? (
        <button
          className={`${styles.streakerGridItem} ${
            isTodayLocal ? styles.streakerGridItemToday : ""
          }`}
          onClick={handleClick}
          onDoubleClick={handleDoubleClick}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchEnd={handleMouseUp}
          id={`${rowNr}-${colNr}`}
          data-is-clear={isClear ? "true" : "false"}
          data-is-done={isDone ? "true" : "false"}
        ></button>
      ) : (
        <button
          className={`${styles.streakerGridItem} ${
            isDoneLocal
              ? styles.streakerGridItemDoneTrue
              : styles.streakerGridItemDoneFalse
          } ${isTodayLocal ? styles.streakerGridItemToday : ""}`}
          onClick={handleClick}
          onDoubleClick={handleDoubleClick}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchEnd={handleMouseUp}
          id={`${rowNr}-${colNr}`}
          data-is-clear={isClear ? "true" : "false"}
          data-is-done={isDone ? "true" : "false"}
        >
          {message || messageLocal ? (
            <Image
              className={`${styles.streakerGridItemHasMessage}`}
              src={"/dog-ear.svg"}
              alt="message"
              priority
              width={20}
              height={20}
              unselectable="on"
            />
          ) : null}
          {isClearLocal ? (
            ""
          ) : isDoneLocal ? (
            isCellLoading || isAppLoading || isLoading ? (
              <Image
                src={"/spinner.gif"}
                alt="checkmark"
                priority
                width={14}
                height={14}
                unselectable="on"
                style={{
                  userSelect: "none",
                  pointerEvents: "none",
                }}
              />
            ) : !isDoneLocal ? (
              <Image
                src={"/icon-cross.svg"}
                alt="crossmark"
                priority
                width={20}
                height={20}
                unselectable="on"
                style={{
                  userSelect: "none",
                  pointerEvents: "none",
                }}
              />
            ) : (
              <Image
                src={"/icon-check.svg"}
                alt="checkmark"
                priority
                width={20}
                height={20}
                unselectable="on"
                style={{
                  userSelect: "none",
                  pointerEvents: "none",
                }}
              />
            )
          ) : isCellLoading || isAppLoading || isLoading ? (
            <Image
              src={"/spinner.gif"}
              alt="checkmark"
              priority
              width={14}
              height={14}
              unselectable="on"
              style={{
                userSelect: "none",
                pointerEvents: "none",
              }}
            />
          ) : (
            <Image
              src={"/icon-cross.svg"}
              alt="crossmark"
              priority
              width={20}
              height={20}
              unselectable="on"
              style={{
                userSelect: "none",
                pointerEvents: "none",
              }}
            />
          )}
        </button>
      )}
    </>
  );
};

export default StreakerGridItem;
