"use client";

import { useRef } from "react";
import { useRouter, usePathname } from "next/navigation";

const StandardButton = ({
  action = "button",
  text,
  type = "pill",
  pushTo = "",
}) => {
  const buttonRef = useRef(text);
  const router = useRouter();
  const pathname = usePathname();
  const isSpalshScreen = pathname === "/";

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

  const aboutSvg = (
    <svg
      width="60"
      height="60"
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="30" cy="30" r="30" fill="#330594" />
      <path
        d="M30.172 26.078C29.6867 26.0607 29.2967 25.9133 29.002 25.636C28.7073 25.3587 28.56 24.9687 28.56 24.466C28.5773 23.9287 28.7593 23.4953 29.106 23.166C29.4527 22.8193 29.8947 22.6547 30.432 22.672C30.9347 22.6893 31.3247 22.8367 31.602 23.114C31.8967 23.3913 32.0353 23.7813 32.018 24.284C32.0007 24.804 31.8273 25.2373 31.498 25.584C31.1687 25.9133 30.7267 26.078 30.172 26.078ZM30.198 39.26C29.678 39.26 29.2707 39.1213 28.976 38.844C28.6813 38.5493 28.534 38.0553 28.534 37.362C28.534 36.9633 28.5687 36.5733 28.638 36.192C28.7247 35.8107 28.82 35.438 28.924 35.074C29.0453 34.6927 29.1407 34.3027 29.21 33.904C29.2967 33.5053 29.34 33.0807 29.34 32.63C29.34 32.318 29.2967 32.0233 29.21 31.746C29.1233 31.4513 28.9327 31.2347 28.638 31.096C28.4127 30.9747 28.2133 30.8533 28.04 30.732C27.884 30.5933 27.806 30.42 27.806 30.212C27.806 29.9693 27.9187 29.7093 28.144 29.432C28.3693 29.1547 28.664 28.9207 29.028 28.73C29.4093 28.522 29.7993 28.418 30.198 28.418C30.6313 28.418 30.9433 28.5307 31.134 28.756C31.342 28.9813 31.4807 29.2673 31.55 29.614C31.6193 29.9607 31.654 30.316 31.654 30.68C31.654 31.2347 31.6107 31.7807 31.524 32.318C31.4373 32.838 31.3507 33.3233 31.264 33.774C31.1947 34.1033 31.1427 34.4067 31.108 34.684C31.0733 34.9613 31.056 35.2213 31.056 35.464C31.056 35.8973 31.16 36.2267 31.368 36.452C31.576 36.66 31.8707 36.8593 32.252 37.05C32.408 37.1367 32.486 37.2667 32.486 37.44C32.486 37.5787 32.4167 37.7953 32.278 38.09C32.1393 38.3847 31.8967 38.6533 31.55 38.896C31.2207 39.1387 30.77 39.26 30.198 39.26Z"
        fill="white"
      />
    </svg>
  );

  const handleClick = (id) => {
    console.log(id);
    if (pushTo) {
      router.push(pushTo);
    }
    if (id === "Try for free!") {
      router.push("/generategoals");
    }
    if (id === "Identify") {
      router.push("/generategoals");
    }
    if (id === "Track" || id === "Track now!") {
      router.push("/panel");
    }
    if (id === "Join") {
      router.push("/about");
    }
    if (id === "Identify your goals now!") {
      router.push("/generategoals");
    }
  };

  if (type === "pill") {
    return (
      <button
        onClick={() => handleClick(buttonRef.current.id)}
        title={text}
        type={action}
        id={text}
        className={`group relative inline-flex cursor-pointer w-[100%]  items-center justify-center overflow-hidden rounded-full border-b-2 border-l-2 border-r-2 border-black bg-gradient-to-br from-primary to-[#330594] py-2 px-4 text-white shadow-lg transition duration-100 ease-in-out active:translate-y-0.5 active:border-[#A035C2] active:shadow-none text-center ${pathname === text.toLowerCase().trim() ? "hidden" : ""}`}
        ref={buttonRef}
      >
        <span
          className={`absolute h-0 w-0 rounded-full bg-white opacity-10 transition-all duration-300 ease-out group-hover:h-32 group-hover:w-[100%]`}
        ></span>
        <span className="relative text-md font-semibold flex w-[100%] sm:w-[100%] text-center justify-center items-center">
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
        className={`group relative m-1 inline-flex cursor-pointer items-center justify-center overflow-hidden rounded-full border-t-4 border-b-4 border-l-4 border-r-4 ${
          isSpalshScreen ? "border-[transparent]" : "border-[#330594]"
        }  bg-gradient-to-tr py-6 px-[8px] text-white transition duration-100 ease-in-out active:translate-y-0.5 active:border-[#A035C2] active:shadow-none from-[transparent] to-[transparent] text-center  max-h-[130px] sm:max-h-[200px]`}
        ref={buttonRef}
        id={text}
      >
        <span className="absolute h-0 w-0 rounded-full border-black bg-gradient-to-br from-primary to-[#330594] opacity-10 transition-all duration-300 ease-out group-hover:h-40 group-hover:w-40"></span>
        <div className="flex flex-col justify-between items-center gap-2">
          {text === "Identify" && AiDentifySvg}
          {text === "Track" && trackSvg}
          {text === "Join" && joinSvg}
          {text === "About" && aboutSvg}
          <div
            className={`${
              isSpalshScreen ? "text-white" : "text-black"
            } font-semibold text-sm sm:text-md tracking-[1px]`}
          >
            {text}
          </div>
        </div>
      </button>
    );
  }
};

export default StandardButton;
