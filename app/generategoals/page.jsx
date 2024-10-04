import AiInputForm from "@/components/AiInputForm";
import Header from "@/components/Header";
import ButtonGroup from "@/components/v1/ButtonGroup";

export default function Home() {
  return (
    <>
      <main className="relative flex flex-col justify-center items-center gap-4 min-h-[80vh]">
        
          <AiInputForm />

          <ButtonGroup />
        
      </main>
    </>
  );
}
