import dayjs from "dayjs";
import {
  createV3Goal,
  createV3Habit,
  fetchV3Goals,
  fetchV3Habits,
  updateV3Goal,
  updateV3Habit,
  upsertV3DayState,
} from "./api";

export async function ensureGoalAndHabits({ board, userId, tz }) {
  const goals = await fetchV3Goals({ userId, tz });
  let goal = goals[0];

  if (!goal) {
    const created = await createV3Goal({
      userId,
      tz,
      title: board.goalToAchieve || "My Goal",
    });
    const event = created?.events?.[0];
    goal = {
      id: event?.payload?.goalId,
      title: board.goalToAchieve || "My Goal",
    };
  } else if (board.goalToAchieve && goal.title !== board.goalToAchieve) {
    await updateV3Goal({
      userId,
      tz,
      goalId: goal.id,
      title: board.goalToAchieve,
    });
    goal = { ...goal, title: board.goalToAchieve };
  }

  let habits = await fetchV3Habits({ userId, tz, goalId: goal.id });
  habits = habits.sort((a, b) => a.order - b.order);

  const names = board.habitsNames || [];
  const targets = board.habitsValues || [];

  for (let i = 0; i < names.length; i++) {
    const name = names[i];
    const target = targets[i] || "";
    const existing = habits[i];

    if (!existing) {
      const created = await createV3Habit({
        userId,
        tz,
        goalId: goal.id,
        name,
        target,
        order: i,
      });
      const event = created?.events?.[0];
      habits.push({
        id: event?.payload?.habitId,
        name,
        target,
        order: i,
      });
    } else if (existing.name !== name || existing.target !== target || existing.order !== i) {
      await updateV3Habit({
        userId,
        tz,
        habitId: existing.id,
        name,
        target,
        order: i,
      });
      habits[i] = { ...existing, name, target, order: i };
    }
  }

  return { goal, habits };
}

export async function saveBoardToV3({ board, userId, tz }) {
  if (!board) {
    return { saved: false, message: "Board not found" };
  }

  const { habits } = await ensureGoalAndHabits({ board, userId, tz });
  const orderedHabits = habits.sort((a, b) => a.order - b.order);
  const month = dayjs().format("YYYY-MM");

  const upserts = (board.cells || [])
    .filter((cell) => cell && cell.isClear === false)
    .map((cell) => {
      const habit = orderedHabits[cell.colNr - 1];
      if (!habit) return null;
      const date = `${month}-${String(cell.rowNr).padStart(2, "0")}`;
      return upsertV3DayState({
        userId,
        tz,
        habitId: habit.id,
        status: cell.isDone ? "done" : "not_done",
        note: cell.comment || "",
        date,
      });
    })
    .filter(Boolean);

  await Promise.all(upserts);

  return { saved: true, message: "V3 board saved" };
}
