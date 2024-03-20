const getCurrentUserBoardFromDb = async (userEmail) => {
  
  // const res = await fetch("/api/v2/panels",{
      const res = await fetch("/api/v1/userboards",{
        method: "post",
        cache: "no-cache",
        next: {
          revalidate: 0
        },
        body: JSON.stringify({
          boardUser: userEmail,
        }),
      });
      if (!res.ok) {
          console.error(res);
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
      const currentUserBoard = await res.json();
      console.log('currentUserBoard from db', currentUserBoard[0])
      return currentUserBoard[0];
  }
  
  export default getCurrentUserBoardFromDb;