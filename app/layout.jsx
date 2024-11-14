import "./globals.css";
import { AppContextProvider } from "@/context/appContext";
import MainLayout from "../components/MainLayout";

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
  themeColor: '#330594',
};

export default function RootLayout({ children }) {
  return (
      <html lang="en">
        <body>
          <AppContextProvider>
            <MainLayout>{children}</MainLayout>
          </AppContextProvider>
        </body>
      </html>
  );
}
