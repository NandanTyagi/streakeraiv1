import Image from "next/image";

const Loading = () => {
  return (
    <div
      className="flex flex-col justify-center items-center h-[calc(100vh-80px)] bg-[var(--paper)]"
      role="status"
      aria-live="polite"
    >
      <div className="h-[100vh] flex flex-col justify-start items-center pt-20 gap-3 text-center">
        <Image
        className="spin rounded-full"
          src={"/streaker-logo-min.png"}
          // src={"/spinner-purple.gif"}
          alt="Streaker logo"
          priority
          width={60}
          height={60}
          unselectable="on" // To make the image not selectable
          style={{
            userSelect: "none",
            pointerEvents: "none",
          }}
        />
        <p className="text-sm text-[var(--ink-soft)]">Loading ledger...</p>
      </div>
    </div>
  );
};

export default Loading;
