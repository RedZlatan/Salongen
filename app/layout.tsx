import "./globals.css";
import type { Metadata } from "next";

const BASE_URL = "https://www.salongen.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: "Salongen — The Last Salon",
  description:
    "The last salon for film, music, conversation and temporary gatherings. Gothenburg, Sweden.",
  keywords: [
    "salongen",
    "salon",
    "film screening",
    "live music",
    "gothenburg",
    "göteborg",
    "underground",
    "events",
    "cinema",
    "the last salon",
  ],
  openGraph: {
    type: "website",
    url: BASE_URL,
    title: "Salongen — The Last Salon",
    description:
      "The last salon for film, music, conversation and temporary gatherings. Gothenburg, Sweden.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Salongen — The Last Salon",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Salongen — The Last Salon",
    description:
      "The last salon for film, music, conversation and temporary gatherings. Gothenburg, Sweden.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: BASE_URL,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sv">
      <head>
        {/* Canonical — .se points to .com as primary domain */}
        <link rel="canonical" href={BASE_URL} />
      </head>
      <body>{children}</body>
    </html>
  );
}
