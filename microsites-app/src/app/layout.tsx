import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://shoplocal.whyleavetown.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Why Leave Town — Shop Local Gift Cards",
    template: "%s | Why Leave Town",
  },
  description:
    "Why Leave Town community gift card programs help you shop local and support your community. Browse gift card programs near you.",
  keywords: [
    "Why Leave Town",
    "local gift cards",
    "community gift cards",
    "shop local",
    "support local business",
    "Australian gift cards",
  ],
  openGraph: {
    type: "website",
    locale: "en_AU",
    siteName: "Why Leave Town",
    title: "Why Leave Town — Shop Local Gift Cards",
    description:
      "Why Leave Town community gift card programs help you shop local and support your community. Browse gift card programs near you.",
    images: [
      {
        url: "/logo-whyleavetown.png",
        width: 400,
        height: 400,
        alt: "Why Leave Town Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Why Leave Town — Shop Local Gift Cards",
    description:
      "Browse Why Leave Town community gift card programs near you and support local businesses.",
    images: ["/logo-whyleavetown.png"],
  },
  verification: {
    google: "0545c663a89b6213",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-AU">
      <body>
        {children}
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
