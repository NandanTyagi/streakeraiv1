"use client";

import { useState } from "react";
import html2canvas from "html2canvas";
import ThreeDButton from "../ui/button/3DButton";

const ScreenshotButton = () => {
  const [screenshotUrl, setScreenshotUrl] = useState("");

  const captureViewport = async () => {
    // Capture the entire document body
    const canvas = await html2canvas(document.body, {scale: window.devicePixelRatio, useCORS: true });
    return canvas;
  };

  const cropCanvas = (sourceCanvas, cropX, cropY, cropWidth, cropHeight) => {
    const croppedCanvas = document.createElement("canvas");
    croppedCanvas.width = cropWidth;
    croppedCanvas.height = cropHeight;
    const ctx = croppedCanvas.getContext("2d");

    ctx.drawImage(
      sourceCanvas,
      cropX,       // x start in source
      cropY,       // y start in source
      cropWidth,   // width to crop
      cropHeight,  // height to crop
      0,           // x in destination
      0,           // y in destination
      cropWidth,   // destination width
      cropHeight   // destination height
    );

    return croppedCanvas;
  };

  const handleSaveScreenshot = async () => {
    try {
      // 1. Capture the full viewport
      const fullCanvas = await captureViewport();
  
      // 2. Convert percentage values to pixels
      const cropX = 0;
      const cropY = 0;
      const cropWidth = fullCanvas.width;        
      const cropHeight = fullCanvas.height - 220;   
  
      // 3. Crop the captured canvas
      const croppedCanvas = cropCanvas(fullCanvas, cropX, cropY, cropWidth, cropHeight);
  
      // 4. Convert cropped canvas to image data URL
      const imageData = croppedCanvas.toDataURL("image/png");
  
      // 5. Post the image data to the API route
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
