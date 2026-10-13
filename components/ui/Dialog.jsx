"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import "./styles.css";

const useFitText = (enabled, text) => {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const [fontSize, setFontSize] = useState(null);

  const fitText = () => {
    const container = containerRef.current;
    const el = textRef.current;
    if (!container || !el) return;

    const containerWidth = container.clientWidth;
    if (!containerWidth) return;

    const styles = getComputedStyle(container);
    const maxSize =
      parseFloat(styles.getPropertyValue("--intention-max-size")) || 22;
    const minSize =
      parseFloat(styles.getPropertyValue("--intention-min-size")) || 16;

    let low = Math.floor(minSize);
    let high = Math.floor(maxSize);
    let best = low;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      el.style.fontSize = `${mid}px`;
      if (el.scrollWidth <= containerWidth) {
        best = mid;
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }

    el.style.fontSize = `${best}px`;
    setFontSize((prev) => (prev === best ? prev : best));
  };

  useLayoutEffect(() => {
    if (!enabled) return;
    fitText();
  }, [enabled, text]);

  useEffect(() => {
    if (!enabled) return undefined;
    if (typeof ResizeObserver === "undefined") return undefined;
    const observer = new ResizeObserver(() => {
      requestAnimationFrame(fitText);
    });
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, [enabled, text]);

  return { containerRef, textRef, fontSize };
};

const DialogButton = ({ habit = null, value, onChange, isHistory }) => {
  const displayText = value || "An intention to hold";
  const fitEnabled = !habit;
  const { containerRef, textRef, fontSize } = useFitText(
    fitEnabled,
    displayText
  );

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild disabled={isHistory}>
        <button
          className={`Button violet cursor-pointer${
            fitEnabled ? " intention-title" : ""
          }`}
          ref={fitEnabled ? containerRef : null}
          type="button"
          aria-label={habit ? `Edit ${habit}` : "Edit intention"}
        >
          {habit && (
            <span className="text-[0.8rem] text-center sm:text-[0.9rem] sm:font-semibold">
              {habit}
            </span>
          )}
          {habit && (
            <span className="text-[0.6rem] text-center sm:font-semibold">
              {value}
            </span>
          )}
          {!habit && (
            <span
              ref={textRef}
              className="font-extrabold intention-text"
              style={fontSize ? { fontSize: `${fontSize}px` } : undefined}
            >
              {displayText}
            </span>
          )}
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="DialogOverlay" />
        <Dialog.Content className="DialogContent">
          <Dialog.Title className="DialogTitle">
            <strong>Edit {habit ? "activity" : "intention"}</strong>
            {habit && `: ${habit} - ${value}`}
            {!habit && value && `: ${value}`}
          </Dialog.Title>
          <Dialog.Description className="DialogDescription">
            Adjust the tracked {habit ? "activity" : "intention"} here.
          </Dialog.Description>
          {habit && (
            <fieldset className="Fieldset">
              <label className="Label" htmlFor="activity">
                Activity
              </label>
              <input
                className="Input"
                id="activity"
                defaultValue={habit}
                onChange={(e) => onChange(e, "activity")}
              />
            </fieldset>
          )}
          <fieldset className="Fieldset">
            <label className="Label" htmlFor="value">
              Value
            </label>
            <input
              className="Input"
              id="value"
              defaultValue={value}
              onChange={(e) => onChange(e, "value")}
            />
          </fieldset>
          <div
            style={{ display: "flex", marginTop: 25, justifyContent: "flex-end" }}
          >
            <Dialog.Close asChild>
              {/* <button className="Button green save hover:cursor-pointer">Save changes</button> */}
            </Dialog.Close>
          </div>
          <Dialog.Close asChild>
            <button className="IconButton" aria-label="Close">
              <Cross2Icon />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default DialogButton;
