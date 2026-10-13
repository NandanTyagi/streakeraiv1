import dayjs from "dayjs";
import createPanelInDb from "./createPanelInDb";
import useV3Engine from "../useV3Engine";
import { saveBoardToV3 } from "../v3/saveBoardToV3";

export default async function savePanelToDb(panel, userEmail) {
  if (!userEmail) return { saved: false, message: "Please sign in to save your panel." };
  if (!panel) return { saved: false, message: "Your panel could not be loaded. Please try again." };

  try {
    if (useV3Engine()) {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
      return await saveBoardToV3({ board: panel, userId: userEmail, tz });
    }
    const payload = { ...panel, history: setHistory(panel) };
    if (!panel._id) {
      const created = await createPanelInDb(payload, userEmail);
      return { saved: true, message: "Panel created", panel: created };
    }
    const res = await fetch("/api/v2/panels/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Unable to save your panel. Please try again.");
    const savedPanel = await res.json();
    if (!savedPanel?._id) throw new Error("The server did not confirm the saved panel.");
    return { saved: true, message: "Panel updated", panel: savedPanel };
  } catch (error) {
    return { saved: false, message: error.message || "Unable to save your panel. Please try again." };
  }
}

export function setHistory(panel) {
  const year = dayjs().format("YYYY");
  const month = dayjs().format("MMMM");
  const snapshot = {
    year, month, cells: panel.cells, goalToAchieve: panel.goalToAchieve,
    habitsNames: panel.habitsNames, habitsValues: panel.habitsValues, days: panel.days,
  };
  const history = Array.isArray(panel.history) ? panel.history : [];
  const existing = history.findIndex((entry) => entry.year === year && entry.month === month);
  return existing === -1 ? [...history, snapshot] : history.map((entry, index) =>
    index === existing ? { ...entry, ...snapshot } : entry);
}
