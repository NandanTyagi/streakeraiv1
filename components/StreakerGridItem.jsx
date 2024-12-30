"use client";

import Image from "next/image";
import styles from "../styles/StreakerGridItem.module.css";
import { useState, useEffect, useContext, useRef } from "react";
import { AppContext } from "@/context/appContext";
import dayjs from "dayjs";
import handelDbCells from "../utils/handelDbCells";

// 1. Import shadcn UI toast & dialog components
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/shad-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

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

  // 2. Destructure the toast function
  const { toast } = useToast();

  const [isDoneLocal, setIsDoneLocal] = useState(isDone);
  const [isClearLocal, setIsClearLocal] = useState(isClear);
  const [messageLocal, setMessageLocal] = useState(message);
  const [clickTimeout, setClickTimeout] = useState(null);
  const [todaysDate, settodaysDate] = useState(dayjs().format("D"));
  const [isTodayLocal, setIsTodayLocal] = useState(isToday);
  const [labelLocal, setLabelLocal] = useState(label);
  const [timer, setTimer] = useState(null);

  // 3. State for the Dialog ("prompt" replacement)
  const [showNoteDialog, setShowNoteDialog] = useState(false);
  const [noteValue, setNoteValue] = useState("");

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

  // 4. Show read-only note or open a Dialog after 2s mouse-hold
  const handleMouseDown = () => {
    if (isSaved) {
      setIsSaved(false);
    }

    const timeoutId = window.setTimeout(() => {
      // Check if there's an existing note update time
      const hasUpdatedAt = board?.cells?.[currentCellIndexLocal]?.updatedAt;

      if (hasUpdatedAt) {
        // If isHistory => read-only toast
        if (isHistory) {
          toast({
            title: "Note",
            description: `"${messageLocal}"\n\nLast updated: ${
              board.cells[currentCellIndexLocal].updatedAt
            }`,
          });
          return;
        }
        // Else open the dialog to update existing note
        setNoteValue(messageLocal || "");
        setShowNoteDialog(true);
      } else {
        // If no existing note or updatedAt
        if (!messageLocal) {
          // If isHistory => do nothing
          if (isHistory) return;
          // Else open a new note dialog
          setNoteValue("");
          setShowNoteDialog(true);
        } else {
          // If user already has a note
          if (isHistory) {
            // read-only toast
            toast({
              title: "Note",
              description: `"${messageLocal}"\n\nLast updated: ${
                board.cells[currentCellIndexLocal].updatedAt
              }`,
            });
            return;
          }
          // else open the update dialog
          setNoteValue(messageLocal);
          setShowNoteDialog(true);
        }
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
      // Use toast instead of alert for "future day" check
      toast({
        title: "Heads up!",
        description: "This cell is in the future. You can't mark it as done yet.",
      });
      return true;
    }
    return false;
  };

  const handleClick = (e) => {
    if (checkIfCurrentRowIsAfterToday()) return;

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
        const cellExists = board?.cells?.[currentCellIndexLocal];
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
    const cellExists = board?.cells?.[currentCellIndexLocal];
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

  // 5. Handle saving the note after user closes Dialog
  const handleSaveNote = () => {
    setMessageLocal(noteValue);

    // If cell is not clear => update comment
    if (!isClearLocal) {
      const updatedCell = {
        ...board.cells[currentCellIndexLocal],
        comment: noteValue,
      };
      handelCells(updatedCell);
    } else {
      // If cell is clear => create a new cell with comment
      const newCell = {
        ...board.cells[currentCellIndexLocal],
        comment: noteValue,
      };
      handelCells(newCell);
    }

    setShowNoteDialog(false);
  };

  const handleCancelNote = () => {
    // Just close the dialog without saving
    setShowNoteDialog(false);
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

      {/* 6. Dialog for "prompt" replacement */}
      <Dialog open={showNoteDialog} onOpenChange={setShowNoteDialog}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>{messageLocal ? "Update Note" : "New Note"}</DialogTitle>
            <DialogDescription>
              {messageLocal
                ? "Update your existing note below."
                : "Enter a new note below."}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <Textarea
              value={noteValue}
              onChange={(e) => setNoteValue(e.target.value)}
              placeholder="Enter your note..."
            />
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={handleCancelNote}>
              Cancel
            </Button>
            <Button onClick={handleSaveNote}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default StreakerGridItem;
