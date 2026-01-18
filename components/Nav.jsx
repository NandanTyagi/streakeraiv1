"use client";
import Link from "next/link";
import { RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import DialogButton from "@/components/ui/Dialog";
import { useState, useContext, useEffect, use } from "react";
import { AppContext } from "@/context/appContext";
import savePanelToDb from "@/utils/v2/savePanelToDb";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { DashboardIcon } from "@radix-ui/react-icons";
import { ArrowLeftIcon, CrossIcon, X } from "lucide-react";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/shad-dialog";

const Nav = ({ isNav = true, isHistory, currentHistoryItem }) => {
  const { toast } = useToast();
  const { user } = useKindeBrowserClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isAppLoading, setisAppLoading] = useState(false);
  const [showPanelSavedDialog, setShowPanelSavedDialog] = useState(false);
  const { board, setBoard, isSaved, setIsSaved, currentHistoryPanel } =
    useContext(AppContext);
  const [dialogValue, setDialogValue] = useState(
    isHistory ? 'hello' : board?.goalToAchieve || ""
  );

  // 2. State for a generic "Confirm" dialog (to replace window.confirm)
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmDescription, setConfirmDescription] = useState("");
  const [onConfirmCallback, setOnConfirmCallback] = useState(() => {});

  const openConfirmDialog = ({ title, description, onConfirm }) => {
    setConfirmTitle(title);
    setConfirmDescription(description);
    setOnConfirmCallback(() => () => {
      setConfirmOpen(false);
      onConfirm();
    });
    setConfirmOpen(true);
  };

  const handelCtxMenu = async (e) => {
    const hasSearchParams = searchParams.has("headerNames");
    if (isSaved) {
      toast({
        title: "Nothing new to save",
      });
      return;
    }
    e.preventDefault();

    openConfirmDialog({
      title: "Save to the ledger?",
      description: "Write the current marks to the record?",
      onConfirm: async () => {
        // Move the "save" logic into onConfirm
        if (!board) return;

        if (!user) {
          // Old: alert("Not saved! Please login to save changes.");
          toast({
            title: "Not saved",
            description: "Sign in to preserve the ledger.",
            variant: "destructive",
          });
          setIsSaved(true);
          return;
        }

        const panelSaved = await savePanelToDb(board, user?.email);

        // If saving returns an error:
        if (panelSaved && !panelSaved.saved) {
          toast({
            title: "Saving Failed",
            description: `Is panel saved: ${panelSaved.saved}`,
            variant: "destructive",
          });
          return;
        }
        toast({
          title: "Saved",
          variant: "success",
        });
        setIsSaved(true);

        if (hasSearchParams) {
          router.push("/panel");
        }
      },
    });
  };

  const handelClick = (e) => {
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
      alert("Please log in to clear and preserve this ledger.");
      return;
    }

    const clear = window.confirm(
      "Clear the ledger for this panel? This cannot be undone."
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
        debugger;

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
        alert("An error occurred while saving. Please try again.");
      }
    }
  };

  useEffect(() => {
    setDialogValue(isHistory? currentHistoryItem?.goalToAchieve : board?.goalToAchieve || "");
  }, [board, user, currentHistoryPanel]);

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
        <ul className="flex gap-6 sm:gap-20 bg-[var(--paper-veil)] border-b border-[var(--surface-border)] px-4 py-2 text-[var(--ink)]">
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
      <div className="panel-header grid grid-cols-[auto,1fr,auto] items-center gap-3 bg-[var(--paper-veil)] text-md font-semibold cursor-pointer border-b border-[var(--surface-border)] px-4 h-10">
        <div className="flex items-center gap-3">
          {isHistory && (
            <Link href="/history" className="flex items-center justify-center gap-1">
              <ArrowLeftIcon size={16} className="w-4 h-4" />
              <p className="text-sm font-semibold hidden sm:block">Back</p>
            </Link>
          )}
          {user && !isHistory && (
            <button
              className="inline-flex items-center gap-2 border border-[var(--ink)] text-[var(--ink)] px-3 py-1 rounded-md text-xs sm:text-sm font-semibold cursor-pointer hover:opacity-80"
              onClick={(e) => handleClearPanel(e)}
              title="Reset panel"
            >
              Reset
              <X size={14} />
            </button>
          )}
        </div>
        <div className="flex justify-center">
          {!user ? (
            <RegisterLink>Sign up to preserve the ledger</RegisterLink>
          ) : (
            <DialogButton
              value={dialogValue}
              onChange={handelClick}
              isHistory={isHistory}
            />
          )}
        </div>
        <div className="flex items-center justify-end gap-3">
          {isHistory && (
            <Link href="/history/dashboard" className="flex items-center justify-center gap-1">
              <DashboardIcon className="w-4 h-4" />
              <p className="text-sm font-semibold hidden sm:block">Dashboard</p>
            </Link>
          )}
          {!isHistory && (
            <button
              className={`inline-flex items-center gap-2 border px-3 py-1 rounded-md text-xs sm:text-sm font-semibold ${
                !isSaved
                  ? "border-[var(--accent-color)] text-[var(--accent-color)]"
                  : "border-[var(--ink)] text-[var(--ink)]"
              } cursor-pointer hover:opacity-80`}
              onClick={handelCtxMenu}
              title="Save"
            >
              Save
            </button>
          )}
        </div>
        {confirmOpen && (
          <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
            <DialogContent className="bg-[var(--paper-veil)] border border-[var(--surface-border)]">
              <DialogHeader>
                <DialogTitle>{confirmTitle}</DialogTitle>
                <DialogDescription>{confirmDescription}</DialogDescription>
              </DialogHeader>
              <DialogFooter className="gap-2">
                <button
                  className="border border-[var(--surface-border)] px-4 py-2 rounded-md"
                  onClick={() => setConfirmOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-[var(--accent-color)] text-[var(--paper-veil)] px-4 py-2 rounded-md"
                  onClick={onConfirmCallback}
                >
                  Confirm
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    );
  }
};

export default Nav;
