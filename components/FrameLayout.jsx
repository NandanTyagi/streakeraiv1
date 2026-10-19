"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Maximize, Minimize } from "lucide-react";

export default function FrameLayout({ children }) {
  const [fullscreen, setFullscreen] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const update = () => setFullscreen(Boolean(document.fullscreenElement));
    update();
    document.addEventListener("fullscreenchange", update);
    return () => document.removeEventListener("fullscreenchange", update);
  }, []);

  useEffect(() => {
    let lock;
    let disposed = false;
    const acquire = async () => {
      if (!fullscreen || document.visibilityState !== "visible" || !navigator.wakeLock) return;
      try {
        const next = await navigator.wakeLock.request("screen");
        if (disposed) await next.release();
        else lock = next;
      } catch { /* Fullscreen still works when the browser denies a wake lock. */ }
    };
    acquire();
    document.addEventListener("visibilitychange", acquire);
    return () => {
      disposed = true;
      document.removeEventListener("visibilitychange", acquire);
      if (lock) lock.release().catch(() => {});
    };
  }, [fullscreen]);

  async function toggleFullscreen() {
    setError("");
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (document.documentElement.requestFullscreen) {
        // Call directly in the tap handler: browsers require user activation.
        await document.documentElement.requestFullscreen();
      } else setError("This browser cannot enter fullscreen. Frame view still fills the available space.");
    } catch {
      setError("Fullscreen could not start. Tap Enter fullscreen to try again.");
    }
  }

  return <div className={`frame-layout${fullscreen ? " frame-layout-fullscreen" : ""}`}>
    <div className="frame-brand" aria-label="Streaker Beta">
      <span className="frame-brand-icon" aria-hidden="true" />
      <span>Streaker</span><span className="frame-brand-beta">Beta</span>
    </div>
    <div className="frame-view-controls">
      <Link className="frame-back" href="/panel">Back to panel</Link>
      <button type="button" className="frame-fullscreen-toggle" onClick={toggleFullscreen}
        aria-label={fullscreen ? "Exit fullscreen" : "Enter fullscreen"} title={fullscreen ? "Exit fullscreen" : "Enter fullscreen"}>
        {fullscreen ? <Minimize size={20} /> : <><Maximize size={20} /><span>Enter fullscreen</span></>}
      </button>
    </div>
    {error && <p className="frame-view-error" role="alert">{error}</p>}
    {children}
  </div>;
}
