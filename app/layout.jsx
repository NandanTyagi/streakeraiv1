import "./globals.css";
import { AppContextProvider } from "@/context/appContext";
import MainLayout from "../components/MainLayout";
import { Analytics } from "@vercel/analytics/react";

export const metadata = {
  metadataBase: new URL("https://www.streaker.ai"),
  alternates: {
    canonical: "/",
  },
  title: "StreakerAi",
  description: "What do you want to achieve?",
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
