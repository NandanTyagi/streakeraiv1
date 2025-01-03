// "use client";

// import { useEffect, useState, useContext, useCallback } from "react";
// import { AppContext } from "@/context/appContext";
// import handleBoards from "@/utils/handelBoards"; // Corrected spelling: handleBoards
// import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
// import { useSearchParams } from "next/navigation";
// import HeaderItem from "./HeaderItem";
// import dayjs from "dayjs";

// const StreakerGridHeaders = ({ isEmpty = false, isHistory = false, month }) => {
//   const {
//     board,
//     setBoard,
//     currentHistoryItem,
//   } = useContext(AppContext);

//   const [headerNamesLocal, setHeaderNamesLocal] = useState([]);
//   const [headerValuesLocal, setHeaderValuesLocal] = useState([]);
//   const [isAiGenerated, setIsAiGenerated] = useState(false);

//   const { isAuthenticated, user } = useKindeBrowserClient();
//   const searchParams = useSearchParams();

//   /**
//    * Helper to update board headers in both local state & context.
//    * This is invoked if the user arrives with query params (AI generated) 
//    * or to manually update from the UI if needed.
//    */
//   const updateBoardHeaders = useCallback(
//     (names, values, goal) => {
//       const namesArray = names.split(",");
//       const valuesArray = values.split(",");

//       // Update local state
//       setHeaderNamesLocal(namesArray);
//       setHeaderValuesLocal(valuesArray);

//       // Update global board in context
//       setBoard((prevBoard) => ({
//         ...prevBoard,
//         habitsNames: namesArray,
//         habitsValues: valuesArray,
//         goalToAchieve: goal,
//       }));

//       // Persist or handle the board changes
//       handleBoards(board, user?.email);
//     },
//     [board, setBoard, user?.email]
//   );

//   /**
//    * If the page is loaded with query parameters for header names and values,
//    * treat it as AI-generated content. Then update both local and global context.
//    */
//   useEffect(() => {
//     const headerNamesParams = searchParams.get("headerNames");
//     if (!headerNamesParams) return;

//     setIsAiGenerated(true);

//     const headerValuesParams = searchParams.get("headerValues") || "";
//     const headerGoalParams = searchParams.get("goalToAchieve") || "";

//     updateBoardHeaders(headerNamesParams, headerValuesParams, headerGoalParams);
//   }, [searchParams, updateBoardHeaders]);

//   /**
//    * If there are no query params, we either take the header data from 
//    * the 'currentHistoryItem' (if isHistory) or from the 'board' (default).
//    */
//   useEffect(() => {
//     const hasAIParams = !!searchParams.get("headerNames");
//     if (hasAIParams) return;

//     if (isHistory && currentHistoryItem) {
//       setHeaderNamesLocal(currentHistoryItem.habitsNames || []);
//       setHeaderValuesLocal(currentHistoryItem.habitsValues || []);
//     } else if (board) {
//       setHeaderNamesLocal(board.habitsNames || []);
//       setHeaderValuesLocal(board.habitsValues || []);
//     }
//   }, [board, isHistory, currentHistoryItem, searchParams]);

//   /**
//    * RENDER LOGIC
//    * If we have AI-generated headers or an authenticated user, we display 
//    * the dynamic header items. Otherwise, we show a default sample set.
//    */
//   const renderDynamicHeaders = () => {
//     // Decide which names/values to render: local states, or fallback to context
//     const fallbackNames = isHistory
//       ? currentHistoryItem?.habitsNames
//       : board?.habitsNames;

//     const fallbackValues = isHistory
//       ? currentHistoryItem?.habitsValues
//       : board?.habitsValues;

//     const displayedNames = headerNamesLocal?.length ? headerNamesLocal : fallbackNames || [];
//     const displayedValues = headerValuesLocal?.length ? headerValuesLocal : fallbackValues || [];

//     return (
//       <>
//         {/* Month header */}
//         <div className="flex flex-col justify-center items-center text-[0.65rem] sm:text-[0.8rem] sm:font-semibold">
//           <strong className="text-[0.7rem]">{month || dayjs().format("MMM")}</strong>
//         </div>

//         {/* Render each header item */}
//         {displayedNames.map((name, idx) => (
//           <HeaderItem
//             key={idx}
//             column={idx}
//             description={name}
//             isHistory={isHistory}
//             value={displayedValues[idx]}
//           />
//         ))}
//       </>
//     );
//   };

//   const renderDefaultHeaders = () => (
//     <>
//       <div className="flex flex-col justify-center items-center text-[0.65rem] sm:text-[0.8rem] sm:font-semibold">
//         {dayjs().format("MMM")}
//       </div>
//       <HeaderItem key={1} column={1} description="Sleep" value="8 hrs" />
//       <HeaderItem key={2} column={2} description="Meditate" value="20 min" />
//       <HeaderItem key={3} column={3} description="Food" value="12-20" />
//       <HeaderItem key={4} column={4} description="Training" value="30 min" />
//       <HeaderItem key={5} column={5} description="Learn" value="30 min" />
//     </>
//   );

//   // FINAL RETURN
//   return isAiGenerated || user ? renderDynamicHeaders() : renderDefaultHeaders();
// };

// export default StreakerGridHeaders;









"use client";

import { useEffect, useState, useContext } from "react";
import { AppContext } from "@/context/appContext";
import handelBoards from "@/utils/handelBoards"; // Assuming correct spelling is 'handleBoards'
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useSearchParams } from "next/navigation";
import HeaderItem from "./HeaderItem";
import dayjs from "dayjs";

const StreakerGridHeaders = ({ isEmpty = false, isHistory, month }) => {
  const { board, setBoard, isAppLoading, setisAppLoading, setIsCellLoading, currentHistoryPanel, currentHistoryItem } =
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
    console.log("board in StreakerGridHeaders current history panel", currentHistoryItem);
    if (!headerNamesParams) {
      isHistory ? setHeaderNamesLocal(currentHistoryItem.habitsNames) : setHeaderNamesLocal(board?.habitsNames);
      isHistory ? setHeaderValuesLocal(currentHistoryItem.habitsValues) : setHeaderValuesLocal(board?.habitsValues);
    }
  }, [board]);

  if (isAiGenerated || user) {
    return (
      <>
        <div className="flex flex-col justify-center items-center text-[0.65rem] sm:text-[0.8rem] sm:font-semibold">
          <strong className="text-[0.7rem]">{month || dayjs().format("MMM")}</strong>
        </div>
        {(headerNamesLocal ? headerNamesLocal : isHistory ? currentHistoryItem.habitsNames : board?.headerNames || []).map(
          (name, i) => (
            <HeaderItem
              key={i}
              column={i}
              description={name}
              isHistory={isHistory}
              value={
                (headerValuesLocal
                  ? headerValuesLocal
                  : isHistory ? currentHistoryItem.habitsValues : board.habitsValues || [])[i]
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
