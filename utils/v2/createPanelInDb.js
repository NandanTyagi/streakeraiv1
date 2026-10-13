import useV3Engine from "@/utils/useV3Engine";
import { ensureGoalAndHabits } from "@/utils/v3/saveBoardToV3";

async function createPanelInDb(panel, userEmail) {
  if (useV3Engine()) {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
    await ensureGoalAndHabits({ board: panel, userId: userEmail, tz });
    return true;
  }
  console.log("in createPanelInDb panel",
    //  panel, userEmail
    );
  try {
    const res = await fetch(`/api/v2/panels/create`, {
      method: "post",
      body: JSON.stringify({
        goalToAchieve: panel.goalToAchieve,
        habitsNames: panel.habitsNames,
        habitsValues: panel.habitsValues,
        days: panel.days,
        history: history,
        cells: panel.cells,
        panelUser: userEmail,
      }),
    });
    console.log("in create panel in Db res",
      //  await res.json()
      );
    if (res.status === 201) {
      return true;
    }
  } catch (error) {
    console.error("Panel operation failed", error);
    return false;
  }
}

export default createPanelInDb;
