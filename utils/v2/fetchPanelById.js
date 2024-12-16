const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN || null;

async function fetchPanelById(id) {
  try {
    if (!apiDomain) {
      return null;
    }
    const response = await fetch(`${apiDomain}/v2/panels/${id}`);
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
