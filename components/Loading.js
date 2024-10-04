import Image from "next/image";

const Loading = () => {
  return (
    <div className="h-[100vh] flex justify-center items-center">
      <div className="h-[100vh] flex justify-start items-start pt-20">
        {" "}
        <Image
        className="spin rounded-full"
          src={"/streaker-logo-min.png"}
          // src={"/spinner-purple.gif"}
          alt="checkmark"
          priority
          width={60}
          height={60}
          unselectable="on" // To make the image not selectable
          style={{
            userSelect: "none",
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  );
};

export default Loading;
