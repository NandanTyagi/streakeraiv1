import { fetchV3Goals, fetchV3Habits, fetchV3DayStates } from "./api";
import { buildBoardFromV3 } from "./boardAdapter";

export async function loadBoardForMonth({ userId, tz, month }) {
  const goals = await fetchV3Goals({ userId, tz });
  const goal = goals?.[0];
  if (!goal) return null;
  const habits = await fetchV3Habits({ userId, tz, goalId: goal.id });
  const grid = await fetchV3DayStates({ userId, tz, month });
  return buildBoardFromV3({ goal, habits, grid, month, userId });
}
