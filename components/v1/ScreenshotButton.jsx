"use client";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "@/context/appContext";
import { useToast } from "@/hooks/use-toast";
import { drawDisplay } from "@/utils/displayImage";

export default function ScreenshotButton() {
  const { board } = useContext(AppContext);
  const { toast } = useToast();
  const [sending, setSending] = useState(false);
  const [url, setUrl] = useState("");
  useEffect(() => {
    fetch("/api/v2/upload-screenshot", { cache: "no-store" })
      .then(res => res.ok ? res.json() : null)
      .then(data => { if (data?.url) setUrl(data.url); }).catch(() => {});
  }, []);
  const send = async () => {
    setSending(true);
    try {
      const canvas = drawDisplay(document.createElement("canvas"), board);
      const res = await fetch("/api/v2/upload-screenshot", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: canvas.toDataURL("image/png") }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || "The image could not be sent.");
      setUrl(data.url);
      toast({ title: "Display image updated", description: "Your display will show it on its next refresh. Use View image to open the image for setup." });
    } catch (error) {
      toast({ title: "Not sent to display", description: error.message || "Please try again.", variant: "destructive" });
    } finally { setSending(false); }
  };
  return <div className="min-w-0 flex-1 grid grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-2 sm:gap-3">
    <button type="button" onClick={send} disabled={sending || !board?.habitsNames?.length}
      className="inline-flex min-h-[44px] items-center justify-center whitespace-nowrap rounded-md border border-[var(--ink)] px-2 py-2 font-sans text-xs sm:text-sm font-semibold leading-none hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)] focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      title="Send to display">{sending ? "Sending…" : "Send to display"}</button>
    {url ? <a href={url} target="_blank" rel="noreferrer" className="inline-flex min-h-[44px] items-center justify-center whitespace-nowrap rounded-md border border-[var(--ink)] px-2 py-2 font-sans text-xs sm:text-sm font-semibold leading-none no-underline hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)] focus-visible:outline-offset-2" aria-label="View display image (opens in a new tab)">View image</a> : <button type="button" disabled className="inline-flex min-h-[44px] items-center justify-center whitespace-nowrap rounded-md border border-[var(--ink)] px-2 py-2 font-sans text-xs sm:text-sm font-semibold leading-none opacity-50 cursor-not-allowed" title="Send to display to create an image first">View image</button>}
  </div>;
}
