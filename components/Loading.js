import Image from "next/image";

const Loading = () => {
  return (
    <div className="h-[100vh] flex justify-center items-center">
      <div className="h-[100vh] flex justify-center items-center"> <Image
              src={"/spinner-purple.gif"}
              alt="checkmark"
              priority
              width={80}
              height={80}
              unselectable="on" // To make the image not selectable
              style={{
                userSelect: "none",
                pointerEvents: "none",
              }}
            /></div>
    </div>
  );
}

export default Loading;