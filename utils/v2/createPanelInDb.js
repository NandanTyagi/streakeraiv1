import useV3Engine from "../useV3Engine";
import { ensureGoalAndHabits } from "../v3/saveBoardToV3";

export default async function createPanelInDb(panel, userEmail) {
  if (useV3Engine()) {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
    await ensureGoalAndHabits({ board: panel, userId: userEmail, tz });
    return panel;
  }
  const res = await fetch("/api/v2/panels/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...panel, history: panel.history || [], panelUser: userEmail }),
  });
  if (!res.ok) throw new Error("Unable to create your panel. Please try again.");
  const created = await res.json();
  if (!created?._id) throw new Error("The server did not confirm the saved panel.");
  return created;
}
