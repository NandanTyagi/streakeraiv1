import { useEffect, useState, useContext } from "react";
import { AppContext } from "@/context/appContext";
import Dialog from "@/components/ui/Dialog";
import handelBoards from "@/utils/handelBoards";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

const HeaderItem = ({ column, description, value }) => {
  const { isAuthenticated, user, isLoading } = useKindeBrowserClient();
  const [activityInputLocal, setActivityInputLocal] = useState(description);
  const [valueInputLocal, setValueInputLocal] = useState(value);
  const { board, setBoard, isAppLoading, setisAppLoading, setIsCellLoading, isSaved , setIsSaved } =
    useContext(AppContext);

  const handleClick = (e, field) => {
    const newValue = e.target.value;
    if(isSaved) {
      
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
      const nameIndex = prevBoard.habitsNames.indexOf(description);
      const valueIndex = prevBoard.habitsValues.indexOf(value);
      const newBoard = { ...prevBoard };
      newBoard.habitsNames[nameIndex] = field === "activity" ? newValue : activityInputLocal;
      newBoard.habitsValues[valueIndex] = field === "value" ? newValue : valueInputLocal;
      return newBoard;
    });

    if (user) {
      handelBoards(board, user.email);
    }
  };

  useEffect(() => {
    // Example: console.log to demonstrate useEffect with dependencies
    console.log("Activity or value changed", { activityInputLocal, valueInputLocal, board, user });
  }, [activityInputLocal, valueInputLocal, board, user]);

  return (
    <div className="flex flex-col justify-center text-[0.5rem] items-center mb-[0]">
      <Dialog
        habit={activityInputLocal || description || ' '}
        value={valueInputLocal || value || ' '}
        onChange={handleClick}
      />
    </div>
  );
};

export default HeaderItem;
