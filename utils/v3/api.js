const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN || "";

function buildUrl(path, params) {
  const url = new URL(path, apiDomain || window.location.origin);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    });
  }
  return apiDomain ? url.toString() : url.pathname + url.search;
}

export async function fetchV3Goals({ userId, tz }) {
  const res = await fetch(buildUrl("/api/v3/goals", { userId, tz }));
  if (!res.ok) throw new Error("Failed to fetch v3 goals");
  return res.json();
}

export async function fetchV3Habits({ userId, tz, goalId }) {
  const res = await fetch(buildUrl("/api/v3/habits", { userId, tz, goalId }));
  if (!res.ok) throw new Error("Failed to fetch v3 habits");
  return res.json();
}

export async function fetchV3DayStates({ userId, tz, month }) {
  const res = await fetch(buildUrl("/api/v3/day-states", { userId, tz, month }));
  if (!res.ok) throw new Error("Failed to fetch v3 day states");
  return res.json();
}

export async function fetchV3History({ userId, tz }) {
  const res = await fetch(buildUrl("/api/v3/history", { userId, tz }));
  if (!res.ok) throw new Error("Failed to fetch v3 history");
  return res.json();
}

export async function fetchV3Streaks({ userId, tz }) {
  const res = await fetch(buildUrl("/api/v3/streaks", { userId, tz }));
  if (!res.ok) throw new Error("Failed to fetch v3 streaks");
  return res.json();
}

export async function createV3Goal({ userId, tz, title }) {
  const res = await fetch(buildUrl("/api/v3/create-goal"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, tz, title }),
  });
  if (!res.ok) throw new Error("Failed to create v3 goal");
  return res.json();
}

export async function updateV3Goal({ userId, tz, goalId, title }) {
  const res = await fetch(buildUrl("/api/v3/goals"), {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, tz, goalId, title }),
  });
  if (!res.ok) throw new Error("Failed to update v3 goal");
  return res.json();
}

export async function createV3Habit({ userId, tz, goalId, name, target, order }) {
  const res = await fetch(buildUrl("/api/v3/create-habit"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, tz, goalId, name, target, order }),
  });
  if (!res.ok) throw new Error("Failed to create v3 habit");
  return res.json();
}

export async function updateV3Habit({ userId, tz, habitId, name, target, order }) {
  const res = await fetch(buildUrl("/api/v3/habits"), {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, tz, habitId, name, target, order }),
  });
  if (!res.ok) throw new Error("Failed to update v3 habit");
  return res.json();
}

export async function upsertV3DayState({ userId, tz, habitId, status, note, date }) {
  const res = await fetch(buildUrl("/api/v3/upsert-day"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, tz, habitId, status, note, date }),
  });
  if (!res.ok) throw new Error("Failed to upsert v3 day state");
  return res.json();
}
