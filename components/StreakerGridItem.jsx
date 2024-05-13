"use client";

import Image from "next/image";
import styles from "../styles/StreakerGridItem.module.css";
import { useState, useEffect, useContext, useRef, use } from "react";
import { AppContext } from "@/context/appContext";
import handelBoards from "@/utils/handelBoards";
import dayjs from "dayjs";
// import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
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
}) => {
  const {
    board,
    setBoard,
    cells,
    setCells,
    isCellLoading,
    setIsCellLoading,
    isAppLoading,
  } = useContext(AppContext);

  const [isDoneLocal, setIsDoneLocal] = useState(isDone);
  const [isClearLocal, setIsClearLocal] = useState(isClear);
  const [messageLocal, setMessageLocal] = useState(message);
  const [clickTimeout, setClickTimeout] = useState(null);
  const [todaysDate, settodaysDate] = useState(dayjs().format("D"));
  const [isTodayLocal, setIsTodayLocal] = useState(isToday);
  const [currentCellIndexLocal, setCurrentCellIndexLocal] = useState(
    board?.cells?.findIndex((cell) => cell.id === `${rowNr}-${colNr}`)
  );
  const [timer, setTimer] = useState(null);
  const [currentCell, setCurrentCell] = useState(
    cells ? [currentCellIndexLocal ? currentCellIndexLocal : 0] : null
  );
  const buttonIsClearRef = useRef(null);
  const buttonIsDoneRef = useRef(null);
  const todayRef = useRef(null);

  useEffect(() => {
    // console.log("isTodayLocal", isTodayLocal);
    // console.log("isToday", isToday);
    // console.log("isTodayLocal row nr", rowNr);
    // console.log("isTodayLocal date", todaysDate);
    if (todaysDate == rowNr) {
      setIsTodayLocal(true);
    }
    if (todayRef.current !== null) {
      todayRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [isTodayLocal]);

  const handelCells = (cellProps) => {
    console.log("cell props", cellProps);
    console.log("cell props cell", cell);
    setIsCellLoading(true);
    const cellId = `${rowNr}-${colNr}`;
    const updatedCell = {
      ...cellProps,
      boardId: board?.boardId,
    };

    // Update the cells with the new state
    setCells((prevCells) => ({
      ...prevCells,
      [cellId]: updatedCell,
    }));
    // console.log("cells", board.cells);
    // console.log("updated cell", updatedCell);

    setBoard((prevBoard) => {
      if (prevBoard?.boardUser && prevBoard.boardUser !== user?.email) {
        prevBoard.boardUser = user?.email;
      }
      // Check if the cell already exists in the array
      const cellIndex = prevBoard?.cells?.findIndex(
        (cell) => cell.id === `${rowNr}-${colNr}`
      );
      // If the cell exists, replace it
      if (cellIndex !== -1) {
        return {
          ...prevBoard,
          cells: prevBoard?.cells?.map((cell, index) =>
            index === cellIndex ? updatedCell : cell
          ),
        };
      }

      // If the cell doesn't exist, add it
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
    const timeoutId = window.setTimeout(() => {
      let input;

      if (currentCell?.updatedAt) {
        input = window.prompt(
          `Previous note: "${messageLocal}"\n\nLast updated: ${currentCell.updatedAt}"`
        );
      } else {
        if (!messageLocal) {
          input = window.prompt(`Enter a new note:`);
        } else {
          input = window.prompt(`Note:\n"${messageLocal}"\n\nUpdate note:`);
        }
      }
      console.log(input); // Handle the input as needed
      if (!input) {
        return;
      }
      setMessageLocal(input);
      let d = dayjs();
      let date = d.format("YYYY-MM-DD THH:mm");
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
    }, 1000);
    setTimer(timeoutId);
  };

  const handleMouseUp = () => {
    // If the mouse up event is fired before the timer runs out, clear the timeout
    clearTimeout(timer);
    setTimer(null);
  };

  const handleClick = (e) => {
    if (clickTimeout) {
      clearTimeout(clickTimeout);
      setClickTimeout(null);
      handleDoubleClick();
    } else {
      // Otherwise, start a timeout to wait for a potential second click
      const newTimeout = setTimeout(() => {
        // Single-click logic

        const currentCellIndex = board?.cells?.findIndex(
          (cell) => cell.id === `${rowNr}-${colNr}`
        );
        setCurrentCellIndexLocal(currentCellIndex);

        setIsDoneLocal(!isDoneLocal);
        let newD = dayjs();
        let date = newD.format();
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
          };

          handelCells(newCell);
        }
        setClickTimeout(null);
      }, 400); // timeout for double-click
      setClickTimeout(newTimeout);
    }
  };

  const handleDoubleClick = () => {
    setIsClearLocal(true);
    let newD = dayjs();
    let date = newD.format();
    let cellExists = board?.cells?.[currentCellIndexLocal];

    if (
      cellExists &&
      board.cells[currentCellIndexLocal].id === `${rowNr}-${colNr}`
    ) {
      const updatedCell = {
        ...board.cells[currentCellIndexLocal],
        isDone: false,
        isClear: true,
      };
      setIsDoneLocal((prev) => false);
      handelCells(updatedCell);
    } else {
      const newCell = {
        id: `${rowNr}-${colNr}`,
        boardId: board.id,
        rowNr: rowNr,
        colNr: colNr,
        isDone: false,
        isClear: true,
      };
      setIsDoneLocal((prev) => false);
      handelCells(newCell);
    }
    console.log(
      `DoubleClicked current cell info`,
      board?.cells?.[currentCellIndexLocal]
    );
  };

  useEffect(() => {
    // Clean up the timer if the component is unmounted
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [timer]);

  useEffect(() => {
    // console.clear();
    // console.log("isDoneLocal", isDoneLocal);
    // console.log("isDone", isDone);
    // console.log("isClearLocal", isClearLocal);
    // console.log("isClear", isClear);
  }, [isClear, isDone, isDoneLocal, isClearLocal]);

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
          ref={buttonIsClearRef}
        >
          {/* {messageLocal && messageLocal} */}
        </button>
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
          ref={buttonIsDoneRef}
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
                unselectable="on" // To make the image not selectable
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
                unselectable="on" // To make the image not selectable
                style={{
                  userSelect: "none",
                  pointerEvents: "none",
                }}
              />
            ) : (
              <Image
                src={"/icon-check.svg"}
                alt="crossmark"
                priority
                width={20}
                height={20}
                unselectable="on" // To make the image not selectable
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
              unselectable="on" // To make the image not selectable
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
              unselectable="on" // To make the image not selectable
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
