"use client";

import { useCallback } from "react";
import ScreenshotButton from "./ScreenshotButton";

const PanelFooterControls = ({ showSend }) => {
  const handleScrollToToday = useCallback(() => {
    const todayRow = document.querySelector('[data-today-row="true"]');
    if (!todayRow) return;
    todayRow.scrollIntoView({ behavior: "smooth", block: "end" });
  }, []);

  return (
    <div className="w-full flex items-center justify-center gap-3">
      <button
        type="button"
        onClick={handleScrollToToday}
        className="rounded-md border border-[var(--ink)] px-4 py-2 text-sm font-semibold cursor-pointer hover:opacity-80"
        title="Scroll to today"
      >
        Today
      </button>
      {showSend && <ScreenshotButton />}
    </div>
  );
};

export default PanelFooterControls;
