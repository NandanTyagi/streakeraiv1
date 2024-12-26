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
      <div className="main-layout-container bg-gradient-to-r from-blue-100 to-purple-100">
        <div className="main-layout">
          <Header />
          {children}
          {/* <Footer /> */}
        </div>
      </div>
    );
  } 
  else if (pathname === "/about") {
    return (
      <div className="main-layout-container bg-black">
        <div className="main-layout">
          <Header />
          {children}
          {/* <Footer /> */}
        </div>
      </div>
    );
  } 
  else if (pathname === "/history") {
    return (
      <div className="main-layout-container bg-gradient-to-r from-blue-100 to-purple-100">
        <div className="main-layout">
          <Header />
          {children}
          {/* <Footer /> */}
        </div>
      </div>
    );
  } 
  else if (pathname === "/panel") {
    return (
      <div className="main-layout-container">
        <div className="main-layout">
          <Header />
          {children}
        </div>
        <footer className="flex flex-col justify-center w-full items-center sm:items-end sm:pr-6 z-[0] absolute bottom-0 max-w-[1480px] bg-[#EBEBEB]"></footer>
      </div>
    );
  } 
  else {
    return (
      <div className="main-layout-container">
        <div className="main-layout">
          <Header />
          {children}
        </div>
        {/* <Footer /> */}
      </div>
    );
  }
}
