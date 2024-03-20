import { set } from "mongoose";
import { useEffect, useState, useContext } from "react";
import { AppContext } from "@/context/appContext";
import Dialog from "@/components/ui/Dialog";
import handelBoards from "@/utils/handelBoards";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

const HeaderItem = ({ column, description, value }) => {
  const { isAuthenticated, user, isLoading } = useKindeBrowserClient();
  const [activityInputLocal, setActivityInputLocal] = useState(description);
  const [valueInputLocal, setValueInputLocal] = useState(value);
  const { board, setBoard, isAppLoading, setisAppLoading, setIsCellLoading } =
    useContext(AppContext);
  const handelClick = (e, field) => {
    // const activityInput = window.prompt("Enter activity name");
   
    if (field === "activity") {
      setActivityInputLocal(e.target.value);
    }
    // if (!activityInputLocal) {
    //   return;
    // }

    if (field === "value") {
      setValueInputLocal(e.target.value);
    }
    // if (!valueInputLocal) {
    //   return;
    // }
    if (!isAuthenticated) {
      return;
    }
    setBoard((prevBoard) => {
      const nameIndex = prevBoard.habitsNames.indexOf(description);
      const valueIndex = prevBoard.habitsValues.indexOf(value);
      prevBoard.habitsNames[nameIndex] = activityInputLocal;
      prevBoard.habitsValues[valueIndex] = valueInputLocal;
      return {
        ...prevBoard,
      };
    });
    user && handelBoards(board, user?.email);
  };
  useEffect(() => {
  }, [activityInputLocal, valueInputLocal]);
  return (
    <div className="flex flex-col justify-center text-[0.5rem] items-center mb-[0]">
      <Dialog habit={activityInputLocal ? activityInputLocal : description} value={valueInputLocal ? valueInputLocal : value} onChange={handelClick} />
    </div>
  );
};

export default HeaderItem;
