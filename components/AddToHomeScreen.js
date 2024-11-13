'use client';

import { useEffect, useState } from 'react';

const AddToHomeScreen = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Function to check if the app is installed
    const checkIfInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      setIsInstalled(isStandalone);
    };

    // Check installation status on load
    checkIfInstalled();

    // Listen for the 'beforeinstallprompt' event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    // Listen for the 'appinstalled' event
    const handleAppInstalled = () => {
      console.log('App was installed');
      setIsInstalled(true);
      setIsVisible(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('focus', checkIfInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('focus', checkIfInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
    setIsVisible(false);
    setDeferredPrompt(null);
  };

  if (isInstalled) {
    return (
      <div className="flex flex-col h-[20vh] justify-center items-center">
        <h1 className="text-xl">App Already Installed</h1>
        <p>You have already installed this app.</p>
      </div>
    );
  }

  return (
    <>
      {isVisible && (
        <div className="flex flex-col h-[20vh] justify-center items-center">
          <button
            className="text-lg text-blue-500 border border-blue-500 p-4 rounded-full"
            onClick={handleInstallClick}
          >
            Install App
          </button>
        </div>
      )}
    </>
  );
};

export default AddToHomeScreen;

