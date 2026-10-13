"use client";
import Link from "next/link";
import { SignOutButton } from "@clerk/nextjs";
export function LoginLink(props) { return <Link {...props} href="/sign-in" />; }
export function RegisterLink(props) { return <Link {...props} href="/sign-up" />; }
export function LogoutLink({ children, ...props }) {
  return <SignOutButton redirectUrl="/"><button {...props} type="button">{children}</button></SignOutButton>;
}
