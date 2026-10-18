"use client";

import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { Copy, ExternalLink, RefreshCw } from "lucide-react";
import { AppContext } from "@/context/appContext";
import { useAppAuth } from "@/hooks/useAppAuth";
import { LoginLink } from "@/components/auth/AuthLinks";
import PanelSwitcher from "@/components/v1/PanelSwitcher";

const buttonStyle = "inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-[var(--ink)] px-4 py-2 text-sm font-semibold disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)]";
const cardStyle = "space-y-4 rounded-xl border border-[var(--surface-border)] bg-[var(--paper-veil)] p-5 sm:p-6";

export default function ProfilePage() {
  const { user, isLoading } = useAppAuth();
  const { board, panels, mainPanelId, panelBusy, panelError, isAppLoading, makeMainPanel, displayUrl, refreshDisplay, syncStatus } = useContext(AppContext);
  const [storedUrl, setStoredUrl] = useState("");
  const [loadingDisplay, setLoadingDisplay] = useState(true);
  const [displayError, setDisplayError] = useState("");
  const [copyStatus, setCopyStatus] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
    setStoredUrl("");
    setCopyStatus("");
    setDisplayError("");
    if (!user?.email) { setLoadingDisplay(false); return; }
    let active = true;
    setLoadingDisplay(true);
    fetch("/api/v2/upload-screenshot", { cache: "no-store" })
      .then(async response => {
        if (!response.ok) throw new Error("Your display link could not be loaded. Please retry.");
        return response.json();
      })
      .then(data => { if (active) setStoredUrl(data.url || ""); })
      .catch(error => { if (active) setDisplayError(error.message); })
      .finally(() => { if (active) setLoadingDisplay(false); });
    return () => { active = false; };
  }, [user?.email, refreshKey]);

  if (isLoading) return <main className="p-6 text-center">Loading profile…</main>;
  if (!user) return <main className="p-6 text-center"><LoginLink className="underline">Sign in to view your profile and display link</LoginLink></main>;

  const path = displayUrl || storedUrl;
  const url = path && origin ? new URL(path, origin).href : "";
  const mainPanel = panels.find(panel => panel.id === mainPanelId);
  const isMain = !board?.isDraft && board?._id === mainPanelId;
  const syncing = ["pending", "saving", "updating"].includes(syncStatus);
  async function copyLink() {
    try { await navigator.clipboard.writeText(url); setCopyStatus("Display link copied."); }
    catch { setCopyStatus("Could not copy automatically. Select and copy the link below."); }
  }

  return <main className="mx-auto w-full max-w-2xl space-y-6 px-4 py-8 pb-16 text-[var(--ink)]">
    <div>
      <h1 className="text-2xl font-semibold">Profile & settings</h1>
      <p className="mt-2 text-[var(--ink-soft)]">Your account, panels, and display in one place.</p>
    </div>
    <section className={cardStyle} aria-labelledby="account-heading">
      <h2 id="account-heading" className="text-lg font-semibold">Account</h2>
      <dl className="space-y-3">
        <div><dt className="text-sm text-[var(--ink-soft)]">Name</dt><dd className="break-words">{[user.given_name,user.family_name].filter(Boolean).join(" ") || "Not provided"}</dd></div>
        <div><dt className="text-sm text-[var(--ink-soft)]">Email</dt><dd className={user.email ? "break-all" : "break-words"}>{user.email || "Verify your email to access your panels and display."}</dd></div>
      </dl>
    </section>
    <section className={cardStyle} aria-labelledby="display-heading">
      <h2 id="display-heading" className="text-lg font-semibold">Your display link</h2>
      <p className="text-sm text-[var(--ink-soft)]">A permanent image link for your main panel. It updates as you track your practices. Anyone with this link can view the image.</p>
      {loadingDisplay && !url ? <p role="status" className="text-sm">Loading display link…</p> : url ? <>
        <label htmlFor="display-link" className="block text-sm font-semibold">Display URL</label>
        <input id="display-link" type="url" readOnly value={url} onFocus={event=>event.target.select()} className="w-full min-w-0 rounded-md border border-[var(--surface-border)] bg-[var(--paper)] p-3 text-base" />
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={copyLink} className={buttonStyle}><Copy size={16} aria-hidden="true" />Copy link</button>
          <a href={url} target="_blank" rel="noreferrer" className={buttonStyle}><ExternalLink size={16} aria-hidden="true" />Open display</a>
        </div>
        <p role="status" className="text-sm">{copyStatus}</p>
      </> : !displayError && <p className="text-sm">{panels.length ? "Your display image is not ready yet. Choose your main panel below, then update its display." : "Save your first panel to set up your display."}</p>}
      {displayError && <div role="alert" className="text-sm"><p>{displayError}</p><button type="button" onClick={()=>setRefreshKey(value=>value+1)} className="min-h-[44px] underline">Retry loading link</button></div>}
      <p className="text-sm"><span className="text-[var(--ink-soft)]">Main panel: </span>{isAppLoading ? "Loading…" : mainPanel?.title || "No saved panel yet"}</p>
      {isMain && <button type="button" disabled={panelBusy || syncing || isAppLoading} onClick={refreshDisplay} className={buttonStyle}><RefreshCw size={16} aria-hidden="true" />{syncing ? "Updating display…" : "Update display"}</button>}
      {syncStatus === "error" && <p role="alert" className="text-sm text-[var(--danger)]">Your panel could not be saved. Try Update display again to retry saving and publishing.</p>}
      {syncStatus === "display-error" && <p role="alert" className="text-sm text-[var(--danger)]">Your panel is saved, but its display could not be updated. Try Update display again.</p>}
    </section>
    <section className={cardStyle} aria-labelledby="panels-heading">
      <h2 id="panels-heading" className="text-lg font-semibold">Panels</h2>
      {!panels.length && panelError && <p role="alert" className="text-sm text-[var(--danger)]">{panelError}</p>}
      {panels.length > 0 && <>
        <PanelSwitcher />
        <p className="text-sm text-[var(--ink-soft)]">{board?.isDraft ? "Save this draft before using it on your display." : `Selected panel: ${board?.habitsNames?.length || 0} practices.`}</p>
        {!isMain && board?._id && !board.isDraft && <button type="button" disabled={panelBusy || isAppLoading} onClick={makeMainPanel} className={buttonStyle}>Use selected panel on display</button>}
      </>}
      <p className="text-sm text-[var(--ink-soft)]">Choose 1–5 practices when you create a panel. Each practice gets its own column.</p>
      <Link href="/generategoals" className={buttonStyle}>Start a new panel</Link>
    </section>
  </main>;
}
