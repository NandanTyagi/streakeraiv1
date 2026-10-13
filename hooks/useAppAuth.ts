"use client";
import { useUser } from "@clerk/nextjs";
import { useMemo } from "react";
import { toAppUser } from "@/lib/auth-user";
export function useAppAuth() {
  const { user: clerkUser, isLoaded, isSignedIn } = useUser();
  const user = useMemo(() => toAppUser(clerkUser), [clerkUser]);
  return { user, isLoading: !isLoaded, isAuthenticated: !!isSignedIn };
}
