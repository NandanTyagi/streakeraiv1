import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import './styles.css';
import styles from "@/styles/StreakerGridItem.module.css";

const CellDialog = ({message, handleClick, handleDoubleClick, handleMouseDown, handleMouseUp,}) => (
  <Dialog.Root>
    <Dialog.Trigger asChild>
      <button className={`${styles.streakerGridItem}`}
          onClick={handleMouseDown}
          onDoubleClick={handleDoubleClick}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchEnd={handleMouseUp}></button>
    </Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Overlay className="DialogOverlay" />
      <Dialog.Content className="DialogContent">
        <Dialog.Title className="DialogTitle">Note</Dialog.Title>
        <Dialog.Description className="DialogDescription">
          {message}
        </Dialog.Description>
        <fieldset className="Fieldset">
          <label className="Label" htmlFor="message">
            Note
          </label>
          <input className="Input" id="note" defaultValue={message} onChange={(e)=> handleMouseDown(e)} />
        </fieldset>
        <div style={{ display: 'flex', marginTop: 25, justifyContent: 'flex-end' }}>
          <Dialog.Close asChild>
            <button className="Button green">Save changes</button>
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

export default CellDialog;