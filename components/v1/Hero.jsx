import Image from "next/image";

const Hero = () => {
  return (
    <div className="relative h-[100%] flex justify-center items-center w-screen">
      <div className="absolute w-screen sm:max-w-[1400px] top-0 bottom-0 sm:flex justify-center items-center">
        <Image src="/streaker-mobile-bg-2.png" alt="logo" priority fill />
      </div>
      <h1 className="absolute bottom-[8px] text-6xl sm:text-6xl font-medium text-center text-black w-[100%] font-lato tracking-[4px]">
        StreakerAi
      </h1>
    </div>
  );
};

export default Hero;
