const getCurrentUserBoardFromDb = async (userEmail) => {
  try {
    // const res = await fetch("/api/v2/panels",{
    const res = await fetch("/api/v1/userboards", {
      method: "post",
      cache: "no-cache",
      next: {
        revalidate: 0,
      },
      body: JSON.stringify({
        boardUser: userEmail,
      }),
    });
    const userBoards = await res.json();

    if (!res.ok) {
      console.error("error res in getUserBordFromDB", userBoards);
      return null;
      // throw new Error(`HTTP error! Status: ${userBoards.error}`);
    }
    const currentUserBoard = await userBoards[0];
    // console.log("currentUserBoard from db", currentUserBoard);
    // console.log("currentUserBoard from db email", userEmail);
    // console.log("currentUserBoard from db ******************", userBoards[0]);
    return currentUserBoard;
  } catch (error) {
    console.error(error.message);
    return null;
  }
};

export default getCurrentUserBoardFromDb;
