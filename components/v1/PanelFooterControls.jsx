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
        className="min-h-[44px] rounded-md border border-[var(--ink)] px-4 py-2 text-sm font-semibold cursor-pointer hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)] focus-visible:outline-offset-2"
        title="Scroll to today"
      >
        Today
      </button>
      {showSend && <ScreenshotButton />}
    </div>
  );
};

export default PanelFooterControls;
