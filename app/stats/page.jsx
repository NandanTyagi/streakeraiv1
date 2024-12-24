'use client';
import React, { useContext, useMemo } from "react";
import { AppContext } from "@/context/appContext";
import dayjs from "dayjs";
import styles from "@/styles/ColumnStats.module.css";

const ColumnStatsPage = () => {
  const { board } = useContext(AppContext); // Assuming `board` is available here

  // Calculate remaining days in the current month
  const daysRemaining = useMemo(() => {
    const today = dayjs();
    const endOfMonth = today.endOf('month');
    return endOfMonth.diff(today, 'day') + 1; // Include today
  }, []);

  // Compute stats for each column
  const columnStats = useMemo(() => {
    if (!board?.cells || !board?.habitsNames) return [];

    const columnTotals = {};
    const columnStreaks = {}; // To store longest streaks for each column

    board.cells.forEach((cell) => {
      const column = cell.colNr;
      if (!columnTotals[column]) {
        columnTotals[column] = { isDone: 0, isClear: 0, missed: 0 };
        columnStreaks[column] = { longestStreak: 0, currentStreak: 0 };
      }

      if (cell.isDone) {
        columnTotals[column].isDone += 1;

        // Increment current streak and update longest streak
        columnStreaks[column].currentStreak += 1;
        if (columnStreaks[column].currentStreak > columnStreaks[column].longestStreak) {
          columnStreaks[column].longestStreak = columnStreaks[column].currentStreak;
        }
      } else {
        if (!cell.isClear) {
          columnTotals[column].missed += 1;
        } else {
          columnTotals[column].isClear += 1;
        }

        // Reset current streak
        columnStreaks[column].currentStreak = 0;
      }
    });

    return Object.entries(columnTotals).map(([col, stats]) => {
      const totalDaysInMonth = dayjs().daysInMonth();
      const uncheckedDays = totalDaysInMonth - stats.isDone - stats.missed; // Calculate unchecked days
      const daysLeftToReview = uncheckedDays - daysRemaining; // Subtract remaining days in the month

      return {
        colNr: col,
        headerName: board.habitsNames[col - 1] || `Column ${col}`, // Map `colNr` to `habitsNames`
        ...stats,
        daysLeftToReview, // Include the new "Remaining" calculation
        longestStreak: columnStreaks[col].longestStreak, // Include the longest streak
      };
    });
  }, [board, daysRemaining]);

  return (
    <div className={styles.container}>
      <h1>Column Statistics</h1>
      <p>{`Days remaining this month: ${daysRemaining}`}</p>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Activity</th>
            <th>Done</th>
            <th>Missed</th>
            <th>Unreviewed</th>
            <th>Longest Streak</th>
          </tr>
        </thead>
        <tbody>
          {columnStats.map((col) => (
            <tr key={col.colNr}>
              <td>{col.headerName}</td>
              <td>{col.isDone}</td>
              <td>{col.missed}</td>
              <td>{col.daysLeftToReview}</td>
              <td>{col.longestStreak}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ColumnStatsPage;
