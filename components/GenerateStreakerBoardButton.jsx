"use client";
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
    <div className="p-6 overflow-x-hidden max-h-[80vh] max-w-[800px]">
      <div className="text-center text-[var(--ink)] font-semibold text-lg mb-1 sm:mb-6">
        {`Five daily practices for the intention:`}
        <br />
        <div className="p-1 mt-2 italic text-[var(--ink-soft)]">{`"${goalToAchieve}"`}</div>
      </div>
      <div className="mb-1 sm:mb-1 flex justify-center gap-1 text-[0.8rem] sm:text-lg italic text-[var(--ink-soft)]">
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

      <div
        className={`${styles.description} text-left bg-[var(--paper-veil)] border border-[var(--surface-border)] p-3 text-[var(--ink)] font-medium text-md mb-1 sm:mb-1`}
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(cleanText(openAIResponseDescription)),
        }}
      ></div>

      <StandardButton text="Open this ledger" type="pill" pushTo={url} />

      <button
        type="button"
        className="bg-[transparent] text-[var(--accent-color)] hover:underline font-semibold cursor-pointer w-[stretch] m-[auto] mb-[8px]"
        onClick={() => router.push("/generategoals")}
      >
        Set a different intention
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
