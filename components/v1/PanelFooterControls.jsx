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
    <div className="w-full flex items-center justify-center gap-2 sm:gap-3">
      <button
        type="button"
        onClick={handleScrollToToday}
        className="inline-flex min-h-[44px] shrink-0 items-center justify-center rounded-md border border-[var(--ink)] px-3 sm:px-4 py-2 font-sans text-xs sm:text-sm font-semibold leading-none cursor-pointer hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)] focus-visible:outline-offset-2"
        title="Scroll to today"
      >
        Today
      </button>
      {showSend && <ScreenshotButton />}
    </div>
  );
};

export default PanelFooterControls;
