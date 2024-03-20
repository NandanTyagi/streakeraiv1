"use client";
import Image from "next/image";
import { useEffect, useState, useContext } from "react";
import { AppContext } from "@/context/appContext";
import Loading from "@/components/Loading";
import handelBoards from "@/utils/handelBoards";
import StreakerGrid from "@/components/v1/StreakerGrid";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import handelMouseDown from "@/utils/handelMouseDown";
import Dialog from "@/components/ui/Dialog";
import { useRouter, useSearchParams } from "next/navigation";
import { set } from "mongoose";
import getCurrentUserBoardFromDb from "@/utils/getCurrentUserBoardFromDb";
import {
  RegisterLink,
  LoginLink,
  LogoutLink,
} from "@kinde-oss/kinde-auth-nextjs/components";

export default function Home() {
  const params = useSearchParams();
  const {
    board,
    setBoard,
    isAppLoading,
    setCellisAppLoading,
    setisAppLoading,
    setBoardUser,
    setCells,
    setIsCellLoading,
  } = useContext(AppContext);

  const { isAuthenticated, user, isLoading } = useKindeBrowserClient();

  const [timer, setTimer] = useState(null);
  const [goalToAchieveLocal, setGoalToAchieveLocal] = useState(
    params.get("goalToAchieve" || board?.goalToAchieve)
  );

  const handelClick = (e) => {
    // const input = window.prompt("What do you want to achieve?");
    const input = e.target.value;
    setisAppLoading(true);
    if (!input) {
      setisAppLoading(false);
      return;
    }
    setBoard((prevBoard) => {
      {
        prevBoard, (prevBoard.goalToAchieve = input);
      }
      return {
        ...prevBoard,
      };
    });
    setTimeout(() => {
      setisAppLoading(false);
    }, 500);
  };

  useEffect(() => {
    setisAppLoading(true);
    const gta = params.get("goalToAchieve");
    if (gta) {
      setGoalToAchieveLocal(gta);
    } else {
      if (board?.goalToAchieve) {
        setGoalToAchieveLocal(board?.goalToAchieve);
      } else {
        setGoalToAchieveLocal(board?.goalToAchieve);
      }
    }

    setBoard((prevBoard) => {
      {
        if(!prevBoard) return;
        if(prevBoard.goalToAchieve === goalToAchieveLocal){
          prevBoard, (prevBoard.goalToAchieve = goalToAchieveLocal);
        } else {
          return {
            ...prevBoard,
          };
        }
      }
      return {
        ...prevBoard,
      };
    });

    handelBoards(board, user?.email);
    setisAppLoading(false);
  }, [goalToAchieveLocal]);

  return (
    <>
      <div
        className="flex justify-center items-center bg-[#EBEBEB] text-md font-semibold cursor-pointer"
        // onClick={handelClick}
      >
        {!user ? (
          <RegisterLink>
          Sign up free to save your board
          </RegisterLink>
        ) : (
          <Dialog
            value={
              goalToAchieveLocal ? goalToAchieveLocal : board?.goalToAchieve
            }
            onChange={handelClick}
          />
        )}
        {/* <div className="boardTitle text-black">
          {isAuthenticated && board && board.goalToAchieve}
          {!user && "Please login to see your board"}
        </div> */}
      </div>
      <main className="overflowY-scroll relative z-1">
        {isAppLoading || isLoading ? <Loading /> : <StreakerGrid />}
      </main>
    </>
  );
}
