"use client";

import { on } from "events";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const IosInstallPrompt = () => {
  const [isIos, setIsIos] = useState(false);
  const [isInStandaloneMode, setIsInStandaloneMode] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const ios = /iphone|ipad|ipod/.test(userAgent);
    const standalone = window.navigator.standalone === true;
    setIsIos(ios);
    setIsInStandaloneMode(standalone);
    setIsVisible(ios && !standalone);
  }, []);

  if (!isVisible) {
    return (
      // Inform the user that they are not on ios device
      <div className="flex flex-col h-[50vh] justify-center items-center">
        <p className="mb-10">This feature is only available on iOS devices.</p>
        <Link
          className="text-lg text-blue-500 border border-blue-500 p-4 rounded-full"
          href="/"
        >
          Return to home screen
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center mb-10 mt-10">
        <h1 className="text-xl">Installation</h1>
        <h2 className="text-IPhone">Ios / IPhone</h2>
      <p>To install this app on your home screen:</p>
      <ol className="flex flex-col justify-center items-center">
        <li>
          Tap the{" "}
          <Image
            src="/share-apple-icon.svg"
            alt="Share"
            priority
            width={40}
            height={40}
          />{" "}
          icon.
        </li>
        <li>
          Select <strong>Add to Home Screen</strong>.
        </li>
      </ol>
    </div>
  );
};

export default IosInstallPrompt;
