"use client";

import { useEffect, useState, useContext } from "react";
import { AppContext } from "@/context/appContext";
import handleBoards from "@/utils/handelBoards"; // Renamed for clarity
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useSearchParams } from "next/navigation";
import HeaderItem from "./HeaderItem";
import dayjs from "dayjs";

const StreakerGridHeaders = ({ isHistory, month }) => {
  const { board, setBoard, currentHistoryPanel } = useContext(AppContext);

  const [headerNamesLocal, setHeaderNamesLocal] = useState([]);
  const [headerValuesLocal, setHeaderValuesLocal] = useState([]);
  const [isAiGenerated, setIsAiGenerated] = useState(false);
  const [historyIndex, setHistoryIndex] = useState(null);

  const { user } = useKindeBrowserClient();
  const params = useSearchParams();

  /**
   * Parse and trim comma-separated strings, then update local state + global board
   */
  const handleNamesAndValues = (headerNames, headerValues, headerGoal) => {
    // Safely split and trim
    const namesArray = headerNames.split(",").map((str) => str.trim()) || [];
    const valuesArray = headerValues.split(",").map((str) => str.trim()) || [];
    const goalTrimmed = headerGoal.trim();

    // Optional: Validate that arrays are the same length
    if (namesArray.length !== valuesArray.length) {
      console.warn("Header names and values arrays do not match in length.");
      // Decide how you want to handle this scenario
    }

    setHeaderNamesLocal(namesArray);
    setHeaderValuesLocal(valuesArray);

    // Update board & call `handleBoards`
    setBoard((prevBoard) => {
      const updatedBoard = {
        ...prevBoard,
        habitsNames: namesArray,
        habitsValues: valuesArray,
        goalToAchieve: goalTrimmed,
      };
      handleBoards(updatedBoard, user?.email);
      return updatedBoard;
    });
  };

  /**
   * Effect 1: If the URL has `headerNames`, parse them and update state
   */
  useEffect(() => {
    const headerNamesParams = params.get("headerNames");
    if (!headerNamesParams) return;

    setIsAiGenerated(true);

    const headerValuesParams = params.get("headerValues") || "";
    const headerGoalParams = params.get("goalToAchieve") || "";

    const indexParams = params.get("index");

    if (indexParams) {
      setHistoryIndex(parseInt(indexParams));
    }


    handleNamesAndValues(
      headerNamesParams,
      headerValuesParams,
      headerGoalParams
    );
  }, [params, historyIndex]);

  /**
   * Effect 2: If there are no `headerNames` in the URL, fall back to board data
   */
  useEffect(() => {
    const headerNamesParams = params.get("headerNames");
    if (!headerNamesParams) {
      setHeaderNamesLocal(board?.habitsNames || []);
      setHeaderValuesLocal(board?.habitsValues || []);
    }
    if(isHistory && params.get("index")) {
      const index = params.get("index")
      console.log("index", currentHistoryPanel);
      setHeaderNamesLocal(board?.history[index]?.habitsNames || []);
      setHeaderValuesLocal(board?.history[index]?.habitsValues || []);
    }
  }, [board, params]);

  /**
   * If AI-generated or user is logged in, render dynamic headers
   */
  if (isAiGenerated || user) {
    // Decide which data to display
    const namesToRender = isHistory
      ? headerNamesLocal || []
      : headerNamesLocal?.length
      ? headerNamesLocal
      : board?.habitsNames || [];

    const valuesToRender = isHistory
      ? headerValuesLocal || []
      : headerValuesLocal?.length
      ? headerValuesLocal
      : board?.habitsValues || [];

    const monthToDisplay = isHistory
      ? currentHistoryPanel?.month.substring(0, 3)
      : dayjs().format("MMM");

    return (
      <>
        {/* Month Header */}
        <div className="flex flex-col justify-center items-center text-[0.65rem] sm:text-[0.8rem] sm:font-semibold">
          <strong className="text-[0.7rem]">{monthToDisplay}</strong>
        </div>

        {/* Render each header item */}
        {namesToRender.map((name, i) => (
          <HeaderItem
            key={i}
            column={i}
            description={name}
            isHistory={isHistory}
            value={valuesToRender[i] || ""}
          />
        ))}
      </>
    );
  }

  /**
   * Fallback if not AI-generated and no user
   */
  return (
    <>
      <div className="flex flex-col justify-center items-center text-[0.65rem] sm:text-[0.8rem] sm:font-semibold">
        {dayjs().format("MMM")}
      </div>
      <HeaderItem key={1} column={1} description="Sleep" value="8 hrs" />
      <HeaderItem key={2} column={2} description="Meditate" value="20 min" />
      <HeaderItem key={3} column={3} description="Food" value="12-20" />
      <HeaderItem key={4} column={4} description="Training" value="30 min" />
      <HeaderItem key={5} column={5} description="Learn" value="30 min" />
    </>
  );
};

export default StreakerGridHeaders;
