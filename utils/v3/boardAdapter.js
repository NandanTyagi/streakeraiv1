import dayjs from "dayjs";

export function buildBoardFromV3({ goal, habits, grid, month, userId }) {
  const daysInMonth = dayjs(`${month}-01`).daysInMonth();
  const cells = [];
  const habitsOrdered = [...habits].sort((a, b) => a.order - b.order);

  for (let day = 1; day <= daysInMonth; day++) {
    for (let col = 1; col <= habitsOrdered.length; col++) {
      const habit = habitsOrdered[col - 1];
      const date = `${month}-${String(day).padStart(2, "0")}`;
      const cell = grid?.cells?.find(
        (item) => item.habitId === habit.id && item.date === date
      );
      const status = cell?.status || "unreviewed";

      cells.push({
        id: `${day}-${col}`,
        boardId: goal?.id,
        rowNr: day,
        colNr: col,
        comment: cell?.note || "",
        isDone: status === "done",
        isClear: status === "unreviewed",
        label: habit.name,
        createdAt: date,
        updatedAt: cell?.note ? date : "",
      });
    }
  }

  return {
    _id: goal?.id || "",
    goalToAchieve: goal?.title || "",
    habitsNames: habitsOrdered.map((habit) => habit.name),
    habitsValues: habitsOrdered.map((habit) => habit.target),
    days: daysInMonth,
    cells,
    history: [],
    boardUser: userId,
    v3: {
      goalId: goal?.id,
      habits: habitsOrdered.map((habit) => ({
        id: habit.id,
        name: habit.name,
        target: habit.target,
        order: habit.order,
      })),
    },
  };
}

export function buildHistoryItemsFromEvents({ events, goal, habits }) {
  const months = new Map();
  const dayEvents = events.filter((event) => event.type === "DAY_STATE_UPSERTED");
  for (const event of dayEvents) {
    const date = event.payload.date;
    const monthKey = date.slice(0, 7);
    if (!months.has(monthKey)) {
      months.set(monthKey, { monthKey, year: date.slice(0, 4) });
    }
  }

  const habitsOrdered = [...habits].sort((a, b) => a.order - b.order);
  return Array.from(months.values()).map(({ monthKey, year }) => ({
    id: `${goal?.id || "goal"}-${monthKey}`,
    year,
    month: dayjs(`${monthKey}-01`).format("MMMM"),
    goalToAchieve: goal?.title || "",
    habitsNames: habitsOrdered.map((habit) => habit.name),
    habitsValues: habitsOrdered.map((habit) => habit.target),
    days: dayjs(`${monthKey}-01`).daysInMonth(),
    cells: [],
  }));
}
