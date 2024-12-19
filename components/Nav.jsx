"use client";
import Link from "next/link";
import { RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import Dialog from "@/components/ui/Dialog";
import { useState, useContext, useEffect } from "react";
import { AppContext } from "@/context/appContext";
import savePanelToDb from "@/utils/v2/savePanelToDb";
import ThreeDButton from "@/components/ui/button/3DButton";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

const Nav = ({ isNav = true, isHistory }) => {
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
        debugger;
        alert(`Is panel saved: ${panelSaved.saved}`);
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

  const handleClearPanel = async (e) => {
    console.log("clear panel");
    e.preventDefault();

    if (!user) {
      alert("Please log in to clear and save your panel.");
      return;
    }

    const clear = window.confirm(
      "Are you sure you want to clear the panel? This action cannot be undone."
    );
    if (clear) {
      // Create the updated board with cells cleared
      const updatedBoard = {
        ...board,
        cells: [],
      };

      // Update the state
      setBoard(updatedBoard);

      try {
        // Save the updated board to the database
        const panelSaved = await savePanelToDb(updatedBoard, user?.email);
        debugger

        if (panelSaved && !panelSaved.saved) {
          console.error("Error saving panel:", panelSaved.saved);
          alert(`${panelSaved.message}`);
          return;
        }
        
        console.log("NOT Error saving panel:", panelSaved.message);
        setIsSaved(true);

        // Optionally, refresh the page or update the UI accordingly
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } catch (error) {
        console.error("Error saving panel:", error);
        alert("An error occurred while saving your panel. Please try again.");
      }
    }
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
        {user && (
          <div className={`absolute left-2 md:left-2 ${isHistory ? "hidden" : null}`}>
            <div className={`hidden md:block`}>
              <ThreeDButton
                isSaved={true}
                text="Clear"
                onClick={(e) => handleClearPanel(e)}
                title="Reset panel"
              >
                {" "}
                <span className="w-[80%] font-semibold hidden sm:block">
                  Reset
                </span>
                <span className="w-[20%] flex justify-center items-center">
                  x
                </span>
              </ThreeDButton>
            </div>
            <button
              className={`flex flex-col justify-center items-center md:hidden w-[40px] ${isHistory ? "hidden" : null}`}
              onClick={(e) => handleClearPanel(e)}
            >
              <span className="text-[0.7rem] sm:text-[0.7rem]">X</span>
              <span className="text-[0.7rem] sm:text-[0.7rem]">Reset</span>
            </button>
          </div>
        )}
        {!user ? (
          <RegisterLink>Sign up free to save your board</RegisterLink>
        ) : (
          <Dialog
            value={
              dialogValue}
            onChange={handelClick}
            isHistory={isHistory}
          />
        )}
        <div className={`absolute right-6 ${isHistory ? "hidden" : null}`}>
          <div
            className={`hidden md:block ${
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
            className={`flex flex-col md:hidden w-[14px] pt-1 ${isHistory ? "hidden" : null}`}
            onClick={handelCtxMenu}
          >
            {isSaved ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <path d="M48 96V416c0 8.8 7.2 16 16 16H384c8.8 0 16-7.2 16-16V170.5c0-4.2-1.7-8.3-4.7-11.3l33.9-33.9c12 12 18.7 28.3 18.7 45.3V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96C0 60.7 28.7 32 64 32H309.5c17 0 33.3 6.7 45.3 18.7l74.5 74.5-33.9 33.9L320.8 84.7c-.3-.3-.5-.5-.8-.8V184c0 13.3-10.7 24-24 24H104c-13.3 0-24-10.7-24-24V80H64c-8.8 0-16 7.2-16 16zm80-16v80H272V80H128zm32 240a64 64 0 1 1 128 0 64 64 0 1 1 -128 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <path
                  d="M48 96V416c0 8.8 7.2 16 16 16H384c8.8 0 16-7.2 16-16V170.5c0-4.2-1.7-8.3-4.7-11.3l33.9-33.9c12 12 18.7 28.3 18.7 45.3V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96C0 60.7 28.7 32 64 32H309.5c17 0 33.3 6.7 45.3 18.7l74.5 74.5-33.9 33.9L320.8 84.7c-.3-.3-.5-.5-.8-.8V184c0 13.3-10.7 24-24 24H104c-13.3 0-24-10.7-24-24V80H64c-8.8 0-16 7.2-16 16zm80-16v80H272V80H128zm32 240a64 64 0 1 1 128 0 64 64 0 1 1 -128 0z"
                  fill="red"
                />
              </svg>
            )}

            <span
              className={`text-[0.7rem] md:text-[0.7rem] ml-[-6px] mt-[-2px] ${
                !isSaved ? " text-red-500 font-bold" : "font-light"
              }`}
            >
              Save
            </span>
          </button>
        </div>
      </div>
    );
  }
};

export default Nav;
