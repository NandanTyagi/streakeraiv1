
"use client";
import NewIntro from "@/components/v1/NewIntro";

export default function Home() {

  return (
    <>
      <main className="relative flex flex-col justify-center items-start max-h-[calc(100dvh - 200px)]">
        <>
          <div className="h-[100%] bg-white">
            <section className="h-[100%]  bg-white">
              <NewIntro /> 
            </section>
          </div>
        </>
      </main>
    </>
  );
}
