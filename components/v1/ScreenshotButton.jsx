"use client";
import { useState } from "react";
import html2canvas from "html2canvas";
import ThreeDButton from "../ui/button/3DButton";

const ScreenshotButton = () => {
  const [screenshotUrl, setScreenshotUrl] = useState("");

  // Capture the entire document body
  const captureViewport = async () => {
    const canvas = await html2canvas(document.body, {
      scale: window.devicePixelRatio,
      useCORS: true,
    });
    return canvas;
  };

  // Crop a canvas: crop area defined by (cropX, cropY, cropWidth, cropHeight)
  const cropCanvas = (sourceCanvas, cropX, cropY, cropWidth, cropHeight) => {
    const croppedCanvas = document.createElement("canvas");
    croppedCanvas.width = cropWidth;
    croppedCanvas.height = cropHeight;
    const ctx = croppedCanvas.getContext("2d");

    ctx.drawImage(
      sourceCanvas,
      cropX,       // source x
      cropY,       // source y
      cropWidth,   // source width (the area we want to crop)
      cropHeight,  // source height (original height minus 220px)
      0,           // destination x
      0,           // destination y
      cropWidth,   // destination width
      cropHeight   // destination height
    );

    return croppedCanvas;
  };

  // Resize a canvas to a specific target resolution (408x800)
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
      // 1. Capture the full viewport
      const fullCanvas = await captureViewport();

      // 2. Crop the canvas: remove 220px from the height
      const cropX = 0;
      const cropY = 0;
      const cropWidth = fullCanvas.width;
      const cropHeight = fullCanvas.height - 220; // your custom height adjustment
      const croppedCanvas = cropCanvas(fullCanvas, cropX, cropY, cropWidth, cropHeight);

      // 3. Resize the cropped canvas to exactly 408×800 pixels
      const targetWidth = 408;
      const targetHeight = 800;
      const finalCanvas = resizeCanvas(croppedCanvas, targetWidth, targetHeight);

      // 4. Convert the final canvas to an image data URL
      const imageData = finalCanvas.toDataURL("image/png");

      // 5. Post the image data to your API route
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
      {/* {screenshotUrl && (
        <div>
          <h3>Screenshot Saved:</h3>
          <img src={screenshotUrl} alt="Screenshot" />
        </div>
      )} */}
    </div>
  );
};

export default ScreenshotButton;

