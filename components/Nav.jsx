"use client";
import Link from "next/link";
import { RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import Dialog from "@/components/ui/Dialog";
import { useState, useContext, useEffect } from "react";
import { AppContext } from "@/context/appContext";
import savePanelToDb from "@/utils/v2/savePanelToDb";
import { set } from "mongoose";
import ThreeDButton from "@/components/ui/button/3DButton";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

const Nav = ({ isNav = true }) => {
  const { user } = useKindeBrowserClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isAppLoading, setisAppLoading] = useState(false);
  const [showPanelSavedDialog, setShowPanelSavedDialog] = useState(false);
  const { board, setBoard, isSaved, setIsSaved } = useContext(AppContext);
  const [dialogValue, setDialogValue] = useState(board?.goalToAchieve || "");

  const handelCtxMenu = async (e) => {
    const hasSearchParams = searchParams.has("headerNames");
    if (isSaved) {
      alert("No changes to save");
      return;
    }
    e.preventDefault();

    console.log("ctx menu", board);

    const save = window.confirm("Do you want to save changes?");
    if (save) {
      console.log("save board", board);
      if (!board) {
        return;
      }
      if (!user) {
        alert(`Not saved! Please login to save changes.`);
        setIsSaved(true);
        return;
      }
      const panelSaved = await savePanelToDb(board, user?.email);
      if (panelSaved && !panelSaved.saved) {
        alert(`${panelSaved.message}`);
        return;
      }
      setIsSaved(true);
      alert("All changes saved!");
      if (hasSearchParams) {
        router.push("/panel");
      }
    }
  };

  const handelClick = (e) => {
    // const input = window.prompt("What do you want to achieve?");
    if (isSaved) {
      setIsSaved(false);
    }
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

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (!isSaved) {
        const message =
          "You have unsaved changes. Are you sure you want to leave?";
        event.returnValue = message; // Standard for most browsers
        return message; // For some older browsers
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isSaved]);

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
          <div
            className={`hidden sm:block ${
              !isSaved ? "border-red-500 border-2 rounded-lg" : null
            }`}
          >
            <ThreeDButton
              isSaved={isSaved}
              text="Save"
              onClick={handelCtxMenu}
              title="save"
            >
              {" "}
              <span className="w-[80%] font-semibold">Save</span>
              <span className="w-[20%] flex justify-center items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                  <path d="M48 96V416c0 8.8 7.2 16 16 16H384c8.8 0 16-7.2 16-16V170.5c0-4.2-1.7-8.3-4.7-11.3l33.9-33.9c12 12 18.7 28.3 18.7 45.3V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96C0 60.7 28.7 32 64 32H309.5c17 0 33.3 6.7 45.3 18.7l74.5 74.5-33.9 33.9L320.8 84.7c-.3-.3-.5-.5-.8-.8V184c0 13.3-10.7 24-24 24H104c-13.3 0-24-10.7-24-24V80H64c-8.8 0-16 7.2-16 16zm80-16v80H272V80H128zm32 240a64 64 0 1 1 128 0 64 64 0 1 1 -128 0z" />
                </svg>
              </span>
            </ThreeDButton>
          </div>
          <button
            className={`flex flex-col sm:hidden w-[14px] pt-1`}
            onClick={handelCtxMenu}
          >
          {isSaved ? <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
              <path d="M48 96V416c0 8.8 7.2 16 16 16H384c8.8 0 16-7.2 16-16V170.5c0-4.2-1.7-8.3-4.7-11.3l33.9-33.9c12 12 18.7 28.3 18.7 45.3V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96C0 60.7 28.7 32 64 32H309.5c17 0 33.3 6.7 45.3 18.7l74.5 74.5-33.9 33.9L320.8 84.7c-.3-.3-.5-.5-.8-.8V184c0 13.3-10.7 24-24 24H104c-13.3 0-24-10.7-24-24V80H64c-8.8 0-16 7.2-16 16zm80-16v80H272V80H128zm32 240a64 64 0 1 1 128 0 64 64 0 1 1 -128 0z" />
            </svg> : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
              <path d="M48 96V416c0 8.8 7.2 16 16 16H384c8.8 0 16-7.2 16-16V170.5c0-4.2-1.7-8.3-4.7-11.3l33.9-33.9c12 12 18.7 28.3 18.7 45.3V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96C0 60.7 28.7 32 64 32H309.5c17 0 33.3 6.7 45.3 18.7l74.5 74.5-33.9 33.9L320.8 84.7c-.3-.3-.5-.5-.8-.8V184c0 13.3-10.7 24-24 24H104c-13.3 0-24-10.7-24-24V80H64c-8.8 0-16 7.2-16 16zm80-16v80H272V80H128zm32 240a64 64 0 1 1 128 0 64 64 0 1 1 -128 0z" fill="red" />
            </svg>}
            
            <span className={`text-[0.7rem] sm:text-[0.7rem] ml-[-8px] mt-[-2px] ${
              !isSaved
                ? " text-red-500 font-bold"
                : "font-light"
            }`}>Save</span>
          </button>
        </div>
      </div>
    );
  }
};

export default Nav;
