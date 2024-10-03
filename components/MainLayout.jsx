"use client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { usePathname } from "next/navigation";

export default function MainLayout({ children }) {
  const pathname = usePathname();

  if (
    pathname === "/generategoals" ||
    pathname === "/suggestions" ||
    pathname === "/"
  ) {
    return (
      <div className="min-h-[100svh] h-[100%]">
        {children}
        <Footer />
      </div>
    );
  } else {
    return (
      <div className="main-layout-container">
        <div className="main-layout">
          <Header />
          {children}
          <Footer />
        </div>
      </div>
    );
  }
}
