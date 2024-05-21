import StandardButton from "@/components/v1/StandardButton";
import ButtonGroup from "@/components/v1/ButtonGroup";
import Hero from "@/components/v1/Hero";

const NewIntro = () => {
  return (
    <div className="h-[95dvh] bg-white flex flex-col justify-center items-center">
      <section className="h-[50%] sm:h-[100%]  bg-white">
        <Hero />
      </section>
      <section className="h-[50%]  sm:h-screen bg-white px-8 w-[100%] sm:max-w-[400px]">
        <div className="h-[90%] flex flex-col justify-around">
          <div className="flex justify-center items-center text-xl">
            <h2 className="font-semibold tracking-[2px]">
              {" "}
              AiDentify. Track. Achieve.
            </h2>
          </div>
          <div className="mb-6">
            <StandardButton text="Try free!" type="pill" />
          </div>
          <div>
          <ButtonGroup />
          </div>
        </div>
      </section>
    </div>
  );
};

export default NewIntro;
