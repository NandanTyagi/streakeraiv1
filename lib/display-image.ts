import { randomBytes } from "node:crypto";
import { getMongoDb } from "../src-v3/infrastructure/adapters/mongo-client";

export function decodeDisplayImage(image: unknown): Buffer {
  if (typeof image !== "string" || !/^data:image\/png;base64,[A-Za-z0-9+/=]+$/.test(image) || image.length > 2800000) {
    throw new Error("Expected a PNG image smaller than 2 MB.");
  }
  const png = Buffer.from(image.slice("data:image/png;base64,".length), "base64");
  if (png.length < 33 || png.subarray(0, 8).toString("hex") !== "89504e470d0a1a0a" ||
    png.toString("ascii", 12, 16) !== "IHDR" || png.readUInt32BE(16) !== 480 || png.readUInt32BE(20) !== 800) {
    throw new Error("The display image must be a 480 × 800 PNG.");
  }
  return png;
}

export async function displayImages() {
  return (await getMongoDb()).collection<{ _id: string; token: string; image: string; updatedAt: Date }>("display_images");
}
export function newDisplayToken() { return randomBytes(24).toString("hex"); }
export function displayImageUrl(token: string) { return `/api/display/${token}`; }
