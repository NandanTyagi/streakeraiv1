"use client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { usePathname } from "next/navigation";
import { Toaster } from "./ui/toaster";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useEffect } from "react";
import SpatialReflectionLayer from "./SpatialReflectionLayer";
import PanelFooterControls from "./v1/PanelFooterControls";

export default function MainLayout({ children }) {
  const pathname = usePathname();
  const { user } = useKindeBrowserClient();

  const allowedUsers = process.env.NEXT_PUBLIC_ALLOWED_USERS;
  const allowedUsersArray = allowedUsers.split(",");
  console.log("allowed users", allowedUsersArray);

  const isAllowedUser = allowedUsersArray.includes(user?.email);
  const spatialPaths = new Set(["/", "/about", "/dashboard"]);
  const showSpatial = spatialPaths.has(pathname);
  const needsSecondarySpacer = !pathname.startsWith("/panel") && pathname !== "/";

  useEffect(() => {
    const root = document.documentElement;
    const currentMode = root.dataset.renderMode;
    if (currentMode === "snapshot-eink") return;
    const nextMode = showSpatial ? "spatial-reflection" : "interactive";
    root.dataset.renderMode = nextMode;
  }, [showSpatial]);



  if (pathname === "/") {
    return (
      <div className="main-layout-container main-layout-landing">
        {showSpatial && <SpatialReflectionLayer />}
        <div className="main-layout-shell">
          {children}
          <Footer />
        </div>
      </div>
    );
  } else if (pathname === "/generategoals") {
    return (
      <div className="main-layout-container">
        {showSpatial && <SpatialReflectionLayer />}
        <div className="main-layout">
          <Header />
          {needsSecondarySpacer && (
            <div className="secondary-header-spacer" aria-hidden="true" />
          )}
          {children}
          {/* <Footer /> */}
        </div>
      </div>
    );
  } else if (pathname === "/about") {
    return (
      <div className="main-layout-container">
        {showSpatial && <SpatialReflectionLayer />}
        <div className="main-layout">
          <Header />
          {needsSecondarySpacer && (
            <div className="secondary-header-spacer" aria-hidden="true" />
          )}
          {children}
          {/* <Footer /> */}
        </div>
      </div>
    );
  } else if (pathname === "/history") {
    return (
      <div className="main-layout-container">
        {showSpatial && <SpatialReflectionLayer />}
        <div className="main-layout">
          <Header />
          {needsSecondarySpacer && (
            <div className="secondary-header-spacer" aria-hidden="true" />
          )}
          {children}
          {/* <Footer /> */}
        </div>
      </div>
    );
  } else if (pathname === "/panel") {
    return (
      <div className="main-layout-container">
        {showSpatial && <SpatialReflectionLayer />}
        <Toaster />
        <div className="main-layout panel-layout">
          <Header />
          {children}
          <div
            id="footer"
            className="panel-action-bar bg-[var(--paper-veil)] border-t border-[var(--surface-border)]"
          >
            <div className="max-w-[1480px] w-full mx-auto px-4 flex justify-center">
              <PanelFooterControls showSend={isAllowedUser} />
            </div>
          </div>
        </div>
      </div>
    );
  } else if (pathname === "/dashboard") {
    return (
      <div className="main-layout-container">
        {showSpatial && <SpatialReflectionLayer />}
        <div className="main-layout">
          <Header />
          {needsSecondarySpacer && (
            <div className="secondary-header-spacer" aria-hidden="true" />
          )}
          {children}
        </div>
        {/* <footer className="flex flex-col justify-center w-full items-center sm:items-end sm:pr-6 z-[0] absolute bottom-0 max-w-[1480px] bg-[#EBEBEB]"></footer> */}
      </div>
    );
  } else {
    return (
      <div className="main-layout-container">
        {showSpatial && <SpatialReflectionLayer />}
        <div className="main-layout">
          <Header />
          {needsSecondarySpacer && (
            <div className="secondary-header-spacer" aria-hidden="true" />
          )}
          {children}
        </div>
        {/* <Footer /> */}
      </div>
    );
  }
}
