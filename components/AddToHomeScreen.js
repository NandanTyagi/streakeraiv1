"use client";

import { useEffect, useState } from "react";

const AddToHomeScreen = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      console.log("User accepted the install prompt");
    } else {
      console.log("User dismissed the install prompt");
    }
    setIsVisible(false);
    setDeferredPrompt(null);
  };

  return (
    <>
      {!isVisible && (
        <div className="flex flex-col h-[20vh] justify-center items-center">
          <h1 className="text-xl">Installation</h1>
          <h2 className="text-IPhone">Android</h2>
          <button onClick={handleInstallClick}>Install App</button>
        </div>
      )}
    </>
  );
};

export default AddToHomeScreen;
