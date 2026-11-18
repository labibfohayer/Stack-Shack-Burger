import type { Metadata } from "next";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";

export const metadata: Metadata = {
  title: "STACK SHACK — Smashed to order",
  description:
    "Smashed to order in Austin, Texas since 2017. Fresh ground Texas beef, potato buns, hand-cut fries, and secret Shack sauce.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.png", type: "image/png" },
      { url: "/favicon.ico", type: "image/x-icon" },
    ],
    shortcut: "/favicon.svg",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "STACK SHACK — Smashed to order",
    description:
      "Two thin patties pressed hard on a hot griddle, American cheese, pickles and Shack sauce on a toasted potato bun.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Modak&family=Mouse+Memoirs&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased selection:bg-primary selection:text-primary-foreground">
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
