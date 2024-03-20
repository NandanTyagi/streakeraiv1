import { get } from "http";
import generateUUID from "./generateUUID";
import getBoardsFromDb from "./getBoardsFromDb";

/**
 * 
 * @param {import('next').NextApiRequest} req
 */

function createInitialState() {

  return {
    users: [],
    user: {
      id: "",
      username: "",
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      token: "",
      boards: [],
    },
    boards: [],
    board: {
      boardId: generateUUID(),
      goalToAchieve: "I want to live a healthy life",
      habitsNames: ["", "Sleep", "Meation", "Food", "Training", "Study"],
      habitsValues: ["Day", "8 hrs", "20 min", "2 meals", "30 min", "1 hr"],
      days: 31,
      cells: [],
      boardUser: "anonymous",
    },
    cells: [],
    cell: {
      id: "",
      boardId: "",
      rowId: "",
      columnId: "",
      comment: "",
      isDone: false,
      isClear: true,
      createdAt: "",
      updatedAt: "",
    },
    columns: [],
    column: {
      id: "",
      boardId: "",
      habitName: "",
      habitValue: "",
      createdAt: "",
      updatedAt: "",
    },
    rows: [],
    row: {
      id: "",
      boardId: "",
      rowName: "",
      rowValue: "",
      createdAt: "",
      updatedAt: "",
    },
    boardHeader: {
      id: "",
      boardId: "",
      goalToAchieve: "",
      createdAt: "",
      updatedAt: "",
    },
    isAppLoading: true,
    isCellLoading: false,
    sanitizedHTML: "",
  };
}

export default createInitialState;
