"use client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { usePathname } from "next/navigation";

export default function MainLayout({ children }) {
  const pathname = usePathname();

  if (pathname === "/") {
    return (
      <div className="min-h-[100%] h-[100%] flex flex-col justify-between">
        {children}
        <Footer />
      </div>
    );
  } else if (pathname === "/generategoals") {
    return (
      <div className="main-layout-container">
        <div className="main-layout">
          <Header />
          {children}
          {/* <Footer /> */}
        </div>
      </div>
    );
  } else if (pathname === "/about") {
    return (
      <div className="main-layout-container">
        <div className="main-layout">
          <Header />
          {children}
          {/* <Footer /> */}
        </div>
      </div>
    );
  } else {
    return (
      <div className="main-layout-container">
        <div className="main-layout">
          <Header />
          {children}
        </div>
        <Footer />
      </div>
    );
  }
}
