"use client";
import Image from "next/image";
import { useState } from "react";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import HamburgerButton from "@/components/HamburgerButton";
import Menu from "@/components/Menu";
import { LoginLink, LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";

const Header = () => {
  const { isAuthenticated, user } = useKindeBrowserClient();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleMenuClose = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
      setIsMenuOpen(false);
    }, 500); // Match the animation duration
  };

  return (
    // Header with a blurred background

    <header className="flex items-center justify-between px-3 bg-[#330594] relative">
      <a href="/">
        <div className="flex items-center gap-1">
          <div className="relative rounded-full overflow-hidden shadow-xl">
            <Image
              src="/streaker-logo.png"
              alt="logo"
              priority
              width={60}
              height={60}
            />
          </div>
          <div className="text-[1.4rem] sm:text-[1.6rem] flex font-bold text-white">
            Streaker
            <div className="flex gap-2">
              <span className="text-[0.7rem]">Beta</span>
            </div>
          </div>
        </div>
      </a>
      <div className="absolute top-0 right-0 flex z-2 gap-5 pr-3 text-white text-[0.8rem] h-full pt-1">
        <div className="flex items-center">
          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-2 sm:mr-6">
                <span className="hidden sm:block mb-[-2px]">
                  {user?.given_name} {user?.family_name}
                </span>
                {user?.picture ? (
                  <Image
                    className="rounded-full w-8 h-8 mr-[32px]"
                    src={user.picture}
                    alt="profile-pic"
                    priority
                    width={30}
                    height={30}
                  />
                ) : (
                  <div className="rounded-full w-8 h-8 bg-black text-white text-xs font-semibold flex justify-center items-center">
                    {user?.given_name?.[0]}
                    {user?.family_name?.[0]}
                  </div>
                )}
              </div>
              {/* <LogoutLink>Log out</LogoutLink> */}
            </>
          ) : // <LoginLink>Log in</LoginLink>
          null}
          <HamburgerButton
            isMenuOpen={isMenuOpen}
            setIsMenuOpen={setIsMenuOpen}
          />
        </div>
      </div>
      {isMenuOpen && (
        <div
          className={`absolute inset-0 z-50 flex justify-center items-center bg-gradient-to-r from-blue-100 to-purple-100 h-[calc(100vh-80px)] top-[80px] ${
            isAnimating ? "animate-fadeOut" : "animate-fadeIn"
          }`}
          onAnimationEnd={() => {
            if (isAnimating) {
              setIsMenuOpen(false);
              setIsAnimating(false);
            }
          }}
        >
          <Menu user={user} setIsMenuOpen={handleMenuClose} />
        </div>
      )}
    </header>
  );
};

export default Header;
