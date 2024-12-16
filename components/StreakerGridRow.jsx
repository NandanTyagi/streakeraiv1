import StreakerGridItem from "./StreakerGridItem";
import dayjs from "dayjs";

const StreakerGridRow = ({ nr, cells, day, user, isLoading, onCellSelect, board, habits }) => {
  return (
    <>
      <StreakerGridItem type={"nr"} rowNr={nr} day={day} user={user} isLoading={isLoading} />
      {cells.map((cell, index) => {
        const currentCellIndex = board?.cells?.findIndex((c) => c.id === `${nr}-${cell.colNr}`);

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
            onCellClick={() => onCellSelect(currentCellIndex)}
            board={board}
            label={habits?.[cell.colNr - 1]}
          />
        );
      })}
    </>
  );
};

export default StreakerGridRow;
