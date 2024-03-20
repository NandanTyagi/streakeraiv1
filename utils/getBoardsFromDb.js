const getBoardsFromDb = async () => {
  // debugger;
    const res = await fetch("/api/v1/boards",{
      next: {
        revalidate: 0
      }
    });
    if (!res.ok) {
        console.log(res);
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
    const boards = await res.json();
    console.log('cells from db', boards)
    return boards;
}

export default getBoardsFromDb;