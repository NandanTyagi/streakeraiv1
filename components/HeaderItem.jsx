import { useEffect, useState, useContext } from "react";
import { AppContext } from "@/context/appContext";
import Dialog from "@/components/ui/Dialog";
import handelBoards from "@/utils/handelBoards";
import { useAppAuth } from "@/hooks/useAppAuth";

const HeaderItem = ({ column, description, value, isHistory }) => {
  const { isAuthenticated, user, isLoading } = useAppAuth();
  const [activityInputLocal, setActivityInputLocal] = useState(description);
  const [valueInputLocal, setValueInputLocal] = useState(value);
  const { board, setBoard, isAppLoading, setisAppLoading, setIsCellLoading, isSaved , setIsSaved } =
    useContext(AppContext);

  const handleClick = (e, field) => {
    if(isHistory) {
      return;
    }
    const newValue = e.target.value;
    if(isSaved) {
      setIsSaved(false);
    }

    if (field === "activity") {
      setActivityInputLocal(newValue);
    }
    
    if (field === "value") {
      setValueInputLocal(newValue);
    }

    if (!isAuthenticated) {
      return;
    }

    setBoard((prevBoard) => {
      const nameIndex = column;
      const valueIndex = column;
      const newBoard = { ...prevBoard, habitsNames: [...prevBoard.habitsNames], habitsValues: [...prevBoard.habitsValues] };
      newBoard.habitsNames[nameIndex] = field === "activity" ? newValue : activityInputLocal;
      newBoard.habitsValues[valueIndex] = field === "value" ? newValue : valueInputLocal;
      return newBoard;
    });


  };

  useEffect(() => {
    // Example: console.log to demonstrate useEffect with dependencies
    // console.log("Activity or value changed", { activityInputLocal, valueInputLocal, board, user });
  }, [activityInputLocal, valueInputLocal, board, user]);

  return (
    <div className="flex min-w-0 flex-col justify-center text-[0.65rem] items-center">
      <Dialog
        habit={activityInputLocal || description || ' '}
        value={valueInputLocal || value || ' '}
        onChange={handleClick}
        isHistory={isHistory}
      />
    </div>
  );
};

export default HeaderItem;
