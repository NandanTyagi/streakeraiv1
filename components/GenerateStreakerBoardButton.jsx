"use client";
import { Button } from "@/components/ui/button/Button";
import { useRouter } from "next/navigation";
import { AppContext } from "@/context/appContext";
import { useState, useContext } from "react";
import StandardButton from "./v1/StandardButton";
import DOMPurify from "dompurify";
import styles from "@/styles/GenerateStreakerBoardButton.module.css";

const GenerateStreakerBoardButton = ({
  openAIResponse,
  openAIResponseDescription,
}) => {
  const { goalToAchieve, board, setBoard } = useContext(AppContext);
  const headerNames = openAIResponse.slice(0, 5);
  const headerValues = openAIResponse.slice(5, 10);
  const [url, setUrl] = useState(
    `/panel?headerNames=${headerNames}&headerValues=${headerValues}&goalToAchieve=${goalToAchieve}`
  );
  const router = useRouter();

  return (
    <div className="p-6 overflow-x-hidden max-h-[80vh]">
      <div className="text-center text-[#530DA2] font-semibold text-lg mb-1 sm:mb-6">
        {`Five habits you should track every day to achieve:`}
        <br />
        <div className="p-1 mt-2 italic">{`"${goalToAchieve}"`}</div>
      </div>
      <div className="  mb-1 sm:mb-1 flex justify-center gap-1 text-[0.8rem] sm:text-lg italic">
        {openAIResponse &&
          openAIResponse.slice(0, 5).map((response, index) => (
            <div
              className="flex flex-col justify-center items-center text-center p-2 min-w-[18%] "
              key={response.id || index} // Use a unique identifier if available
            >
              <div className="font-semibold">{response}</div>
              <div className="font-normal">{openAIResponse[index + 5]}</div>
            </div>
          ))}


      </div>
      {/* <div className="mb-1 sm:mb-6 flex justify-evenly gap-1 text-[0.8rem] sm:text-lg italic">
        {openAIResponse &&
          openAIResponse.map(
            (response, index) =>
              index > 4 &&
              index < 10 && (
                <div
                  className="flex justify-center items-center text-center"
                  key={index}
                >
                  {response}
                </div>
              )
          )}
      </div> */}

      <div
        className={`${styles.description} text-left bg-slate-100 p-2 text-[#272727] font-medium text-md mb-1 sm:mb-1`}
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(cleanText(openAIResponseDescription)),
        }}
      ></div>

      <StandardButton text="Start tracking now!" type="pill" pushTo={url} />

      <button
        type="button"
        className="bg-[transparent] text-[#530DA2] hover:underline font-semibold cursor-pointer w-[stretch] m-[auto] mb-[8px]"
        onClick={() => router.push("/generategoals")}
      >
        Set new goal
      </button>
    </div>
  );
};

export default GenerateStreakerBoardButton;

function cleanText(text) {
  if (!text) return "";
  // Remove all instances of ```html and ```
  return text.replace(/```html|```/g, "").trim();
}
