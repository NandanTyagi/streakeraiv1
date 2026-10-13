"use client";
import { useEffect, useRef, useState } from "react";
import savePanelToDb from "@/utils/v2/savePanelToDb";
import { createAutosaveQueue } from "@/utils/autosaveQueue";
import { drawDisplay } from "@/utils/displayImage";

export default function usePanelAutosave({ board, isSaved, setIsSaved, email, loading }) {
  const [status, setStatus] = useState("saved");
  const [displayUrl, setDisplayUrl] = useState("");
  const queue = useRef();
  const canDisplay = !!email && (process.env.NEXT_PUBLIC_ALLOWED_USERS || "").split(",").includes(email);
  useEffect(() => {
    setDisplayUrl("");
    setStatus("saved");
    if (!email) return;
    let active = true;
    let persisted;
    const worker = createAutosaveQueue({
      save: async (snapshot) => {
        const result = await savePanelToDb({ ...snapshot, ...(persisted ? { _id: persisted._id, history: persisted.history } : {}) }, email);
        if (!result?.saved) throw new Error(result?.message || "Save failed");
        if (result.panel) persisted = result.panel;
      },
      publish: canDisplay ? async (snapshot) => {
        try {
          const canvas = drawDisplay(document.createElement("canvas"), snapshot);
          const response = await fetch("/api/v2/upload-screenshot", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ image: canvas.toDataURL("image/png") }),
          });
          const data = await response.json();
          if (!response.ok || !data.url) throw new Error("Display update failed");
          if (active) setDisplayUrl(data.url);
        } catch (error) { error.display = true; throw error; }
      } : undefined,
      onSaved: () => { if (active) setIsSaved(true); },
      onState: setStatus,
    });
    queue.current = worker;
    if (canDisplay) fetch("/api/v2/upload-screenshot", { cache: "no-store" })
      .then(res => res.ok ? res.json() : null)
      .then(data => { if (active && data?.url) setDisplayUrl(data.url); }).catch(() => {});
    return () => { active = false; worker.dispose(); queue.current = undefined; };
  }, [email, canDisplay, setIsSaved]);
  useEffect(() => {
    if (!loading && !isSaved && board?.habitsNames?.length) queue.current?.enqueue(board);
  }, [board, isSaved, loading, email]);
  useEffect(() => {
    const warn = (event) => {
      if (!isSaved || ["pending", "saving", "updating", "display-error"].includes(status)) {
        event.preventDefault(); event.returnValue = "";
      }
    };
    const retry = () => queue.current?.retry();
    window.addEventListener("beforeunload", warn);
    window.addEventListener("online", retry);
    return () => { window.removeEventListener("beforeunload", warn); window.removeEventListener("online", retry); };
  }, [isSaved, status]);
  return { syncStatus: email ? status : "signed-out", displayUrl, retrySync: () => queue.current?.retry() };
}
