async function fetchPanelById(id) {
  try {

    const response = await fetch(`/api/v2/panels/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch panel");
    }
    const data = await response.json();
    // console.log("data", data);
    return data;
  } catch (error) {
    console.error("Panel operation failed", error);
    return null;
  }
}

export default fetchPanelById;
