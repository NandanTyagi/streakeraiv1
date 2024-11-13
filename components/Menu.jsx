"use client";

import React from "react";
import Link from "next/link";
import {
  RegisterLink,
  LoginLink,
  LogoutLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import Footer from "@/components/Footer";
import StandardButton from "./v1/StandardButton";
import AddToHomeScreen from "./AddToHomeScreen";

const Menu = ({ user, isMenuOpen, setIsMenuOpen }) => {
  const handleMenuClick = () => {
    setIsMenuOpen();
  };

  return (
    <>
      <nav className="absolute top-[10px] right-[10px] max-w-[1480px] z-[1]">
        {!user ? (
          <ul className="flex gap-4">
            <li>
              <LoginLink>Login</LoginLink>
            </li>
            <li>
              <RegisterLink>Sign up</RegisterLink>
            </li>
            <li>
              <Link href="/install" onClick={handleMenuClick}>Install</Link>
            </li>
          </ul>
        ) : (
          <ul>
            <li>
              <AddToHomeScreen>Android</AddToHomeScreen>
            </li>
            <li>
              <Link href="/install" onClick={handleMenuClick}>IOS</Link>
            </li>
            <li>
              <LogoutLink>Logout</LogoutLink>
            </li>
          </ul>
        )}
      </nav>
      <nav className="relative max-w-[600px] w-full h-full flex justify-center items-center">
        <ul className="flex flex-col gap-6 sm:gap-20 w-full p-4">
          <li>
            <Link href="/about" onClick={handleMenuClick}>
              <StandardButton text="About" type="pill" />
            </Link>
          </li>
          <li>
            <Link href="/generategoals" onClick={handleMenuClick}>
              <StandardButton text="Identify" type="pill" />
            </Link>
          </li>
          <li>
            <Link href="/panel" onClick={handleMenuClick}>
              <StandardButton text="Track" type="pill" />
            </Link>
          </li>
        </ul>
      </nav>
      <Footer />
    </>
  );
};

export default Menu;
