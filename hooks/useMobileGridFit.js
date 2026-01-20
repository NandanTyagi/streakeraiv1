"use client";

import { useLayoutEffect } from "react";

const VISIBLE_DAY_ROWS = 12;
const HEADER_ROWS = 1;
const MOBILE_QUERY = "(max-width: 767px)";

const toNumber = (value) => {
  const parsed = parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const applyRowHeight = (container) => {
  const height = container.clientHeight;
  if (!height) return;

  const styles = getComputedStyle(container);
  const gap = toNumber(styles.getPropertyValue("--grid-gap"));
  const rowHeight =
    (height - gap * (VISIBLE_DAY_ROWS - 1)) / (VISIBLE_DAY_ROWS + HEADER_ROWS);

  if (rowHeight > 0) {
    container.style.setProperty("--grid-row-height", `${rowHeight}px`);
  }
};

export default function useMobileGridFit({ containerRef, selector = ".panel-scroll" } = {}) {
  useLayoutEffect(() => {
    const container = containerRef?.current ?? document.querySelector(selector);
    if (!container) return undefined;

    const media = window.matchMedia(MOBILE_QUERY);

    const update = () => {
      if (!media.matches) {
        container.style.removeProperty("--grid-row-height");
        return;
      }
      applyRowHeight(container);
    };

    update();

    const observer = new ResizeObserver(() => update());
    observer.observe(container);

    media.addEventListener("change", update);

    return () => {
      observer.disconnect();
      media.removeEventListener("change", update);
    };
  }, [containerRef, selector]);
}
