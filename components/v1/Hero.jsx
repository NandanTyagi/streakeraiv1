import Image from "next/image";

const Hero = () => {
  return (
    <div className="">
      <div className="absolute z-[10] inset-0 bg-black opacity-60"></div>

      <Image src="/streaker-mobile-bg-2.png" alt="logo" priority fill />

      <h1 className="absolute z-[10] bottom-[80px] sm:bottom-[80px] text-[2.6rem] pb-2 sm:text-6xl font-semibold text-center text-white w-[100%] font-lato tracking-[4px]">
        Streaker.ai
      </h1>
    </div>
  );
};

export default Hero;
