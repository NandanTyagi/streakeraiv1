const generateEmptyBoardCells = (days, habitsNames, boardId) => {
  const cells = [];
  // debugger;
  Array.from({ length: days }).forEach((day, i) => {
    habitsNames.forEach((habit, j) => {
      const cell = {
        id: `${i + 1}-${j + 1}`,
        boardId: boardId,
        rowNr: i + 1,
        colNr: j + 1,
        comment: "",
        isDone: false,
        isClear: true,
        label: habit,
        createdAt:
          new Date().getFullYear() +
          "-" +
          (new Date().getMonth() + 1) +
          "-" +
          new Date().getDate(),
        updatedAt: "",
      };
      cells.push(cell);
    });
  });
  return cells;
};

export default generateEmptyBoardCells;
