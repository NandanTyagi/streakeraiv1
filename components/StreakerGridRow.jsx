import StreakerGridItem from "./StreakerGridItem";
import dayjs from "dayjs";

const StreakerGridRow = ({ nr, cells, day, user, isLoading }) => {
  return (
    <>
      <StreakerGridItem type={"nr"} rowNr={nr} day={day} user={user} isLoading={isLoading} />
      {cells.map((cell, index) => {
        return (
          <StreakerGridItem
            key={index}
            type={cell}
            isDone={cell.isDone}
            isClear={cell.isClear}
            message={cell.message}
            rowNr={nr}
            colNr={cell.colNr}
            isToday={nr === dayjs().format("D") ? true : false}
            user={user}
            isLoading={isLoading}
          />
        );
      })}
    </>
  );
};

export default StreakerGridRow;
