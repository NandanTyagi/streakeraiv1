import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import "./styles.css";

const DialogButton = ({ habit = null, value, onChange }) => (
  <Dialog.Root>
    <Dialog.Trigger asChild>
      <button className="Button violet cursor-pointer">
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
          <span className="font-extrabold text-[1rem] md:hidden">
            {value.length > 25
              ? value.substring(0, 25) + "..."
              : value || "I want to live a healthy life"}
          </span>
        )}
        {!habit && (
          <span className="font-extrabold text-[1rem] hidden md:block">
            {value.length > 60
              ? value.substring(0, 60) + "..."
              : value || "I want to live a healthy life"}
          </span>
        )}
      </button>
    </Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Overlay className="DialogOverlay" />
      <Dialog.Content className="DialogContent">
        <Dialog.Title className="DialogTitle">
          <strong>Edit {habit ? "activity" : "goal"}</strong>
          {habit && `: ${habit} - ${value}`}
          {!habit && value && `: ${value}`}
        </Dialog.Title>
        <Dialog.Description className="DialogDescription">
          Make changes to your tracked {habit ? "activity" : "goal"} here.
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

export default DialogButton;
