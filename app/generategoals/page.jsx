import AiInputForm from "@/components/AiInputForm";
import Header from "@/components/Header";
import ButtonGroup from "@/components/v1/ButtonGroup";

export default function Home() {
  return (
    <>
      <main className="py-6 relative flex flex-col items-center gap-4 bg-[var(--paper)]">
        <AiInputForm />
      </main>
    </>
  );
}
