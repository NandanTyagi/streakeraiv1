"use client";
import Link from "next/link";
import { RegisterLink } from "@/components/auth/AuthLinks";
import { useAppAuth } from "@/hooks/useAppAuth";
import DialogButton from "@/components/ui/Dialog";
import { useState, useContext, useEffect, use } from "react";
import { AppContext } from "@/context/appContext";
import SyncStatus from "@/components/v1/SyncStatus";
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
  const { user } = useAppAuth();
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
      toast({
        title: "Sign in required",
        description: "Sign in to clear and preserve the ledger.",
        variant: "destructive",
      });
      return;
    }

    openConfirmDialog({
      title: "Clear this ledger?",
      description: "This removes all marks in the current panel. This cannot be undone.",
      onConfirm: async () => {
        const updatedBoard = {
          ...board,
          cells: [],
        };

        setBoard(updatedBoard);

        setIsSaved(false);

      },
    });
  };

  useEffect(() => {
    setDialogValue(isHistory? currentHistoryItem?.goalToAchieve : board?.goalToAchieve || "");
  }, [board, user, currentHistoryPanel, currentHistoryItem?.goalToAchieve, isHistory]);


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
      <div className="panel-header grid grid-cols-[auto,1fr,auto] items-center gap-4 bg-[var(--paper-veil)] text-sm font-semibold cursor-pointer border-b border-[var(--surface-border)] px-4 py-2 min-h-[48px]">
        <div className="flex items-center gap-3">
          {isHistory && (
            <Link href="/history" className="flex items-center justify-center gap-1">
              <ArrowLeftIcon size={16} className="w-4 h-4" />
              <p className="text-sm font-semibold hidden sm:block">Back</p>
            </Link>
          )}
          {user && !isHistory && (
            <button
              className="inline-flex min-h-[44px] items-center gap-2 border border-[var(--ink)] text-[var(--ink)] px-3 py-2 rounded-md text-xs sm:text-sm font-semibold cursor-pointer hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)] focus-visible:outline-offset-2"
              onClick={(e) => handleClearPanel(e)}
              title="Reset panel"
            >
              Reset
              <X size={14} />
            </button>
          )}
        </div>
        <div className="flex justify-center min-w-0">
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
          {!isHistory && <SyncStatus />}
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
                  className="min-h-[40px] border border-[var(--surface-border)] px-4 py-2 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)] focus-visible:outline-offset-2"
                  onClick={() => setConfirmOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="min-h-[40px] bg-[var(--accent-color)] text-[var(--paper-veil)] px-4 py-2 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)] focus-visible:outline-offset-2"
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
