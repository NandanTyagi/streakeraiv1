"use client";

import React from "react";
import Link from "next/link";
import {
  RegisterLink,
  LoginLink,
  LogoutLink
} from "@kinde-oss/kinde-auth-nextjs/components";
import Footer from "@/components/Footer";
import StandardButton from "./v1/StandardButton";
import AddToHomeScreen from "./AddToHomeScreen";
import { usePathname } from "next/navigation"; 
import { useContext } from "react";
import { AppContext } from "../context/appContext";
import { LogOutIcon, LogInIcon, PenBoxIcon } from "lucide-react";

const Menu = ({ user, isMenuOpen, setIsMenuOpen }) => {
  const { board } = useContext(AppContext);
  const pathname = usePathname();
  const handleMenuClick = () => {
    setIsMenuOpen();
  };



  return (
    <>
      <nav className="absolute top-[10px] right-[10px] max-w-[1480px] z-[1]">
        {!user ? (
          <ul className="flex flex-row gap-6">
            <li>
              <LoginLink className="flex gap-2"><span><LogInIcon /></span>Login </LoginLink>
            </li>
            <li>
              <RegisterLink className="flex gap-2"><span><PenBoxIcon /></span>Sign up </RegisterLink>
            </li>
            {/* <li>
              <Link href="/install" onClick={handleMenuClick}>Install</Link>
            </li> */}
          </ul>
        ) : (
          <ul>
            {/* <li>
              <AddToHomeScreen>Android</AddToHomeScreen>
            </li>
            <li>
              <Link href="/install" onClick={handleMenuClick}>Install</Link>
            </li> */}
            <li>
              <LogoutLink className="flex gap-2"><span><LogOutIcon /></span>Logout </LogoutLink>
            </li>
          </ul>
        )}
      </nav>
      <nav className="relative max-w-[600px] w-full h-full flex justify-center items-center">
        <ul className="flex flex-col gap-6 sm:gap-20 w-full p-4">
          <li>
            <Link href="/about" onClick={handleMenuClick} className={pathname === "/about" ? "opacity-50" : ""}>
              <StandardButton text="About" type="pill" />
            </Link>
          </li>
          <li>
            <Link href="/generategoals" onClick={handleMenuClick} className={pathname === "/generategoals" ? "opacity-50" : ""}>
              <StandardButton text="Identify" type="pill" />
            </Link>
          </li>
          <li>
            <Link href="/panel" onClick={handleMenuClick} className={pathname === "/panel" ? "opacity-50" : ""}>
              <StandardButton text="Track" type="pill" />
            </Link>
          </li>
          <li>
            <Link href="/history/" onClick={handleMenuClick} className={`${pathname === "/history" ? "opacity-50" : ""} ${user ? "" : "hidden"}`}>
              <StandardButton text="My History" type="pill" />
            </Link>
          </li>
        </ul>
      </nav>
      <Footer />
    </>
  );
};

export default Menu;
