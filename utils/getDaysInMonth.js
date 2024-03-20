const getDaysInMonth = (date) => {
    // Get the last day of the month
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    // Calculate the number of days in the month
    return lastDay.getDate();
    //
  };

  export default getDaysInMonth