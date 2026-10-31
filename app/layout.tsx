import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#060606",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://infinituderobotics.com"),
  title: {
    default: "NEXUS M2 — Autonomous Mobile Robot · Infinitude Robotics",
    template: "%s · Infinitude Robotics",
  },
  description:
    "NEXUS M2 by Infinitude Robotics. An autonomous mobile robot that sees in 360°, thinks in milliseconds and moves your operation with 1,000 kg payload, natural-feature SLAM, and ±5 mm docking accuracy.",
  keywords: [
    "NEXUS M2",
    "Autonomous Mobile Robot",
    "AMR",
    "Infinitude Robotics",
    "SLAM navigation",
    "360 LiDAR",
    "warehouse robotics",
    "industrial automation",
    "fleet orchestration",
    "intralogistics",
  ],
  authors: [{ name: "Infinitude Robotics" }],
  creator: "Infinitude Robotics",
  publisher: "Infinitude Robotics",
  icons: {
    icon: "/assets/logo.png",
    apple: "/assets/logo.png",
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://infinituderobotics.com",
    siteName: "Infinitude Robotics",
    title: "NEXUS M2 — Autonomous Mobile Robot · Infinitude Robotics",
    description:
      "It doesn't follow lines on the floor. It reads the whole room. 360° perception, natural-feature SLAM, 1,000 kg payload, and fleet-ready autonomy.",
    images: [
      {
        url: "/assets/rear34.jpg",
        width: 1200,
        height: 750,
        alt: "NEXUS M2 Autonomous Mobile Robot by Infinitude Robotics",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NEXUS M2 — Autonomous Mobile Robot · Infinitude Robotics",
    description:
      "NEXUS M2 by Infinitude Robotics. An autonomous mobile robot that sees in 360°, thinks in milliseconds and moves your operation.",
    images: ["/assets/rear34.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Unbounded:wght@300;500;700;800&family=Space+Grotesk:wght@300;400;500&family=JetBrains+Mono:wght@300;400;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="is-booting" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
