"use client";
import { useContext } from "react";
import { AppContext } from "@/context/appContext";
export default function SyncStatus() {
  const { syncStatus, retrySync } = useContext(AppContext);
  const labels = { pending: "Saving…", saving: "Saving…", updating: "Updating display…", saved: "Saved", error: "Not saved", "display-error": "Saved · display offline", "signed-out": "Sign in to save" };
  return <div className="flex items-center justify-center gap-2 font-sans text-xs text-[var(--ink-soft)]" role="status" aria-live="polite">
    <span>{labels[syncStatus] || "Saved"}</span>
    {["error", "display-error"].includes(syncStatus) && <button type="button" onClick={retrySync} className="min-h-[44px] underline text-[var(--ink)]">Retry</button>}
  </div>;
}
