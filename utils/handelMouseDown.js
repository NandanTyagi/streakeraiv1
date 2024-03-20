const handleMouseDown = (setBoard, setTimer) => {
  const timeoutId = window.setTimeout(() => {
    const input = window.prompt("What do you watch to achieve?");
    setBoard((prevBoard) => {
      prevBoard.goalToAchieve = input;
      return {
        ...prevBoard,
      };
    });
    console.log(input); // Handle the input as needed
  }, 1000);
  setTimer(timeoutId);
};

export default handleMouseDown;