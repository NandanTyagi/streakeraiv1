"use client";
import Image from "next/image";
import { useEffect, useState, useContext } from "react";
import { AppContext } from "@/context/appContext";
import Loading from "@/components/Loading";
import StreakerGrid from "@/components/StreakerGrid";
import AiInputForm from "@/components/AiInputForm";
import StreamComponent from "@/components/StreamComponent";
import { Button } from "@/components/ui/button/Button";
import Nav from "@/components/Nav";

export default function Home() {
  const [showDialog, setShowDialog] = useState(false);
  const {
    board,
    setBoard,
    isAppLoading,
    setCellisAppLoading,
    setisAppLoading,
    openAIResponse,
    openAIResponseHeadersNames,
    openAIResponseHeadersValues,
  } = useContext(AppContext);

  // const handelHabits = (habitKeys, habitValues) => {
  //   setBoard({ ...board, habitsNames: habitKeys, habitsValues: habitValues });
  // };

  useEffect(() => {
    // handelHabits(parseAndExtract(openAIResponse).habitKeys, parseAndExtract(openAIResponse).habitValues);
    console.log("openairesponseheaders", openAIResponseHeadersNames);
    console.log("openairesponseheadersvalues", openAIResponseHeadersValues);
  }, [board, openAIResponseHeadersNames, openAIResponseHeadersValues]);

  return (
    <>
      <div className="flex justify-center items-center bg-[#EBEBEB] text-md font-semibold">
        <div className="">
          <Nav/>
        </div>
      </div>
      {/* {!isAppLoading ? ( */}
        <main className="overflowY-scroll relative flex flex-col justify-center items-center">
          <>
            <AiInputForm />
            <StreamComponent />
          </>
        </main>
    </>
  );
}
