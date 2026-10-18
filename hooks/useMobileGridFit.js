"use client";

import { useLayoutEffect } from "react";

const VISIBLE_DAY_ROWS = 12;
const HEADER_ROWS = 1;
const MOBILE_QUERY = "(max-width: 767px)";

const toNumber = (value) => {
  const parsed = parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const applyRowHeight = (container, desktop = false) => {
  const height = container.clientHeight;
  if (!height) return;

  const styles = getComputedStyle(container);
  const gap = toNumber(styles.getPropertyValue("--grid-gap"));
  const rowHeight = desktop
    ? Math.max(32, (height - toNumber(styles.getPropertyValue("--grid-header-height")) - gap * 13) / 14)
    : (height - gap * (VISIBLE_DAY_ROWS - 1)) / (VISIBLE_DAY_ROWS + HEADER_ROWS);

  if (rowHeight > 0) {
    container.style.setProperty("--grid-row-height", `${rowHeight}px`);
  }
};

export default function useMobileGridFit({ containerRef, selector = ".panel-scroll", fitDesktop = false } = {}) {
  useLayoutEffect(() => {
    const container = containerRef?.current ?? document.querySelector(selector);
    if (!container) return undefined;

    const media = window.matchMedia(MOBILE_QUERY);

    let frame;
    const update = () => {
      cancelAnimationFrame(frame);
      if (!media.matches && (!fitDesktop || document.documentElement.dataset.renderMode === "snapshot-eink")) {
        container.style.removeProperty("--grid-row-height");
        return;
      }
      const desktop = !media.matches && fitDesktop;
      applyRowHeight(container, desktop);
      if (desktop) {
        // Re-anchor after sizing so today ends the 14-row overview, including
        // when a loaded panel replaces the loading placeholder or is resized.
        frame = requestAnimationFrame(() => {
          const today = container.querySelector('[data-today-row="true"]');
          if (!today) return;
          const bottom = today.getBoundingClientRect().bottom - container.getBoundingClientRect().top + container.scrollTop;
          container.scrollTo({ top: Math.max(0, bottom - container.clientHeight), behavior: "instant" });
        });
      }
    };

    update();

    const observer = new ResizeObserver(() => update());
    observer.observe(container);

    const contentObserver = new MutationObserver(update);
    contentObserver.observe(container, { childList: true });
    media.addEventListener("change", update);

    return () => {
      observer.disconnect();
      contentObserver.disconnect();
      cancelAnimationFrame(frame);
      container.style.removeProperty("--grid-row-height");
      media.removeEventListener("change", update);
    };
  }, [containerRef, selector, fitDesktop]);
}
