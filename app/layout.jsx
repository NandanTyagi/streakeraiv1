import "./globals.css";
import { AppContextProvider } from "@/context/appContext";
import MainLayout from "../components/MainLayout";
import { Analytics } from "@vercel/analytics/react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export const metadata = {
  metadataBase: new URL("https://www.streaker.ai"),
  alternates: {
    canonical: "/",
  },
  title: "Streaker.ai",
  description: "Track the things you want to track!",
  openGraph: {
    images: "/opengraph-image.png",
  },
};

export default function RootLayout({ children }) {
  return (
      <html lang="en">
        <body>
          <AppContextProvider>
            <Analytics />
            <MainLayout>{children}</MainLayout>
          </AppContextProvider>
        </body>
      </html>
  );
}
