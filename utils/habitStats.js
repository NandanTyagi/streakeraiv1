import dayjs from "dayjs";

export function statsPeriod(board, now = new Date()) {
  const current = dayjs(now);
  const month = board?.month && board?.year ? dayjs(`${board.month} 1, ${board.year}`) : current.startOf("month");
  const days = month.isSame(current, "month") ? current.date() : month.isAfter(current) ? 0 : month.daysInMonth();
  return { month, days };
}
export function calculateHabitStats(board, now = new Date()) {
  if (!board?.habitsNames) return [];
  const { month, days } = statsPeriod(board, now);
  return board.habitsNames.map((headerName, index) => {
    const stats = { colNr: index + 1, headerName, isDone: 0, missed: 0, unreviewed: 0, longestStreak: 0, comments: [], trend: [] };
    let run = 0;
    for (let day = 1; day <= days; day++) {
      const cell = board.cells?.find(c => c.rowNr === day && c.colNr === index + 1);
      const reviewed = cell && cell.isClear === false;
      if (reviewed && cell.isDone === true) {
        stats.isDone++; run++;
        stats.longestStreak = Math.max(stats.longestStreak, run);
        stats.trend.push(1);
      } else {
        run = 0;
        if (reviewed) stats.missed++; else stats.unreviewed++;
        stats.trend.push(reviewed ? 0 : null);
      }
      if (cell?.comment) stats.comments.push({ text: cell.comment, date: month.date(day).format("MMM D, YYYY") });
    }
    const reviewed = stats.isDone + stats.missed;
    return { ...stats, hitRate: reviewed ? `${Math.round(stats.isDone / reviewed * 100)}%` : "—" };
  });
}
