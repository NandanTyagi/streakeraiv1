import generateUUID from "@/utils/generateUUID";
import generateEmptyBoardCells from "@/utils/generateEmptyBoardCells";

const generateEmptyBoard = async (email) => {
  const currentBoard = null;
  console.log("currentBoard in genereateEmptyBoard",
    //  currentBoard
    );
  const boardId = generateUUID();
  const goalToAchieve = "I want to live a healthy life";
  const habitsNames = ["Sleep", "Meditation", "Food", "Training", "Study"];
  const habitsValues = ["8 hrs", "20 min", "2 meals", "30 min", "1 hr"];
  const days = 31;
  const boardUser = 'anonymous';
  const board = {
    boardId,
    goalToAchieve,
    habitsNames,
    habitsValues,
    days,
    boardUser,
    cells: generateEmptyBoardCells(days, habitsNames, boardId),
  };
  console.log("the new board in genereateEmptyBoard",
    //  board
    );
  return board;
};

export default generateEmptyBoard;
