
"use client";
import Intro from "@/components/Intro";
import NewIntro from "@/components/v1/NewIntro";
import {
  useEffect,
  useState,
  useContext,
  useRef,
  useLayoutEffect,
} from "react";
import { AppContext } from "@/context/appContext";
import Nav from "@/components/Nav";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button/Button";
import {
  RegisterLink,
  LoginLink,
  LogoutLink,
} from "@kinde-oss/kinde-auth-nextjs/components";

export default function Home() {
  const router = useRouter();
  const signUpRef = useRef(null);

  const [showDialog, setShowDialog] = useState(false);
  const {
    board,
    openAIResponseHeadersNames,
    openAIResponseHeadersValues,
  } = useContext(AppContext);

  useEffect(() => {
    console.log("openairesponseheaders", openAIResponseHeadersNames);
    console.log("openairesponseheadersvalues", openAIResponseHeadersValues);
  }, [board, openAIResponseHeadersNames, openAIResponseHeadersValues]);

  useLayoutEffect(() => {
    setTimeout(() => {
      signUpRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }, 9000);
  }, []);

  return (
    <>
      {/* <div className="flex justify-center items-center bg-[#EBEBEB] text-md font-semibold">
        <div className="">
          <Nav />
        </div>
      </div> */}
      <main className="relative flex flex-col justify-center">
        <>
          <div className="h-[100%]  bg-white">
            <section className="h-[100%]  bg-white">
              <NewIntro />
            </section>
          </div>
        </>
      </main>
      {/* ) : (
        <Loading />
      )} */}
    </>
  );
}
