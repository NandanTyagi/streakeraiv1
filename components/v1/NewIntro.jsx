import StandardButton from "@/components/v1/StandardButton";
import ButtonGroup from "@/components/v1/ButtonGroup";
import Hero from "@/components/v1/Hero";
import {
  RegisterLink,
  LoginLink,
  LogoutLink,
} from "@kinde-oss/kinde-auth-nextjs/components";

const NewIntro = () => {
  return (
    <div className="h-[95dvh] bg-white flex flex-col justify-center items-center">
      <section className="h-[50%] sm:h-[100%]  bg-white">
        <Hero />
      </section>
      <section className="h-[50%] z-[10] sm:h-screen bg-transparent px-8 w-[100%] sm:max-w-[400px] mt-[-20px]">
        <div className="h-[90%] flex flex-col justify-around">
          <div className="flex justify-center items-center text-xl">
            <h2 className="font-semibold tracking-[2px] text-white mb-[8px] sm:mb-[30px]">
              {" "}
              Identify. Track. Achieve.
            </h2>
          </div>
          <div className="mb-6 flex flex-col justify-center items-center text-white">
            <StandardButton text="Try for free!" type="pill" />
            OR
            <hr className="p-1 w-[50%]"/>
            <LoginLink title="Login" className="font-semibold text-white">Login</LoginLink>
          </div>
          <div className="sm:pb-[40px]">
            <ButtonGroup />
          </div>
        </div>
      </section>
    </div>
  );
};

export default NewIntro;
