"use client";
import { useContext } from "react";
import { AppContext } from "@/context/appContext";
import SyncStatus from "./SyncStatus";
export default function ScreenshotButton() {
  const { displayUrl } = useContext(AppContext);
  const style = "inline-flex min-h-[44px] items-center justify-center whitespace-nowrap rounded-md border border-[var(--ink)] px-3 py-2 font-sans text-xs sm:text-sm font-semibold leading-none no-underline hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)] focus-visible:outline-offset-2";
  return <div className="min-w-0 flex-1 flex items-center justify-end gap-3">
    <SyncStatus />
    {displayUrl ? <a href={displayUrl} target="_blank" rel="noreferrer" className={style} aria-label="View display image (opens in a new tab)">View image</a> : <button disabled className={`${style} opacity-50`} title="Your first saved change creates the image">View image</button>}
  </div>;
}
