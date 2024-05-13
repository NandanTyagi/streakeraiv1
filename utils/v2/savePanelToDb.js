import fetch from "isomorphic-unfetch";
import dayjs from "dayjs";
import createPanelInDb from "@/utils/v2/createPanelInDb";

export default async function savePanelToDb(panel, userEmail) {
  const month = dayjs().format("MMMM");
  const year = dayjs().format("YYYY");
  let history = Array.from({ length: 12 });
  history[dayjs().month()] = {
    year: year,
    month: month,
    cells: panel.cells,
  };

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

async function updatePanelInDb(panel, history) {
  console.log("in updatePanelInDb panel", panel, history);
  try {
    const res = await fetch(`/api/v2/panels/update`, {
      method: "post",
      body: JSON.stringify({
        goalToAchieve: panel.goalToAchieve,
        habitsNames: panel.habitsNames,
        habitsValues: panel.habitsValues,
        days: panel.days,
        history: history,
        cells: panel.cells,
        user: panel.boardUser,
        _id: panel._id,
      }),
    });
    debugger;
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
