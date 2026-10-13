import dayjs from "dayjs";
import useV3Engine from "./useV3Engine";
import {
  fetchV3Goals,
  fetchV3Habits,
  fetchV3DayStates,
  fetchV3History,
} from "./v3/api";
import { buildBoardFromV3, buildHistoryItemsFromEvents } from "./v3/boardAdapter";

const getCurrentUserBoardFromDb = async (userEmail) => {
  try {
    if (useV3Engine()) {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
      const goals = await fetchV3Goals({ userId: userEmail, tz });
      const goal = goals?.[0];
      if (!goal) {
        return null;
      }
      const habits = await fetchV3Habits({ userId: userEmail, tz, goalId: goal.id });
      const month = dayjs().format("YYYY-MM");
      const grid = await fetchV3DayStates({ userId: userEmail, tz, month });
      const history = await fetchV3History({ userId: userEmail, tz });
      const board = buildBoardFromV3({ goal, habits, grid, month, userId: userEmail });
      board.history = buildHistoryItemsFromEvents({ events: history.events || [], goal, habits });
      return board;
    }

    // const res = await fetch("/api/v2/panels",{
    const res = await fetch("/api/v1/userboards", {
      method: "post",
      cache: "no-cache",
      next: {
        revalidate: 0,
      },
      body: JSON.stringify({
        boardUser: userEmail,
      }),
    });
    const userBoards = await res.json();

    if (!res.ok) {
      console.error("error res in getUserBordFromDB", userBoards);
      return null;
      // throw new Error(`HTTP error! Status: ${userBoards.error}`);
    }
    const currentUserBoard = await userBoards[0];
    return currentUserBoard;
  } catch (error) {
    console.error(error.message);
    return null;
  }
};

export default getCurrentUserBoardFromDb;
