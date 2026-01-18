import { DomainEvent } from "./events";
import { DayState, Goal, Habit, State } from "./types";
import { upsertDayState } from "./daystate";
import { computeAllStreaks } from "./streaks";

export function createEmptyState(): State {
  return {
    goals: [],
    habits: [],
    dayStates: [],
    streaks: [],
  };
}

export function applyEvent(state: State, event: DomainEvent): State {
  switch (event.type) {
    case "GOAL_CREATED": {
      const goal: Goal = {
        id: event.payload.goalId,
        userId: event.userId,
        title: event.payload.title,
        createdAt: event.createdAt,
      };
      return { ...state, goals: [...state.goals, goal] };
    }
    case "GOAL_UPDATED": {
      const goals = state.goals.map((goal) =>
        goal.id === event.payload.goalId ? { ...goal, title: event.payload.title } : goal
      );
      return { ...state, goals };
    }
    case "GOAL_ARCHIVED": {
      const goals = state.goals.map((goal) =>
        goal.id === event.payload.goalId ? { ...goal, archivedAt: event.payload.archivedAt } : goal
      );
      return { ...state, goals };
    }
    case "GOAL_RESTORED": {
      const goals = state.goals.map((goal) =>
        goal.id === event.payload.goalId ? { ...goal, archivedAt: undefined } : goal
      );
      return { ...state, goals };
    }
    case "HABIT_CREATED": {
      const habit: Habit = {
        id: event.payload.habitId,
        goalId: event.payload.goalId,
        name: event.payload.name,
        target: event.payload.target,
        order: event.payload.order,
        createdAt: event.createdAt,
      };
      return { ...state, habits: [...state.habits, habit] };
    }
    case "HABIT_UPDATED": {
      const habits = state.habits.map((habit) =>
        habit.id === event.payload.habitId
          ? {
              ...habit,
              name: event.payload.name ?? habit.name,
              target: event.payload.target ?? habit.target,
              order: event.payload.order ?? habit.order,
            }
          : habit
      );
      return { ...state, habits };
    }
    case "HABIT_ARCHIVED": {
      const habits = state.habits.map((habit) =>
        habit.id === event.payload.habitId ? { ...habit, archivedAt: event.payload.archivedAt } : habit
      );
      return { ...state, habits };
    }
    case "HABIT_RESTORED": {
      const habits = state.habits.map((habit) =>
        habit.id === event.payload.habitId ? { ...habit, archivedAt: undefined } : habit
      );
      return { ...state, habits };
    }
    case "DAY_STATE_UPSERTED": {
      const result = upsertDayState(state.dayStates, {
        habitId: event.payload.habitId,
        date: event.payload.date,
        status: event.payload.status,
        note: event.payload.note,
        updatedAt: event.createdAt,
        today: event.payload.date,
        config: { allowReversal: true, backdateWindowDays: 36500 },
      });
      return { ...state, dayStates: result.dayStates };
    }
    case "USER_TIMEZONE_UPDATED": {
      return state;
    }
    default:
      return state;
  }
}

export function replayEvents(events: DomainEvent[], today: string): State {
  const sorted = [...events].sort((a, b) =>
    a.createdAt === b.createdAt ? (a.id < b.id ? -1 : 1) : a.createdAt < b.createdAt ? -1 : 1
  );
  let state = createEmptyState();
  for (const event of sorted) {
    state = applyEvent(state, event);
  }
  const streaks = computeAllStreaks(state.dayStates, today);
  return { ...state, streaks };
}

export function selectDayState(
  dayStates: DayState[],
  habitId: string,
  date: string
): DayState | undefined {
  return dayStates.find((state) => state.habitId === habitId && state.date === date);
}
