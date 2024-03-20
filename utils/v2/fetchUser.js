const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN || null;

async function fetchUser() {
  try {
    if (!apiDomain) {
      return [];
    }
    const response = await fetch(`${apiDomain}/v1/users/getuser`);
    if (!response.ok) {
      throw new Error("Failed to fetch user");
    }
    const data = await response.json();
    console.log("data", data);
    return data;
  } catch (error) {
    console.error("Fetch user failed", error);
    return [];
  }
}

export default fetchUser;
