async function createPanelInDb(panel, userEmail) {
  console.log("in createPanelInDb panel", panel, userEmail);
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
    console.log("in create panel in Db res", await res.json());
    if (res.status === 201) {
      return true;
    }
  } catch (error) {
    console.error("Panel operation failed", error);
    return false;
  }
}

export default createPanelInDb;
