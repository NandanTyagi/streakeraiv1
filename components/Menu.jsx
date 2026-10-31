"use client";

import React from "react";
import Link from "next/link";
import {
  RegisterLink,
  LoginLink,
  LogoutLink
} from "@/components/auth/AuthLinks";
import Footer from "@/components/Footer";
import { usePathname } from "next/navigation"; 
import PanelSwitcher from "./v1/PanelSwitcher";
import { LogOutIcon, LogInIcon, PenBoxIcon, Target, ListChecks, LayoutDashboard, History, Info, Settings } from "lucide-react";

const navigationItems = [
  { href: "/generategoals", label: "Identify", icon: Target },
  { href: "/panel", label: "Track", icon: ListChecks },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, requiresUser: true },
  { href: "/history", label: "My History", icon: History, requiresUser: true },
  { href: "/about", label: "About", icon: Info },
  { href: "/profile", label: "Profile & settings", icon: Settings, requiresUser: true },
];

const Menu = ({ user, isMenuOpen, setIsMenuOpen }) => {
  const pathname = usePathname();
  const handleMenuClick = () => {
    setIsMenuOpen();
  };



  return (
    <>
      <nav className="absolute top-[12px] right-[12px] max-w-[1480px] z-[1] text-[var(--ink)] pointer-events-auto">
        {!user ? (
          <ul className="flex flex-row gap-4 text-sm">
            <li>
              <LoginLink className="flex items-center gap-2 text-[var(--ink)] cursor-pointer">
                <span><LogInIcon size={16} /></span>Log in
              </LoginLink>
            </li>
            <li>
              <RegisterLink className="flex items-center gap-2 text-[var(--ink)] cursor-pointer">
                <span><PenBoxIcon size={16} /></span>Sign up
              </RegisterLink>
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
              <LogoutLink className="flex items-center gap-2 text-sm text-[var(--ink)] cursor-pointer">
                <span><LogOutIcon size={16} /></span>Log out
              </LogoutLink>
            </li>
          </ul>
        )}
      </nav>
      <nav className="relative mx-auto max-w-[600px] w-full min-h-0 flex-1 flex justify-center items-center overflow-y-auto py-12">
        <ul className="flex flex-col gap-4 w-full p-4">
          {navigationItems.filter(item => !item.requiresUser || user).map(({ href, label, icon: Icon }) => (
            <li key={href}>
              <Link
                href={href}
                onClick={handleMenuClick}
                aria-current={pathname === href ? "page" : undefined}
                className={`inline-flex min-h-[44px] w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-[var(--ink)] bg-[var(--paper-veil)] px-4 py-2 text-center text-sm font-semibold text-[var(--ink)] transition-colors duration-150 hover:bg-[var(--surface)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)] focus-visible:outline-offset-2 sm:text-base ${pathname === href ? "opacity-50" : ""}`}
              >
                <Icon size={20} className="shrink-0" aria-hidden="true" />
                <span>{label}</span>
              </Link>
            </li>
          ))}
          {user && <li className="rounded-xl border border-[var(--surface-border)] p-4">
            <span className="block mb-2 text-sm font-semibold">Switch panel</span>
            <PanelSwitcher />
          </li>}
        </ul>
      </nav>
      <Footer />
    </>
  );
};

export default Menu;
