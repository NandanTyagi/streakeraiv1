"use client";
import Image from "next/image";
import { useState } from "react";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import HamburgerButton from "@/components/HamburgerButton";
import Menu from "@/components/Menu";

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

    <header
      className="flex items-center gap-4 px-4 sm:px-6 bg-[var(--paper-veil)] border-b border-[var(--surface-border)] relative py-3"
      style={{ minHeight: "var(--header-height)" }}
    >
      <a href="/">
        <div className="flex items-center gap-1">
          <div className="relative rounded-full overflow-hidden border border-[var(--surface-border)] bg-[var(--surface)] cursor-pointer hover:opacity-80 w-[30px] h-[30px]">
            <Image
              src="/streaker-logo.png"
              alt="logo"
              unoptimized
              priority
              width={30}
              height={30}
            />
          </div>
          <div className="text-[1.3rem] sm:text-[1.5rem] flex font-semibold text-[var(--ink)] tracking-[0.02em]">
            Streaker
            <div className="flex gap-2 items-center">
              <span className="text-[0.65rem] uppercase tracking-[0.24em] text-[var(--ink-soft)]">
                Beta
              </span>
            </div>
          </div>
        </div>
      </a>
      <div className="ml-auto flex items-center gap-4 text-[var(--ink)] text-[0.85rem] cursor-pointer z-[2]">
        <div className="flex items-center gap-4 sm:gap-5">
          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-3 sm:mr-4">
                <span className="hidden sm:block text-[var(--ink-soft)]">
                  {user?.given_name} {user?.family_name}
                </span>
                {user?.picture ? (
                  <Image
                    className="rounded-full w-8 h-8"
                    src={user.picture}
                    alt="profile-pic"
                    unoptimized
                    priority
                    width={30}
                    height={30}
                  />
                ) : (
                  <div className="rounded-full w-8 h-8 bg-[var(--ink)] text-[var(--paper-veil)] text-xs font-semibold flex justify-center items-center">
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
          className={`fixed left-0 right-0 z-50 flex justify-center items-center bg-[var(--paper)] border-t border-[var(--surface-border)] ${
            isAnimating ? "animate-fadeOut" : "animate-fadeIn"
          }`}
          style={{
            top: "var(--header-height)",
            height: "calc(100vh - var(--header-height))",
          }}
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
