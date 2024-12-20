import StandardButton from "@/components/v1/StandardButton";
import ButtonGroup from "@/components/v1/ButtonGroup";
import Hero from "@/components/v1/Hero";
import {
  RegisterLink,
  LoginLink,
  LogoutLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

const NewIntro = () => {
  const { user } = useKindeBrowserClient();
  return (
    <div className="">
      <section className="">
        <Hero />
      </section>
      <section className="h-screen flex flex-col justify-center items-center">
        <h2 className=""> Identify. Track. Achieve.</h2>

        <div className="relative z-50 flex flex-col items-center justify-center max-w-[50%] text-white">
          <StandardButton
            text={`${user ? "Enter" : "Try for free!"}`}
            type="pill"
            pushTo={user ? "/panel" : "/generategoals"}
          />
          {!user && (
            <>
              OR
              <hr className="p-1 w-[50%]" />
              <LoginLink title="Login" className="font-semibold text-white">
                Login
              </LoginLink>
            </>
          )}
          <ButtonGroup />
        </div>
      </section>
    </div>
  );
};

export default NewIntro;
