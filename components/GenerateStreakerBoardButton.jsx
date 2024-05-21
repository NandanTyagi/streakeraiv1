"use client";
import { Button } from "@/components/ui/button/Button";
import { useRouter } from "next/navigation";
import { AppContext } from "@/context/appContext";
import { useEffect, useState, useContext, use } from "react";
import { set } from "mongoose";
import StandardButton from "./v1/StandardButton";

const GenerateStreakerBoardButton = ({ openAIResponse, openAIResponseDescription }) => {
  const { goalToAchieve, board, setBoard} = useContext(AppContext);
  const headerNames = openAIResponse.slice(0, 5);
    const headerValues = openAIResponse.slice(5, 10);
  const [url, setUrl] = useState(`/panel?headerNames=${headerNames}&headerValues=${headerValues}&goalToAchieve=${goalToAchieve}`);
  const router = useRouter();

  return (
    <div className="w-[100%] max-w-[95%] sm:max-w-[600px] rounded-lg  mb-2 sm:mb-6 flex-col px-2 py-6 bg-slate-100 h-[fit-content] min-h-[fit-content]">
      <div className="text-center text-[#530DA2] font-semibold text-lg mb-1 sm:mb-6">
        {`Five suggested habits you should track every day to:`}
        <br/>
        {`${goalToAchieve}!`}
      </div>
      <div className="  mb-1 sm:mb-1 flex justify-evenly gap-1 text-[0.8rem] sm:text-lg italic">
        {openAIResponse &&
          openAIResponse.map(
            (response, index) => index < 5 && <div className="flex justify-center items-center text-center" key={index}>{response}</div>
          )}
              
      </div>
            {/* index < 5 && <div key={index}>{response}
            openAIResponse.map(
            </div> */}
          {/* )} */}
      <div className="mb-1 sm:mb-6 flex justify-evenly gap-1 text-[0.8rem] sm:text-lg italic">
        {openAIResponse &&
          openAIResponse.map(
            (response, index) => index > 4 && <div className="flex justify-center items-center text-center" key={index}>{response}</div>
          )}
      </div>
      <ul>
            {openAIResponseDescription && openAIResponseDescription.map(
              (response, index) => <li className="text-left bg-slate-100 p-2 text-[#272727] font-medium text-md mb-1 sm:mb-1" key={index}>{response}</li>
            )}

      </ul>

      <StandardButton text="Start tracking now!" type="pill" pushTo={url} />

      {/* <Button
        type="button"
        className="bg-[#530DA2] text-white font-semibold cursor-pointer w-[stretch]"
        onClick={handleClick}
      >
        Generate streaker board now!
      </Button> */}
      <Button
        type="button"
        className="bg-[transparent] text-[#530DA2] hover:underline font-semibold cursor-pointer w-[stretch] m-[auto]"
        onClick={() => router.push("/generategoals")}
      >
        Set new goal
      </Button>
    </div>
    
  );
};

export default GenerateStreakerBoardButton;
