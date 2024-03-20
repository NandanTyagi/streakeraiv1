"use client";

import { createContext, useState, useEffect } from "react";
import createInitialState from "@/utils/createInitialState";
import getBoardsFromDb from "@/utils/getBoardsFromDb";
import { set } from "mongoose";
import generateEmptyBoard from "../utils/generateEmptyBoard";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import getCurrentUserBoardFromDb from "@/utils/getCurrentUserBoardFromDb";
import generateEmptyBoardCells from "@/utils/generateEmptyBoardCells";
import getDaysInMonth from "@/utils/getDaysInMonth";

export const AppContext = createContext({
  users: [],
  boardUser: {},
  boards: [],
  board: {},
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
  setGoalToAchieve: () => {},
  setisAppLoading: () => {},
  setOpenAIResponse: () => {},
  setOpenAIResponseDescription: () => {},
  setIsCellLoading: () => {},
  setBoard: () => {},
  setBoardUser: () => {},
  setOpenAIResponseHeadersNames: () => {},
  setOpenAIResponseHeadersValues: () => {},
});

export function AppContextProvider({ children }) {
  const { isAuthenticated, user, isLoading } = useKindeBrowserClient();
  const [users, setUsers] = useState();
  const [boardUser, setBoardUser] = useState(user?.email || {});
  const [boards, setBoards] = useState([]);
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
      let fetchedCurrentUserBoard = null;
      if (user) {
        fetchedCurrentUserBoard = await getCurrentUserBoardFromDb(user?.email);
        setBoard((prev) => (prev = fetchedCurrentUserBoard));
        console.log("user in context", user);
        console.log("board in context", fetchedCurrentUserBoard);
        return;
      }

      if (!fetchedCurrentUserBoard) {
        console.log("no board in context", fetchedCurrentUserBoard);
        const emptyBoard = await generateEmptyBoard(user?.email);
        setBoard(emptyBoard);
        // setBoard((prev) => (prev = emptyBoard));
        // getCells(emptyBoard.habitsNames, emptyBoard.boardId)
        console.log("empty board in context", emptyBoard);
      } else {
        console.log("fetched board in context", fetchedCurrentUserBoard);
        setBoard((prev) => (prev = fetchedCurrentUserBoard));
        getCells(
          fetchedCurrentUserBoard.habitsNames,
          fetchedCurrentUserBoard.boardId
        );
      }
    } catch (error) {
      console.error("Failed to fetch board:", error);
      // Handle the error appropriately
    } finally {
      setisAppLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setisAppLoading(true); // Consider setting this only once if both loadings are related
        await getUser();
        await getBoard();
        // This should set the board and related states
      } catch (error) {
        console.error("Error fetching data:", error);
        // Handle any errors here
      } finally {
        setisAppLoading(false); // Reflect that overall app loading is done
        setIsCellLoading(false); // Reflect that cell loading is done
      }
    };

    fetchData();
  }, [isLoading, user]); // Consider the correct dependencies based on your needs

  return (
    <AppContext.Provider
      value={{
        users,
        boardUser,
        boards,
        board,
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
        setUsers,
        setBoardUser,
        setBoards,
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
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
