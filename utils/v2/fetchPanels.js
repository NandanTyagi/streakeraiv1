const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN || null;

async function fetchPanels() {
  try {
    if (!apiDomain) {
      return [];
    }
    const response = await fetch(`${apiDomain}/v2/panels`);
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
