import StandardButton from "@/components/v1/StandardButton";
import Hero from "@/components/v1/Hero";

const NewIntro = () => {
  return (
    <div className="h-screen  bg-white flex flex-col justify-center items-center">
      <section className="h-[50%] sm:h-[100%]  bg-white">
        <Hero />
      </section>
      <section className="h-[50%]  sm:h-screen bg-white px-8 w-[100%] sm:max-w-[400px]">
        <div className="h-[90%] flex flex-col justify-around">
          <div className="flex justify-center items-center text-xl">
            <h2 className="font-semibold tracking-[2px]">
              {" "}
              Identify. Track. Achieve.
            </h2>
          </div>
          <div className="">
            <StandardButton text="Try free!" type="pill" />
          </div>
          <div>
            <div className="flex justify-between items-center">
              <StandardButton text="Track" type="round" />
              <div>
                <StandardButton text="AiDentify" type="round" />
              </div>
              <div>
                <StandardButton text="Join" type="round" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NewIntro;
