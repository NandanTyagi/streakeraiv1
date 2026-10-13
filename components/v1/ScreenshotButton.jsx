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
      toast({ title: "Display image updated", description: "Your display will show it on its next refresh. Use the Display image link below for setup." });
    } catch (error) {
      toast({ title: "Not sent to display", description: error.message || "Please try again.", variant: "destructive" });
    } finally { setSending(false); }
  };
  return <div className="w-full flex flex-col items-center gap-1">
    <button type="button" onClick={send} disabled={sending || !board?.habitsNames?.length}
      className="min-h-[44px] w-full max-w-[280px] rounded-md border border-[var(--ink)] px-4 py-2 text-sm font-semibold leading-none disabled:opacity-50 disabled:cursor-not-allowed"
      title="Send to display">{sending ? "Sending…" : "Send to display"}</button>
    {url && <a href={url} target="_blank" rel="noreferrer" className="text-xs underline">Display image</a>}
  </div>;
}
