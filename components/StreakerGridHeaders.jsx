"use client";

import { useEffect, useState, useContext } from "react";
import { AppContext } from "@/context/appContext";
import handelBoards from "@/utils/handelBoards"; // Assuming correct spelling is 'handleBoards'
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useSearchParams } from "next/navigation";
import HeaderItem from "./HeaderItem";
import dayjs from "dayjs";

const StreakerGridHeaders = ({ isEmpty = false, isHistory, month }) => {
  const { board, setBoard, isAppLoading, setisAppLoading, setIsCellLoading } =
    useContext(AppContext);
  const [headerNamesLocal, setHeaderNamesLocal] = useState();
  const [headerValuesLocal, setHeaderValuesLocal] = useState();
  const [isAiGenerated, setIsAiGenerated] = useState(false);
  const { isAuthenticated, user, isLoading } = useKindeBrowserClient();
  const params = useSearchParams();

  const handleNamesAndValues = (headerNames, headerValues, headerGoal) => {
    const namesArray = headerNames.split(",");
    const valuesArray = headerValues.split(",");
    setHeaderNamesLocal(namesArray);
    setHeaderValuesLocal(valuesArray);
    setBoard((prevBoard) => ({
      ...prevBoard,
      habitsNames: namesArray,
      habitsValues: valuesArray,
      goalToAchieve: headerGoal,
    }));

    handelBoards(board, user?.email);
  };

  useEffect(() => {
    const headerNamesParams = params.get("headerNames");
    if (!headerNamesParams) return;
    setIsAiGenerated(true);
    const headerValuesParams = params.get("headerValues");
    const headerGoalParams = params.get("goalToAchieve");

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

  useEffect(() => {
    const headerNamesParams = params.get("headerNames");
    if (!headerNamesParams) {
      setHeaderNamesLocal(board?.habitsNames);
      setHeaderValuesLocal(board?.habitsValues);
    }
  }, [board]);

  if (isAiGenerated || user) {
    return (
      <>
        <div className="flex flex-col justify-center items-center text-[0.65rem] sm:text-[0.8rem] sm:font-semibold">
          <strong className="text-[0.7rem]">{month || dayjs().format("MMM")}</strong>
        </div>
        {(headerNamesLocal ? headerNamesLocal : board?.headerNames || []).map(
          (name, i) => (
            <HeaderItem
              key={i}
              column={i}
              description={name}
              isHistory={isHistory}
              value={
                (headerValuesLocal
                  ? headerValuesLocal
                  : board.habitsValues || [])[i]
              }
            />
          )
        )}
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col justify-center items-center text-[0.65rem] sm:text-[0.8rem] sm:font-semibold">
        {dayjs().format("MMM")}
      </div>
      <HeaderItem key={1} column={1} description={"Sleep"} value={"8 hrs"} />
      <HeaderItem
        key={2}
        column={2}
        description={"Meditate"}
        value={"20 min"}
      />
      <HeaderItem key={3} column={3} description={"Food"} value={"12-20"} />
      <HeaderItem
        key={4}
        column={4}
        description={"Training"}
        value={"30 min"}
      />
      <HeaderItem key={5} column={5} description={"Learn"} value={"30 min"} />
    </>
  );
};

export default StreakerGridHeaders;
