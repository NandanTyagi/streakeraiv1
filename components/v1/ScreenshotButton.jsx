"use client";

import { useState } from "react";
import html2canvas from "html2canvas";
import ThreeDButton from "../ui/button/3DButton";

const ScreenshotButton = () => {
  const [screenshotUrl, setScreenshotUrl] = useState("");

  // 1. Capture the entire document body, scaled for higher resolution
  const captureViewport = async () => {
    const canvas = await html2canvas(document.body, {
      scale: window.devicePixelRatio || 1,
      useCORS: true,
    });
    return canvas;
  };

  // 2. Crop a canvas to a given region
  const cropCanvas = (sourceCanvas, cropX, cropY, cropWidth, cropHeight) => {
    const croppedCanvas = document.createElement("canvas");
    croppedCanvas.width = cropWidth;
    croppedCanvas.height = cropHeight;
    const ctx = croppedCanvas.getContext("2d");

    ctx.drawImage(
      sourceCanvas,
      cropX,         // source x
      cropY,         // source y
      cropWidth,     // source width
      cropHeight,    // source height
      0,             // destination x
      0,             // destination y
      cropWidth,     // destination width
      cropHeight     // destination height
    );

    return croppedCanvas;
  };

  // 3. Resize a canvas to a specific target resolution (e.g., 480×800)
  const resizeCanvas = (sourceCanvas, targetWidth, targetHeight) => {
    const resizedCanvas = document.createElement("canvas");
    resizedCanvas.width = targetWidth;
    resizedCanvas.height = targetHeight;
    const ctx = resizedCanvas.getContext("2d");

    ctx.drawImage(
      sourceCanvas,
      0,
      0,
      sourceCanvas.width,
      sourceCanvas.height,
      0,
      0,
      targetWidth,
      targetHeight
    );

    return resizedCanvas;
  };

  const handleSaveScreenshot = async () => {
    try {
      // A) Capture the full page
      const fullCanvas = await captureViewport();

      // B) Find the footer's top position (if it exists)
      let scaledFooterTop = fullCanvas.height; // default: no footer, capture entire canvas
      const footerElement = document.getElementById("footer");
      if (footerElement) {
        // getBoundingClientRect().top + scrollY = the footer’s top in page coordinates
        const rect = footerElement.getBoundingClientRect();
        const footerTop = rect.top + window.scrollY;

        // Multiply by the same scale we used for the screenshot
        const scale = window.devicePixelRatio || 1;
        scaledFooterTop = Math.floor(footerTop * scale);
      }

      // C) Crop the canvas from the top to the footer’s top
      const cropX = 0;
      const cropY = 0;
      const cropWidth = fullCanvas.width;
      const cropHeight = scaledFooterTop; 
      const croppedCanvas = cropCanvas(fullCanvas, cropX, cropY, cropWidth, cropHeight);

      // D) Resize to exactly 480×800 (optional)
      const targetWidth = 480;
      const targetHeight = 800;
      const finalCanvas = resizeCanvas(croppedCanvas, targetWidth, targetHeight);

      // E) Convert the final canvas to a data URL
      const imageData = finalCanvas.toDataURL("image/png");

      // F) Upload the screenshot to your API route
      const res = await fetch("/api/v2/upload-screenshot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: imageData }),
      });

      const data = await res.json();
      setScreenshotUrl(data.url);
      console.log("Screenshot URL:", data.url);
    } catch (error) {
      console.error("Error capturing or uploading screenshot:", error);
    }
  };

  return (
    <div>
      <ThreeDButton onClick={handleSaveScreenshot}>Send to display</ThreeDButton>
    </div>
  );
};

export default ScreenshotButton;

