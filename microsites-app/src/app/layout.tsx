import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://shoplocal.whyleavetown.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Why Leave Town — Australian Gift Cards & Shop Local Programs",
    template: "%s | Why Leave Town",
  },
  description:
    "Why Leave Town offers Australian gift cards to help you shop local Australia and support your community. Browse community gift card programs across Australia and keep spending local.",
  keywords: [
    "Why Leave Town",
    "Australian gift cards",
    "local gift cards",
    "community gift cards",
    "shop local Australia",
    "shop local",
    "support local business",
  ],
  openGraph: {
    type: "website",
    locale: "en_AU",
    siteName: "Why Leave Town",
    title: "Why Leave Town — Australian Gift Cards & Shop Local Programs",
    description:
      "Browse Australian gift card programs from Why Leave Town. Shop local Australia and support your community — every dollar stays right where it belongs.",
    images: [
      {
        url: "/logo-whyleavetown.png",
        width: 400,
        height: 400,
        alt: "Why Leave Town — Australian Gift Cards",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Why Leave Town — Australian Gift Cards & Shop Local Programs",
    description:
      "Browse Australian gift card programs from Why Leave Town and shop local Australia. Support your community with every purchase.",
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
