"use client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { usePathname } from "next/navigation";

export default function MainLayout({ children }) {
  const pathname = usePathname();

  return (
    <>
      {pathname === "/" || pathname === "/generategoals" || pathname === "/suggestions" ? (
        <>
          <div className="w-[100%] min-h-[100dvh] h-[fit-content] flex flex-col justify-between">
            {children}
            <Footer />
          </div>
        </>
      ) : (
        <div className="main-layout">
          <Header />
          {children}
          <Footer />
        </div>
      )}
    </>
  );
}
