"use client";
import { useEffect, useState } from "react";
import StandardButton from "./StandardButton";

export default function DownloadApp() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isPWAInstallable, setIsPWAInstallable] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Save the event to trigger it later
      setDeferredPrompt(e);
      setIsPWAInstallable(true);
    };

    // Listen for the `beforeinstallprompt` event
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Detect if the user is on a mobile device
    const isMobileDevice = /Android|iPhone|iPad|iPod/i.test(
      navigator.userAgent
    );
    setIsMobile(isMobileDevice);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleAddToHomeScreen = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the A2HS prompt");
        } else {
          console.log("User dismissed the A2HS prompt");
        }
        setDeferredPrompt(null);
      });
    }
  };
  return (
    <div className="w-full">
      {
    //   isPWAInstallable && isMobile &&
       (
        <StandardButton
          text={`Download app`}
          type="pill"
          onClick={handleAddToHomeScreen}
        />
      )}
    </div>
  );
}
