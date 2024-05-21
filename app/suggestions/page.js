"use client";
import Image from "next/image";
import { useEffect, useState, useContext } from "react";
import { AppContext } from "@/context/appContext";
import Loading from "@/components/Loading";
import StreakerGrid from "@/components/StreakerGrid";
import AiInputForm from "@/components/AiInputForm";
import StreamComponent from "@/components/StreamComponent";
import parseAndExtract from "@/utils/openai/parseAndExtract";
import { Button } from "@/components/ui/button/Button";
import GenerateStreakerBoardButton from "@/components/GenerateStreakerBoardButton";
import Header from "@/components/Header";
import ButtonGroup from "@/components/v1/ButtonGroup";

export default function Home() {
  const [showDialog, setShowDialog] = useState(false);
  const {
    board,
    setBoard,
    isAppLoading,
    setCellisAppLoading,
    setisAppLoading,
    openAIResponse,
    openAIResponseDescription,
    openAIResponseHeadersNames,
    openAIResponseHeadersValues,
  } = useContext(AppContext);

  useEffect(() => {
    // handelHabits(parseAndExtract(openAIResponse).habitKeys, parseAndExtract(openAIResponse).habitValues);
    console.log("openairesponseheaders", openAIResponseHeadersNames);
    console.log("openairesponseheadersvalues", openAIResponseHeadersValues);
  }, [board, openAIResponseHeadersNames, openAIResponseHeadersValues]);

  return (
    <>
      <div className="h-[80px] bg-[#330594] grid content-center">
        <Header />
      </div>
      <main className="overflowY-scroll relative flex flex-col justify-evenly items-center min-h-[80dvh] max-h-[80dvh] ">
        {!isAppLoading ? (
          <>
            {openAIResponse ? (
              <GenerateStreakerBoardButton
                openAIResponse={openAIResponse}
                openAIResponseDescription={openAIResponseDescription}
              />
            ) : (
              <AiInputForm />
            )}
          </>
        ) : (
          <Loading />
        )}
        <ButtonGroup />
      </main>
    </>
  );
}
