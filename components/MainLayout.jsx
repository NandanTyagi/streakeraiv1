"use client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { usePathname } from "next/navigation";

export default function MainLayout({ children }) {
  const pathname = usePathname();

  return (
    <>
      {pathname !== "/" ? (
        <div className="main-layout">
          <Header />
          {children}
          <Footer />
        </div>
      ) : (
        <>
          <div className="w-[100%] min-h-[100dvh] h-[fit-content]">
          {children}
          <Footer />
          </div>
        </>
      )}
    </>
  );
}
