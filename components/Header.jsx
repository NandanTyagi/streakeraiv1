"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import {
  RegisterLink,
  LoginLink,
  LogoutLink,
} from "@kinde-oss/kinde-auth-nextjs/components";

const Header = () => {
  const { isAuthenticated, isLoading, user } = useKindeBrowserClient();
  const Router = useRouter();

  return (
    <header className="bg-[#530DA2] flex items-center justify-between place-items-center p-0 px-3 relative">
      <a href={"/"}>
        <div className="flex justify-center items-center gap-1">
          <div className="relative rounded-full overflow-hidden shadow-xl">
            <Image
              src={"/streaker-logo.png"}
              alt="logo"
              priority
              width={60}
              height={60}
            />
          </div>
          <div className="text-[1.4rem] sm:text-[1.6rem] flex font-bold text-white">
            StreakerAi
            <div className="flex gap-2">
              <span className="text-[0.65rem]"></span>
              <span className="text-[0.7rem]">Beta</span>
            </div>
          </div>
        </div>
      </a>
      <div className="absolute top-0 right-0 flex z-50 justify-between gap-5 pr-3 text-white text-[0.8rem] h-[100%] pt-[4px]">
        {isAuthenticated && (
          <div className="flex justify-center items-center flex-row-reverse gap-2 sm:mr-6">
            <span className="sm:block hidden mb-[-2px]">
              {isAuthenticated && user?.family_name}{" "}
            </span>
            <span className="sm:block hidden mb-[-2px]">
              {isAuthenticated && user?.given_name}{" "}
            </span>
            <span>
              {isAuthenticated && user.picture ? (
                <img
                  className="rounded-[100px] w-[30px] h-[30px] overflow-hidden"
                  src={user.picture}
                ></img>
              ) : (
                <div className="rounded-[100px] w-[30px] h-[30px] overflow-hidden bg-black text-white text-[0.6rem] font-semibold flex justify-center items-center">
                  {isAuthenticated &&
                    user?.given_name[0] + user?.family_name[0]}
                </div>
              )}
            </span>
          </div>
        )}
        {!isAuthenticated && (
          <div className="mt-[4px] flex flex-col items-center">
            <LoginLink>
              Log in
            </LoginLink>
            <LoginLink>
              <button
                className="text-xl relative w-[2.2rem] h-[100%] cursor-pointer"
                onClick={() => Router.push("/generategoals")}
              >
                <Image
                  src={"/burger-white.svg"}
                  alt="menu-button"
                  priority
                  fill
                />
              </button>
            </LoginLink>
            {/* <RegisterLink>Sign up</RegisterLink> */}
          </div>
        )}
        {isAuthenticated && (
          <div className="mt-[4px] flex flex-col items-center">
            <LogoutLink>
              Log out
            </LogoutLink>
            <LogoutLink>
              <button
                className="text-xl relative w-[2.2rem] h-[100%] cursor-pointer"
                onClick={() => Router.push("/generategoals")}
              >
                <Image
                  src={"/burger-white.svg"}
                  alt="menu-button"
                  priority
                  fill
                />
              </button>
            </LogoutLink>
          </div>
        )}
      </div>
      {/* 
        <button
          className="text-xl relative w-[2.2rem] h-[100%] cursor-pointer"
          onClick={() => Router.push("/generategoals")}
        >
          <Image src={"/burger-white.svg"} alt="menu-button" priority fill />
        </button> */}
    </header>
  );
};

export default Header;
