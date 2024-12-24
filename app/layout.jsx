import "./globals.css";
import { AppContextProvider } from "@/context/appContext";
import MainLayout from "../components/MainLayout";
import Head from "next/head";
import { CSPostHogProvider } from "./providers.js";

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
  themeColor: "#330594",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: "no",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta property="og:title" content={metadata.title} />
        <meta property="og:description" content={metadata.description} />
        <meta property="og:image" content={metadata.openGraph.images} />
        <meta
          property="og:url"
          content={metadata.metadataBase + metadata.alternates.canonical}
        />
        <meta property="og:type" content="website" />
        <meta name="theme-color" content={metadata.themeColor} />
        {/* Apple pwa props */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Streaker.ai" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/apple-touch-icon.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="167x167"
          href="/apple-touch-icon.png"
        />
        <link rel="apple-touch-startup-image" href="/apple-touch-icon.png" />
        <link
          rel="apple-touch-startup-image"
          sizes="152x152"
          href="/apple-touch-icon.png"
        />
        <link
          rel="apple-touch-startup-image"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="apple-touch-startup-image"
          sizes="167x167"
          href="/apple-touch-icon.png"
        />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link
          rel="mask-icon"
          href="/safari-pinned-tab.svg"
          color={metadata.themeColor}
        />
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta name="msapplication-TileColor" content={metadata.themeColor} />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="theme-color" content={metadata.themeColor} />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, user-scalable=no"
        />
      </Head>

      <body>
        <CSPostHogProvider>
          <AppContextProvider>
            <MainLayout>{children}</MainLayout>
          </AppContextProvider>
        </CSPostHogProvider>
      </body>
    </html>
  );
}
