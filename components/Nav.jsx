"use client";
import Link from "next/link";
import { RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import Dialog from "@/components/ui/Dialog";
import { useState, useContext, useEffect } from "react";
import { AppContext } from "@/context/appContext";
import savePanelToDb from "@/utils/v2/savePanelToDb";
import { set } from "mongoose";


const Nav = ({ isNav = true }) => {
  const { user } = useKindeBrowserClient();
  const [isAppLoading, setisAppLoading] = useState(false);
  const [showPanelSavedDialog, setShowPanelSavedDialog] = useState(false);
  const { board, setBoard } = useContext(AppContext);
  const [dialogValue, setDialogValue] = useState(board?.goalToAchieve || "");

  const handelCtxMenu = async (e) => {
    e.preventDefault();
    console.log("ctx menu", board);

    const save = window.confirm("Do you want to save this board?");
    if (save) {
      console.log("save board");
      if(!board) {
        return;
      }
      if(!user) {
        alert(`Board not saved. Please log in to save your board.`);
        return;
      }
      const panelSaved = await savePanelToDb(board, user?.email);
      if (!panelSaved) {
        alert(`Board not saved. Please log in to save your board.`);
        return;
      }
      alert("Board saved");
      console.log("panelSaved", panelSaved);
    }
  };

  const handelClick = (e) => {
    // const input = window.prompt("What do you want to achieve?");
    const input = e.target.value;
    setisAppLoading(true);
    if (!input) {
      setisAppLoading(false);
      return;
    }
    setDialogValue((prev) => input);
    setBoard((prev) => {
      return { ...prev, goalToAchieve: input };
    });
    setTimeout(() => {
      setisAppLoading(false);
    }, 500);
  };

  useEffect(() => {
    setDialogValue(board?.goalToAchieve || "");
  }, [board, user]);

  if (isNav) {
    return (
      <nav>
        <ul className="flex gap-6 sm:gap-20">
          {/* <li>
            <Link href={"/about"}>About</Link>
          </li> */}
          <li>
            <Link href={"/generategoals"}>Identify</Link>
          </li>
          <li>
            <Link href={"/panel"}>Track</Link>
          </li>
          {!user && (
            <li>
              <RegisterLink>Sign up</RegisterLink>
            </li>
          )}
        </ul>
      </nav>
    );
  } else {
    return (
      <div className="flex justify-center items-center bg-[#EBEBEB] text-md font-semibold cursor-pointer relative">
        {!user ? (
          <RegisterLink>Sign up free to save your board</RegisterLink>
        ) : (
          <Dialog
            value={dialogValue || "I want to live a healthy life"}
            onChange={handelClick}
          />
        )}
        <div className="absolute right-6">
          <button className="flex flex-col gap-[2px] w-5 opacity-60" onClick={handelCtxMenu}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M48 96V416c0 8.8 7.2 16 16 16H384c8.8 0 16-7.2 16-16V170.5c0-4.2-1.7-8.3-4.7-11.3l33.9-33.9c12 12 18.7 28.3 18.7 45.3V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96C0 60.7 28.7 32 64 32H309.5c17 0 33.3 6.7 45.3 18.7l74.5 74.5-33.9 33.9L320.8 84.7c-.3-.3-.5-.5-.8-.8V184c0 13.3-10.7 24-24 24H104c-13.3 0-24-10.7-24-24V80H64c-8.8 0-16 7.2-16 16zm80-16v80H272V80H128zm32 240a64 64 0 1 1 128 0 64 64 0 1 1 -128 0z"/></svg>

          </button>
          
        </div>
      </div>
    );
  }
};

export default Nav;
