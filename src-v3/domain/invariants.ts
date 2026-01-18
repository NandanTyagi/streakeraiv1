import { Goal, Habit } from "./types";
import { ValidationResult, fail, ok } from "./validation";

export function validateGoalTitleUnique(goals: Goal[], userId: string, title: string): ValidationResult {
  const exists = goals.some(
    (goal) => goal.userId === userId && goal.title.trim().toLowerCase() === title.trim().toLowerCase() && !goal.archivedAt
  );
  return exists ? fail("GOAL_TITLE_NOT_UNIQUE", "Goal title must be unique per user.") : ok();
}

export function findGoal(goals: Goal[], goalId: string): Goal | undefined {
  return goals.find((goal) => goal.id === goalId);
}

export function findHabit(habits: Habit[], habitId: string): Habit | undefined {
  return habits.find((habit) => habit.id === habitId);
}

export function validateHabitHasGoal(habits: Habit[], habitId: string): ValidationResult {
  return findHabit(habits, habitId)
    ? ok()
    : fail("HABIT_NOT_FOUND", "Habit does not exist.");
}
