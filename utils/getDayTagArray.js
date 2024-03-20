import dayjs from "dayjs";

// Get day tag array for current month
const getDayTagArray = (date) => {
    let dayTags = [];
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    let lastDayDate = lastDay.getDate();
    for (let i = 0; i < lastDayDate; i++) {
      let date = lastDayDate - i + 2;
      let dayTag = days[dayjs().day(date).format("d")];
      dayTags.push(dayTag);
    }
    return dayTags.reverse();
  };

  export default getDayTagArray