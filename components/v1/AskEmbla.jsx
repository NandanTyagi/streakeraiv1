"use client";

import Input from "@/components/Input";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import { AppContext } from "@/context/appContext";
import createThread from "@/utils/openai-v2/internalApi/thread/createThread";
import createMessage from "@/utils/openai-v2/internalApi/message/createMessage";
import getRun from "@/utils/openai-v2/internalApi/run/getRun";
import DOMPurify from "dompurify";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import Image from "next/image";

const AskEmbla = () => {
  const router = useRouter();
  const { isAuthenticated, user, isLoading } = useKindeBrowserClient();
  const {
    name,
    startChat,
    chatInput,
    isAppLoading,
    currentThread,
    assitantId,
    rawMessages,
    latestEmblaMessage,
    userFirstName,
    setName,
    setStartChat,
    setChatInput,
    setisAppLoading,
    setCurrentThread,
    setAssistantId,
    setRawMessages,
    setLatestEmblaMessage,
  } = useContext(AppContext);

  const handelStartChat = async () => {
    console.log("handelStartChat");
    setStartChat((prev) => true);
    setisAppLoading(true);
    setCurrentThread(await createThread());
    setisAppLoading(false);
  };

  const handleSendClick = async () => {
    setisAppLoading(true);
    console.log("in handleSendClick");
    if (!chatInput) {
      alert("Please enter a question about meditation.");
      return;
    }
    const messages = await createMessage(currentThread.newThread.id, chatInput);
    console.log("in handleSendClick messages", messages);
    setRawMessages((await getRun(currentThread.newThread.id)) || []);
    console.log("in handleSendClick rawMessages", rawMessages);
    setChatInput("");
    setisAppLoading(false);
  };

  const checkState = () => {
    console.group("checkState");
    console.log("startChat", startChat);
    console.log("isAppLoading", isAppLoading);
    console.log("currentThread", currentThread.newThread.id);
    console.log("chatInput", chatInput);
    console.log("assitantId", assitantId);
    console.log("rawMessages", rawMessages);
    console.log("latestEmblaMessage", latestEmblaMessage);
    console.log("name", name);
    console.log("user", user);
    console.log("isAuthenticated", isAuthenticated);
    console.log("userFirstName", userFirstName);
    console.log("checkState end¤¤¤¤¤¤¤¤¤¤¤¤¤");
    console.groupEnd();
  };

  useEffect(() => {
    setAssistantId(process.env.ASSISTANT_ID);
  }, []);

  useEffect(() => {
    console.log("rawMessages in AskEmbla useEffect", rawMessages.getRunResult);
    const latestEmblaMessage =
      rawMessages.getRunResult?.[rawMessages.getRunResult?.length - 1];
    const isLatestEmblaMessage = latestEmblaMessage?.role === "assistant";
    if (isLatestEmblaMessage) {
      console.log("latestEmblaMessage", latestEmblaMessage);
      setLatestEmblaMessage(latestEmblaMessage);
    }
  }, [rawMessages, isAppLoading]);

  useEffect(() => {
    if (user) {
      setName(user.given_name);
    }
  }, [user, isAuthenticated, isAppLoading]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      alert("Please login to access: Ask Embla.");
      router.push("/login");
    }
  }, [isAppLoading, isLoading, isAuthenticated]);

  if (!startChat) {
    return <Button btnText="Start Chat" onClick={handelStartChat} />;
  }

  return (
    <>
      <div className=" chatContainer w-[100%] h-[100%] overflow-auto border rounded-lg">
        <div className="grid h-[100%] w-[100%] gap-4">
          <div className="chat overflow-auto">
            {isAppLoading ? (
              <>
                <div className="h-[100%] flex flex-col justify-center items-center">
                  <div className="border border-transparent flex justify-center items-center h-[20px] w-[70px]">
                    <Image
                      className="rounded-full"
                      src="/embla-loading.gif"
                      priority
                      width={80}
                      height={80}
                      alt="loading..."
                    />
                  </div>
                  <p className="text-white text-left text-sm p-3">Loading...</p>
                </div>
              </>
            ) : (
              <section className="text-white w-[100%] text-left p-3 h-[100%]">
                {rawMessages.getRunResult
                  ?.map((message) => (
                    <div
                      className={`border-b-2 even:border-dotted odd:border-none mb-2 pb-2 ${
                        message.role === "assistant"
                          ? "border-indigo-600"
                          : "border-white"
                      }} `}
                      key={message.id}
                    >
                      {message.role === "assistant" && (
                        <>
                          <p className="pb-4 text-green-300">EmblaAi: </p>
                          <p
                            dangerouslySetInnerHTML={{
                              __html: DOMPurify.sanitize(
                                cleanText(message.content)
                              ),
                            }}
                          ></p>
                        </>
                      )}
                      {message.role === "user" && (
                        <>
                          <p className="pb-4 text-indigo-300 text-right">
                            {(name && name + ":") || "You:"}{" "}
                          </p>
                          <p
                            className="text-right"
                            dangerouslySetInnerHTML={{
                              __html: DOMPurify.sanitize(
                                cleanText(message.content)
                              ),
                            }}
                          ></p>
                        </>
                      )}
                    </div>
                  ))
                  .reverse()}
              </section>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 w-[100%]">
        <Input
          fieldName="chat"
          placeholder="Ask me anything about meditation"
          btnText="Send"
          btnFunctionOnClick={() => handleSendClick()}
          showButton={true}
        />
      </div>
      <div className="w-[100%] h-[10px] opacity-0">
        <Button btnText="Check State" onClick={checkState} />
      </div>
    </>
  );
};

export default AskEmbla;

function cleanText(text) {
  // Remove all instances of ```html and ```
  return text.replace(/```html|```/g, "").trim();
}
