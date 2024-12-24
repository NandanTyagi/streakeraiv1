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

        <div className="relative z-50 flex flex-col items-center justify-center max-w-[50%] text-white p-4 min-w-full sm:min-w-[300px] gap-2 text-md sm:text-lg">
         {user && 
          <StandardButton
            text={`Welcome ${user.given_name}`}
            type="pill"
            pushTo={user ? "/panel" : "/generategoals"}
          />
          }

        
          {!user && (
            <>
             <RegisterLink className="font-semibold text-white w-full">
          <StandardButton
            text={`Sign up`}
            type="pill"
            // pushTo={user ? "/panel" : "/generategoals"}
          />

          </RegisterLink>
              OR
              {/* <hr className="p-1 w-[50%]" /> */}
              <LoginLink title="Login" className="font-semibold text-white w-full">
                <StandardButton text="Login" type="pill">
                  Login
                </StandardButton>
              </LoginLink>
            </>
          )}
          {/* <ButtonGroup /> */}
        </div>
      </section>
    </div>
  );
};

export default NewIntro;
