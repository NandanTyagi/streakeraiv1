import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { AppContextProvider } from "@/context/appContext";
import MainLayout from "@/components/MainLayout";
import { CSPostHogProvider } from "@/app/providers";

export const metadata = {
  metadataBase: new URL("https://streaker-v1.vercel.app"),
  title: "Streaker",
  description: "A discipline ledger that makes continuity visible.",
  openGraph: {
    images: "/opengraph-image.png",
    url: "https://streaker-v1.vercel.app/",
    type: "website",
  },
  themeColor: "#6a6b5f",
  alternates: {
    canonical: "/",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32" },
      { url: "/favicon-16x16.png", sizes: "16x16" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Streaker",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-render-mode="interactive">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content={metadata.themeColor} />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body>
        <ClerkProvider
          signInUrl="/sign-in"
          signUpUrl="/sign-up"
          signInFallbackRedirectUrl="/panel"
          signUpFallbackRedirectUrl="/panel"
        >
          <CSPostHogProvider>
            <AppContextProvider>
              <MainLayout>{children}</MainLayout>
            </AppContextProvider>
          </CSPostHogProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
