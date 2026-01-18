'use client';
import React, { useContext, useMemo, useEffect, useState } from "react";
import { AppContext } from "@/context/appContext";
import dayjs from "dayjs";
import styles from "@/styles/ColumnStats.module.css";
import useV3Engine from "@/utils/useV3Engine";
import { fetchV3Streaks } from "@/utils/v3/api";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

const ColumnStatsPage = () => {
  const { board } = useContext(AppContext); // Assuming `board` is available here
  const { user } = useKindeBrowserClient();
  const isV3 = useV3Engine();
  const [v3Streaks, setV3Streaks] = useState([]);

  useEffect(() => {
    const loadStreaks = async () => {
      if (!isV3 || !user?.email) return;
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
      try {
        const streaks = await fetchV3Streaks({ userId: user.email, tz });
        setV3Streaks(streaks || []);
      } catch (error) {
        console.error("Failed to fetch v3 streaks", error);
      }
    };
    loadStreaks();
  }, [isV3, user]);

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
    const streakByHabit = new Map(
      (v3Streaks || []).map((streak) => [streak.habitId, streak])
    );

    board.cells.forEach((cell) => {
      const column = cell.colNr;
      if (!columnTotals[column]) {
        columnTotals[column] = { isDone: 0, isClear: 0, missed: 0 };
        columnStreaks[column] = { longestStreak: 0, currentStreak: 0 };
      }

      if (cell.isDone) {
        columnTotals[column].isDone += 1;

        if (!isV3) {
          // Increment current streak and update longest streak
          columnStreaks[column].currentStreak += 1;
          if (columnStreaks[column].currentStreak > columnStreaks[column].longestStreak) {
            columnStreaks[column].longestStreak = columnStreaks[column].currentStreak;
          }
        }
      } else {
        if (!cell.isClear) {
          columnTotals[column].missed += 1;
        } else {
          columnTotals[column].isClear += 1;
        }

        // Reset current streak
        if (!isV3) {
          columnStreaks[column].currentStreak = 0;
        }
      }
    });

    return Object.entries(columnTotals).map(([col, stats]) => {
      const totalDaysInMonth = dayjs().daysInMonth();
      const uncheckedDays = totalDaysInMonth - stats.isDone - stats.missed; // Calculate unchecked days
      const daysLeftToReview = uncheckedDays - daysRemaining; // Subtract remaining days in the month

      const habitMeta = board?.v3?.habits?.[col - 1];
      const v3Streak = habitMeta ? streakByHabit.get(habitMeta.id) : null;
      const longestStreak = isV3 ? v3Streak?.longest || 0 : columnStreaks[col].longestStreak;
      return {
        colNr: col,
        headerName: board.habitsNames[col - 1] || `Column ${col}`, // Map `colNr` to `habitsNames`
        ...stats,
        daysLeftToReview, // Include the new "Remaining" calculation
        longestStreak, // Include the longest streak
      };
    });
  }, [board, daysRemaining, isV3, v3Streaks]);

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
