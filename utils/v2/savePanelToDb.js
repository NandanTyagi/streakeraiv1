import fetch from "isomorphic-unfetch";
import dayjs from "dayjs";
import createPanelInDb from "@/utils/v2/createPanelInDb";

export default async function savePanelToDb(panel, userEmail) {

  if (!userEmail) {
    console.log("in savePanelToDb no user email");
    return { saved: false, message: "Please log in to save your panel." };
  }

  if (!panel) {
    console.log("in savePanelToDb no panel");
    return {
      saved: false,
      message: "Board not saved. Please log in to save your panel.",
    };
  }

  console.log("in savePanelToDb panel", panel);
  console.log("in savePanelToDb user email", userEmail);

  if (checkPanelExists(panel._id)) {
    return { saved: await updatePanelInDb(panel), message: "Panel updated" };
  }
}

async function updatePanelInDb(panel) {
  if (!panel) {
    console.log("in updatePanelInDb no panel");
    return { saved: false, message: "Panel not found" };
  }
  console.log("in updatePanelInDb panel", panel)
  debugger;
  try {
    const res = await fetch(`/api/v2/panels/update`, {
      method: "post",
      body: JSON.stringify({
        goalToAchieve: panel.goalToAchieve,
        habitsNames: panel.habitsNames,
        habitsValues: panel.habitsValues,
        days: panel.days,
        history: setHistory(panel),
        cells: panel.cells,
        user: panel.boardUser,
        _id: panel._id,
      }),
    });
    if (res.status === 201) {
      return { saved: true, message: "Panel updated", panel: await res.json() };
    }
  } catch (error) {
    console.error("Panel operation failed", error);
    return false;
  }
}

async function checkPanelExists(panelId) {
  try {
    const res = await fetch(`/api/v2/panels/checkpanel`, {
      method: "post",
      body: JSON.stringify({
        panelId: panelId,
      }),
    });
    const resJson = await res.json();
    console.log("in savePanelToDb checkpanel", resJson);
    if (res.status === 201) {
      if (resJson.message === "Panel not found") {
        console.log("in savePanelToDb checkpanel false");
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  } catch (error) {
    console.error("Panel operation failed", error);
    return false;
  }
}

function setHistory(panel) {
  debugger;

if (!panel) {
    console.log("in setHistory no panel");
    return { saved: false, message: "Panel not found" };
  }
// Check if history exisists on panel
  if (!panel.history) {
    return setNewHistory(panel);
  }


  // Check if history for this month exists
  if (!panel.history[dayjs().month()]) {
    return setNewHistory(panel);
  }

  // Update history for this month
  panel.history[dayjs().month()] = {
    year: dayjs().format("YYYY"),
    month: dayjs().format("MMMM"),
    cells: panel.cells,
  };
  return panel.history;
}

function setNewHistory(history, panel) {
  history[dayjs().month()] = {
    year: dayjs().format("YYYY"),
    month: dayjs().format("MMMM"),
    cells: panel?.cells,
  };
  return history;
}
