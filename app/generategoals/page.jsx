import AiInputForm from "@/components/AiInputForm";
import Header from "@/components/Header";
import ButtonGroup from "@/components/v1/ButtonGroup";

export default function Home() {
  return (
    <>
      <main className="pt-4 relative flex flex-col justify-center items-center gap-4 min-h-[calc(100vh-80px)] bg-gradient-to-r from-blue-100 to-purple-100">
        <AiInputForm />
      </main>
    </>
  );
}
