import dayjs from "dayjs";

const getDayTagArray = (date) => {
  const dayTags = [];
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const year = date.getFullYear();
  const month = date.getMonth(); // Months are zero-indexed in JavaScript

  // Get the number of days in the month
  const lastDayDate = new Date(year, month + 1, 0).getDate();

  for (let day = 1; day <= lastDayDate; day++) {
    const currentDate = new Date(year, month, day);
    const dayOfWeek = currentDate.getDay(); // 0 (Sun) to 6 (Sat)
    const dayTag = days[dayOfWeek];
    dayTags.push(dayTag);
  }

  return dayTags;
};

export default getDayTagArray;




// import dayjs from "dayjs";

// // Get day tag array for current month
// const getDayTagArray = (date) => {
//     let dayTags = [];
//     const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
//     const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
//     let lastDayDate = lastDay.getDate();
//     for (let i = 0; i < lastDayDate; i++) {
//       let date = lastDayDate - i + 2;
//       let dayTag = days[dayjs().day(date).format("d")];
//       dayTags.push(dayTag);
//     }
//     return dayTags.reverse();
//   };

//   export default getDayTagArray