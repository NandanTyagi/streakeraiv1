"use client";

import { useEffect, useState, useContext } from "react";
import { AppContext } from "@/context/appContext";
import handleBoards from "@/utils/handelBoards"; // Renamed for clarity
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useSearchParams } from "next/navigation";
import HeaderItem from "./HeaderItem";
import dayjs from "dayjs";

const StreakerGridHeaders = ({ isHistory }) => {
  const { board, setBoard } = useContext(AppContext);

  const [headerNamesLocal, setHeaderNamesLocal] = useState([]);
  const [headerValuesLocal, setHeaderValuesLocal] = useState([]);
  const [isAiGenerated, setIsAiGenerated] = useState(false);

  const { user } = useKindeBrowserClient();
  const params = useSearchParams();

  const handleNamesAndValues = (headerNames, headerValues, headerGoal) => {
    const namesArray = headerNames.split(",") || [];
    const valuesArray = headerValues.split(",") || [];

    // Optional: Validate that arrays are same length
    if (namesArray.length !== valuesArray.length) {
      console.warn("Header names and values arrays do not match in length.");
      // Decide how you want to handle this scenario:
      // either return early or proceed.
    }

    setHeaderNamesLocal(namesArray);
    setHeaderValuesLocal(valuesArray);

    // IMPORTANT: update board AND call `handleBoards` inside the same callback
    setBoard((prevBoard) => {
      const updatedBoard = {
        ...prevBoard,
        habitsNames: namesArray,
        habitsValues: valuesArray,
        goalToAchieve: headerGoal,
      };
      handleBoards(updatedBoard, user?.email);
      return updatedBoard;
    });
  };

  // Effect 1: If URL has headerNames, parse them and update state.
  useEffect(() => {
    const headerNamesParams = params.get("headerNames");
    if (!headerNamesParams) return;

    setIsAiGenerated(true);

    const headerValuesParams = params.get("headerValues") || "";
    const headerGoalParams = params.get("goalToAchieve") || "";

    console.log(
      "board in StreakerGridHeaders params",
      headerNamesParams,
      headerValuesParams
    );

    handleNamesAndValues(
      headerNamesParams,
      headerValuesParams,
      headerGoalParams
    );
  }, [params]);

  // Effect 2: If we have no headerNames in the URL, use board values.
  useEffect(() => {
    const headerNamesParams = params.get("headerNames");
    if (!headerNamesParams) {
      setHeaderNamesLocal(board?.habitsNames || []);
      setHeaderValuesLocal(board?.habitsValues || []);
    }
  }, [board, params]);

  // If AI generated or user is logged in:
  if (isAiGenerated || user) {
    return (
      <>
        {/* Month header */}
        <div className="flex flex-col justify-center items-center text-[0.65rem] sm:text-[0.8rem] sm:font-semibold">
          <strong className="text-[0.7rem]">{dayjs().format("MMM")}</strong>
        </div>

        {/* Render each header item */}
        {(headerNamesLocal?.length
          ? headerNamesLocal
          : board?.headerNames || []
        ).map((name, i) => (
          <HeaderItem
            key={i}
            column={i}
            description={name}
            isHistory={isHistory}
            value={
              headerValuesLocal?.length
                ? headerValuesLocal[i]
                : board?.habitsValues?.[i] || ""
            }
          />
        ))}
      </>
    );
  }

  // Fallback if not AI-generated and no user
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
