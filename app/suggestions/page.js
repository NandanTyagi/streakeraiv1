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
      
      {isAppLoading ? (
        <Loading />
      ) : (
        <main className="scroller m-[auto]  min-h-[80vh] flex flex-col justify-center items-center">
          {openAIResponse ? (
            <GenerateStreakerBoardButton
              openAIResponse={openAIResponse}
              openAIResponseDescription={openAIResponseDescription}
            />
          ) : (
            <>
              <AiInputForm />
              <ButtonGroup />
            </>
          )}
        </main>
      )}
    </>
  );
}
