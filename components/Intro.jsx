'use client';
import { gsap } from "gsap";
import { useLayoutEffect, useRef } from "react";
import { Button } from "@/components/ui/button/Button"
import { useRouter } from "next/navigation"
const Intro = () => {
  const comp = useRef(null);
    const router = useRouter();

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.from("#intro-slider", {
        xPercent: "-100",
        duration: 1.3,
        delay: 0.3,
      }).to(["#identify", "#track", "#achieve"], {
        opacity: 1,
        y: "-=30",
        duration: 0.5,
        stagger: 0.5,
      }).to(["#identify", "#track", "#achieve"], {
        opacity: 0,
        y: "-=30",
        duration: 1,
        delay: 1,
        stagger: 0.5,
      }).to("#intro-slider", {
        xPercent: "-100",
        duration: 1.3,
      }).from("#streaker", {
        opacity: 0,
        y: "+=30",
        duration: 0.5,
      }).from("#button", {
        opacity: 0,
        y: "+=30",
        duration: 0.5,
      })
    }, comp);
    return () => ctx.revert();
  }, []);

  return (
    <div className="relative h-[100%] overflow-hidden" ref={comp}>
      <div className="h-[100%] bg-white justify-center place-items-center absolute inset-0 w-full flex flex-col z-10" id="intro-slider">
      <div>
        <h1 className={`font-bold text-5xl sm:text-8xl mb-2 opacity-0`} id="identify">
          Identify
        </h1>
        <h1 className={`font-bold text-5xl sm:text-8xl mb-2 opacity-0`} id="track">
          Track
        </h1>
        <h1 className={`font-bold text-5xl sm:text-8xl opacity-0`} id="achieve">
          Achieve
        </h1>
      </div>
      </div>
      <div className="flex flex-col justify-center bg-black place-items-center h-[100%] ">
        <h1 className={`font-bold  text-5xl sm:text-9xl text-white opacity-[1] mb-4 sm:mb-20`} id="streaker">
          Streaker.ai
        </h1>
        <Button id="button" type="button" onClick={() => router.push('/generategoals')} className="bg-[#530DA2] font-semibold text-[1.1rem] sm:max-w-[300px] max-w-[200px] text-white cursor-pointer w-[stretch]">Identify your goals now!</Button>
      </div>
    </div>
  );
};

export default Intro;
