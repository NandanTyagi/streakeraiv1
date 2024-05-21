"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";

const StandardButton = ({ text, type = "pill", pushTo = "" }) => {
  const buttonRef = useRef(text);
  const router = useRouter();

  const AiDentifySvg = (
    <svg
      width="60"
      height="60"
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="30" cy="30" r="30" fill="#330594" />
      <circle cx="30.225" cy="29.2262" r="9.08333" stroke="white" />
      <path d="M30.4989 18V22.9286" stroke="white" stroke-linecap="round" />
      <path d="M30.4989 36.0714V41" stroke="white" stroke-linecap="round" />
      <path
        d="M36.8876 29.5L41.9973 29.6012"
        stroke="white"
        strokeLinecap="round"
      />
      <path d="M19 29.3988L24.1098 29.5" stroke="white" strokeLinecap="round" />
      <circle cx="30.4989" cy="29.5" r="1.09524" fill="#D9D9D9" />
    </svg>
  );

  const trackSvg = (
    <svg
      width="60"
      height="60"
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="30" cy="30" r="30" fill="#330594" />
      <line
        x1="41.3536"
        y1="18.3536"
        x2="15.3536"
        y2="44.3536"
        stroke="white"
      />
      <path
        d="M13.3667 22.9822C13.179 22.7796 12.8627 22.7676 12.6601 22.9553C12.4576 23.143 12.4456 23.4593 12.6333 23.6619L13.3667 22.9822ZM12.6333 23.6619L15.8858 27.1718L16.6193 26.492L13.3667 22.9822L12.6333 23.6619Z"
        fill="#30FF0F"
      />
      <path
        d="M24.3399 19.3668C24.5424 19.1791 24.5544 18.8627 24.3667 18.6602C24.179 18.4576 23.8627 18.4456 23.6601 18.6333L24.3399 19.3668ZM16.6181 26.5224L24.3399 19.3668L23.6601 18.6333L15.9384 25.7889L16.6181 26.5224Z"
        fill="#30FF0F"
      />
      <line
        x1="41.7038"
        y1="35.2834"
        x2="34.6179"
        y2="43.2378"
        stroke="#FF0000"
        strokeLinecap="round"
      />
      <line
        x1="42.0651"
        y1="42.8076"
        x2="34.1106"
        y2="35.7219"
        stroke="#FF0000"
        strokeLinecap="round"
      />
    </svg>
  );

  const joinSvg = (
    <svg
      width="60"
      height="60"
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="30" cy="30" r="30" fill="#330594" />
      <line
        x1="37.5056"
        y1="24.5189"
        x2="37.5003"
        y2="32.5003"
        stroke="white"
        strokeLinecap="round"
      />
      <line
        x1="41.4981"
        y1="28.4981"
        x2="33.5198"
        y2="28.4674"
        stroke="white"
        strokeLinecap="round"
      />
      <circle cx="24.5" cy="24.5" r="3.5" fill="white" />
      <path
        d="M23 30.5H27C30.0376 30.5 32.5 32.9624 32.5 36V37.5H17.5V36C17.5 32.9624 19.9624 30.5 23 30.5Z"
        fill="white"
        stroke="white"
      />
    </svg>
  );

  const handleClick = (id) => {
    console.log(id);
    if (pushTo) {
      router.push(pushTo);
    }
    if (id === "Try free!") {
      router.push("/generategoals");
    }
    if (id === "AiDentify") {
      router.push("/generategoals");
    }
    if (id === "Track") {
      router.push("/panel");
    }
    if (id === "Join") {
      router.push("/about");
    }
  };

  if (type === "pill") {
    return (
      <button
        onClick={() => handleClick(buttonRef.current.id)}
        title={text}
        className={`group relative m-1 inline-flex cursor-pointer w-[100%]  items-center justify-center overflow-hidden rounded-full border-b-2 border-l-2 border-r-2 border-[#330594] bg-gradient-to-tr py-4 text-white shadow-lg transition duration-100 ease-in-out active:translate-y-0.5 active:border-[#A035C2] active:shadow-none from-[#330594] to-[#330594] text-center`}
        ref={buttonRef}
        id={text}
      >
        <span className="absolute h-0 w-0 rounded-full bg-white opacity-10 transition-all duration-300 ease-out group-hover:h-32 group-hover:w-[100%]"></span>
        <span className="relative text-xl font-semibold flex w-[100%] sm:w-[100%] text-center justify-center items-center">
          {text}
        </span>
      </button>
    );
  }

  if (type === "round") {
    return (
      <button
        onClick={() => handleClick(buttonRef.current.id)}
        title={text}
        className={`group relative m-1 inline-flex cursor-pointer items-center justify-center overflow-hidden rounded-full border-t-4 border-b-4 border-l-4 border-r-4 border-[#330594] bg-gradient-to-tr py-6 px-[8px] text-white transition duration-100 ease-in-out active:translate-y-0.5 active:border-[#A035C2] active:shadow-none from-[#ffffff] to-[#ffffff] text-center`}
        ref={buttonRef}
        id={text}
      >
        <span className="absolute h-0 w-0 rounded-full bg-white opacity-10 transition-all duration-300 ease-out group-hover:h-32 group-hover:w-32"></span>
        <div className="flex flex-col justify-between items-center gap-2">
          {text === "AiDentify" && AiDentifySvg}
          {text === "Track" && trackSvg}
          {text === "Join" && joinSvg}
          <div className="text-black font-semibold text-md tracking-[1px]">
            {text}
          </div>
        </div>
      </button>

      //   <button className="cursor-pointer">
      //     <div className="flex flex-col justify-between items-center gap-2">
      //       {text === "AiDentify" && AiDentifySvg }
      //       {text === "Track" && trackSvg }
      //       {text === "Join" && joinSvg }
      //       <div className="text-black font-semibold text-md tracking-[1px]">{text}</div>
      //     </div>
      //   </button>
    );
  }
};

export default StandardButton;
