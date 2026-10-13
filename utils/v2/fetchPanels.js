async function fetchPanels() {
  try {

    const response = await fetch(`/api/v2/panels`);
    if (!response.ok) {
      throw new Error("Failed to fetch panels");
    }
    const data = await response.json();
    // console.log("data", data);
    return data;
  } catch (error) {
    console.error("Panel operation failed", error);
    return [];
  }
}

export default fetchPanels;
