"use client";

import { createContext, useState, useEffect } from "react";
import generateEmptyBoard from "../utils/generateEmptyBoard";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import getCurrentUserBoardFromDb from "@/utils/getCurrentUserBoardFromDb";
import generateEmptyBoardCells from "@/utils/generateEmptyBoardCells";
import getDaysInMonth from "@/utils/getDaysInMonth";
import createPanelInDb from "@/utils/v2/createPanelInDb";

export const AppContext = createContext({
  users: [],
  boardUser: {},
  boards: [],
  currentHistoryPanel: {},
  board: {
    _id: "",
    goalToAchieve: "",
    habitsNames: [],
    habitsValues: [],
    columns: [],
    rows: [],
    cells: [],
    history: [],
  },
  cells: [],
  cell: {},
  columns: [],
  column: {},
  rows: [],
  row: {},
  boardHeader: {},
  isAppLoading: false,
  isCellLoading: false,
  openAIResponse: [],
  openAIResponseDescription: [],
  sanitizedHTML: "",
  openAIResponseHeadersNames: [],
  openAIResponseHeadersValues: [],
  goalToAchieve: "",
  isSaved: true,
  setGoalToAchieve: () => {},
  setisAppLoading: () => {},
  setOpenAIResponse: () => {},
  setOpenAIResponseDescription: () => {},
  setIsCellLoading: () => {},
  setBoard: () => {},
  setCurrentHistoryPanel: (items) => {},
  setBoardUser: () => {},
  setOpenAIResponseHeadersNames: () => {},
  setOpenAIResponseHeadersValues: () => {},
  setIsSaved: () => {},
});

export function AppContextProvider({ children }) {
  const { isAuthenticated, user, isLoading } = useKindeBrowserClient();
  const [users, setUsers] = useState();
  const [boardUser, setBoardUser] = useState(user?.email || {});
  const [boards, setBoards] = useState([]);
  const [currentHistoryPanel, setCurrentHistoryPanel] = useState();
  const [board, setBoard] = useState();
  const [cells, setCells] = useState();
  const [columns, setColumns] = useState();
  const [column, setColumn] = useState();
  const [rows, setRows] = useState();
  const [row, setRow] = useState();
  const [boardHeader, setBoardHeader] = useState();
  const [isAppLoading, setisAppLoading] = useState();
  const [isCellLoading, setIsCellLoading] = useState();
  const [sanitizedHTML, setSanitizedHTML] = useState();
  const [openAIResponse, setOpenAIResponse] = useState();
  const [openAIResponseDescription, setOpenAIResponseDescription] = useState();
  const [openAIResponseHeadersNames, setOpenAIResponseHeadersNames] =
    useState();
  const [openAIResponseHeadersValues, setOpenAIResponseHeadersValues] =
    useState();
  const [goalToAchieve, setGoalToAchieve] = useState();
  const [isSaved, setIsSaved] = useState(true);

  const getCells = (habitsNames, boardId) => {
    const days = getDaysInMonth(new Date());
    const cells = generateEmptyBoardCells(days, habitsNames, boardId);
    setCells(cells);
  };

  const getUser = async () => {
    setisAppLoading(true);
    setBoardUser(user?.email);
    setisAppLoading(false);
  };

  const getBoard = async () => {
    try {
      setisAppLoading(true);

      if (!isLoading) {
        if (!user) {
          setBoard(await generateEmptyBoard());
          return;
        }

        const fetchedCurrentUserBoard = await getCurrentUserBoardFromDb(
          user.email
        );
        console.log("fetchedCurrentUserBoard", fetchedCurrentUserBoard);
        if (!fetchedCurrentUserBoard) {
          console.log(
            "fetchedCurrentUserBoard ********FAIL***********",
            fetchedCurrentUserBoard
          );
          const newEmptyPanel = await createPanelInDb(
            await generateEmptyBoard(),
            user.email
          );
          setBoard(newEmptyPanel);
          return;
        }

        setBoard(fetchedCurrentUserBoard);
      }
    } catch (error) {
      console.error("Failed to fetch board:", error);
    } finally {
      setisAppLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setisAppLoading(true);
        const [user, board] = await Promise.all([getUser(), getBoard()]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setisAppLoading(false);
        setIsCellLoading(false);
      }
    };

    fetchData();
  }, [isLoading, user]);

  return (
    <AppContext.Provider
      value={{
        users,
        boardUser,
        boards,
        board,
        currentHistoryPanel,
        cells,
        columns,
        column,
        rows,
        row,
        boardHeader,
        isAppLoading,
        isCellLoading,
        sanitizedHTML,
        openAIResponse,
        openAIResponseDescription,
        openAIResponseHeadersNames,
        openAIResponseHeadersValues,
        goalToAchieve,
        isSaved,
        setUsers,
        setBoardUser,
        setBoards,
        setCurrentHistoryPanel,
        setBoard,
        setCells,
        setColumns,
        setColumn,
        setRows,
        setRow,
        setBoardHeader,
        setisAppLoading,
        setSanitizedHTML,
        setisAppLoading,
        setIsCellLoading,
        setOpenAIResponse,
        setOpenAIResponseDescription,
        setOpenAIResponseHeadersNames,
        setOpenAIResponseHeadersValues,
        setGoalToAchieve,
        setIsSaved
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
