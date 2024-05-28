import Image from "next/image";

const Hero = () => {
  return (
    <div className="relative h-[100%] max-h-[calc(100svh)] flex justify-center items-center w-screen">
    <div className="absolute z-[10] h-[calc(100svh-40px)]  inset-0 bg-black opacity-60 overflow-hidden"></div>
      <div className="absolute w-screen sm:max-w-[1400px] sm:h-[calc(100svh-40px)]  top-0 bottom-0 sm:flex justify-center items-center overflow-hidden">
        <Image src="/streaker-mobile-bg-2.png" alt="logo" priority fill />
      </div>
      <h1 className="absolute z-[10] bottom-[16px] sm:bottom-[8px] text-[2.6rem] pb-2 sm:text-6xl font-semibold text-center text-white w-[100%] font-lato tracking-[4px]">
        Streaker.ai
      </h1>
    </div>
  );
};

export default Hero;
