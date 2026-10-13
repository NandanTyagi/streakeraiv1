async function fetchUser() {
  try {

    const response = await fetch(`/api/v1/users/getuser`);
    if (!response.ok) {
      throw new Error("Failed to fetch user");
    }
    const data = await response.json();
    // console.log("data", data);
    return data;
  } catch (error) {
    console.error("Fetch user failed", error);
    return [];
  }
}

export default fetchUser;
