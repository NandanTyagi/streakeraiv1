// app/api/upload-screenshot/route.js
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req) {
  try {
    const { image } = await req.json();
    // Remove the data URL prefix "data:image/png;base64,"
    const base64Data = image.replace(/^data:image\/png;base64,/, "");

    // Generate a unique filename
    const fileName = `currentScreenshot.png`;
    // Save to public/screenshots so that Next.js can serve it as a static file
    const filePath = path.join(process.cwd(), "public", "screenshots", fileName);

    // Ensure the directory exists
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, base64Data, "base64");

    // Return the URL for the saved image
    const imageUrl = `/screenshots/${fileName}`;
    return NextResponse.json({ url: imageUrl }, { status: 201 });
  } catch (error) {
    console.error("Error saving screenshot:", error);
    return NextResponse.json({ error: "Failed to save screenshot" }, { status: 500 });
  }
}
