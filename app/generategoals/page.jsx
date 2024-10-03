import AiInputForm from "@/components/AiInputForm";
import Header from "@/components/Header";
import ButtonGroup from "@/components/v1/ButtonGroup";

export default function Home() {
  return (
    <>
      <div className="h-[80px] bg-[#330594] grid content-center">
        <Header />
      </div>
      <main className="overflowY-scroll relative flex flex-col justify-evenly items-center min-h-[calc(100vh-140px)] ">
        
          <AiInputForm />

          <ButtonGroup />
        
      </main>
    </>
  );
}
