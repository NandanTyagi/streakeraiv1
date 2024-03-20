"use client";
import Image from "next/image";
import {
  useEffect,
  useState,
  useContext,
  useRef,
  useLayoutEffect,
} from "react";
import { AppContext } from "@/context/appContext";
import Loading from "@/components/Loading";
import About from "@/components/About";
import Nav from "@/components/Nav";
import { useRouter } from "next/navigation";
import StreamComponent from "@/components/StreamComponent";
import parseAndExtract from "@/utils/openai/parseAndExtract";
import { Button } from "@/components/ui/button/Button";
import GenerateStreakerBoardButton from "@/components/GenerateStreakerBoardButton";
import Link from "next/link";
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

  useLayoutEffect(() => {
    setTimeout(() => {
      signUpRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }, 14000);
  }, []);

  return (
    <>
      <div className="flex justify-center items-center bg-[#EBEBEB] text-md font-semibold">
        <div className="">
          <Nav />
        </div>
      </div>
      {/* {!isAppLoading ? ( */}
      <main className="relative flex flex-col justify-center min-h-[fill-available] h-[calc(100vh - 160px)]">
        <>
          <div className="h-[100%]  bg-white">
            <section className="h-[100%]  bg-white">
              <About />
            </section>
            <section
              className="h-[fit-content]  bg-white px-6 pt-24 sm:flex"
              ref={signUpRef}
            >
              <h2 className="text-2xl font-bold mb-6 sm:w-[50%] sm:p-10 sm:text-4xl">
                Empowering Your Journey Towards Excellence
              </h2>

              <div className="text-lg sm:w-[50%] sm:p-10">
                <p>
                  At StreakerAi, we believe in the power of habit. Small, daily
                  actions culminate into significant transformations, leading
                  you closer to your personal aspirations. Our mission is to
                  support you on this journey of self-improvement and goal
                  achievement
                </p>
                <div className="flex justify-around gap-10 pt-10">
                  <Button
                    id="button"
                    type="button"
                    className="bg-[#EBEBEB] font-bold text-[1.1rem] sm:max-w-[300px] max-w-[200px] text-[#530DA2] cursor-pointer w-[stretch]"
                  >
                    <LoginLink>Log in</LoginLink>
                  </Button>
                  <Button
                    id="button"
                    type="button"
                    className="bg-[#530DA2] font-bold text-[1.1rem] sm:max-w-[300px] max-w-[200px] text-white cursor-pointer w-[stretch]"
                  >
                    <RegisterLink>Sign up</RegisterLink>
                  </Button>
                </div>
              </div>
            </section>
            <section className="h-[fit-content]  bg-white px-6 pt-24 sm:flex sm:flex-col">
              <div>
                <h2 className="text-2xl font-bold mb-6 sm:w-[50%] sm:px-10 sm:text-4xl">
                  The Essence of StreakerAi
                </h2>
              </div>
              <div className="h-[fit-content]  bg-white sm:px-10 sm:pt-10 sm:flex justify-between gap-24">
                <div className="mb-6 sm:max-w-[50%]">
                  <div>
                    <h3 className="text-xl font-bold mb-2 sm:mb-6">
                      Inspired by a profound personal journey
                    </h3>
                  </div>
                  <div>
                    <p className="text-lg">
                      StreakerAi was born from a journey of personal
                      transformation. After a decade of struggle, weighed down
                      by an unhealthy lifestyle and a challenging relationship,
                      the apps creator faced a turning point. The end of his
                      marriage marked the beginning of a new chapter. With a
                      simple calendar as his guide, he embarked on a mission to
                      redefine his life by meticulously tracking five daily
                      habits: meditation, physical training, disciplined eating,
                      sufficient sleep, and dedicated study.
                    </p>
                  </div>
                </div>
                <div className="mb-6 sm:max-w-[50%]">
                  <div>
                    <h3 className="text-xl font-bold mb-6">
                      Simplicity led to a remarkable transformation
                    </h3>
                  </div>
                  <div>
                    <p className="text-lg">
                      This disciplined approach led to a remarkable
                      transformation: shedding 30kg and rediscovering a sense of
                      self-worth and vitality within nine months. It was this
                      profound change, powered by the clarity and consistency of
                      daily habit tracking, that inspired the creation of
                      StreakerAi. The app isn&apos;t just a tool for managing
                      routines; it&apos;s a companion in the journey towards
                      self-improvement, designed to be accessible wherever life
                      takes you.
                    </p>
                  </div>
                </div>
              </div>
            </section>
            <section className="h-[fit-content]  bg-white px-6 pt-24 sm:flex">
              <h2 className="text-2xl font-bold mb-6 sm:w-[50%] sm:p-10 sm:text-4xl">
                Every day is a step closer to the person you want to become
              </h2>
              <p className="text-lg sm:w-[50%] sm:p-10">
                StreakerAi is the manifestation of this journey, conceived to
                empower you to enact your own transformation. It&apos;s a testament
                to the power of daily habits, a tool designed to bring focus,
                clarity, and progress to your fingertips. StreakerAi is your
                companion in the quest for personal growth, a daily reminder
                that change, one day at a time, is not just possible—it&apos;s
                inevitable.
              </p>
            </section>
            <section className="h-[fit-content]  bg-white px-6 pt-24 sm:flex sm:flex-col">
              <div>
                <h2 className="text-2xl font-bold mb-6 sm:w-[50%] sm:px-10 sm:text-4xl">
                  Why StreakerAi?
                </h2>
              </div>
              <div className="h-[fit-content]  bg-white sm:px-10 sm:pt-10 sm:flex justify-between">
                <div className="mb-6 sm:max-w-[300px]">
                  <div>
                    <h3 className="text-xl font-bold mb-6">
                      Personalized Tracking
                    </h3>
                  </div>
                  <div>
                    <p className="text-lg">
                      StreakerAi innovative approach marries technology with
                      personal growth, offering a dynamic framework designed to
                      support your transformation.
                    </p>
                  </div>
                </div>
                <div className="mb-6 sm:max-w-[300px]">
                  <div>
                    <h3 className="text-xl font-bold mb-6">
                      Simplicity at Its Core
                    </h3>
                  </div>
                  <div>
                    <p className="text-lg">
                      Whether it&apos;s enhancing your health, cultivating a new
                      skill, or tracking misselanious actions, StreakerAi&apos;s
                      AI-driven suggestions provide a roadmap tailored just for
                      you.
                    </p>
                  </div>
                </div>
                <div div className="mb-6 sm:max-w-[300px]">
                  <div>
                    <h3 className="text-xl font-bold mb-6">
                      Science-Backed Strategies
                    </h3>
                  </div>
                  <div>
                    <p className="text-lg">
                      Each recommended habit is a thread in the tapestry of your
                      goals, meticulously chosen to propel you forward.
                    </p>
                  </div>
                </div>
              </div>
            </section>
            <section className="h-[fit-content]  bg-white px-6 py-24 sm:flex">
              <h2 className="text-2xl font-bold mb-6 sm:w-[50%] sm:p-10 sm:text-4xl">
                Join Us on the Path to Transformation
              </h2>
              <div className="flex flex-col sm:w-[50%]">
                <p className="text-lg sm:w-[100%] sm:p-10">
                  StreakerAi stands as a testament to the power of small daily
                  actions in crafting the life we desire. It&apos;s built on the
                  belief that meaningful change is possible, one day at a time.
                  Join us on this path to transformation, and let StreakerAi be
                  your guide to becoming the best version of yourself.
                </p>
                <div className="flex justify-around gap-10 pt-10">
                  <Button
                    id="button"
                    type="button"
                    onClick={() => router.push("/generategoals")}
                    className="bg-[#530DA2] font-bold text-[1.1rem] sm:max-w-[300px] max-w-[100%] text-white cursor-pointer w-[stretch]"
                  >
                    Try Free!
                  </Button>
                </div>
              </div>
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
