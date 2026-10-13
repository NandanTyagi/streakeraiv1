import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest, type NextFetchEvent } from "next/server";

// Public pages and the anonymous ledger remain accessible.
const authMiddleware = clerkMiddleware();
export default function middleware(request: NextRequest, event: NextFetchEvent) {
  // The Frontend API establishes the session; it must not require one itself.
  if (request.nextUrl.pathname === "/__clerk" || request.nextUrl.pathname.startsWith("/__clerk/")) {
    return NextResponse.next();
  }
  return authMiddleware(request, event);
}
export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|mp4)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/:path*",
  ],
};
