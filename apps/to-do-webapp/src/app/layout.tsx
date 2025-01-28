import type { Metadata } from "next";

import Script from "next/script";

export const metadata: Metadata = {
  description: "A To Do List app",
  title: "To Do List",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
      <Script
        crossOrigin="anonymous"
        id="dynatrace"
        src="https://js-cdn.dynatrace.com/jstag/16827775e4e/bf66232jyn/6c925e7eb2402285_complete.js"
        type="text/javascript"
      ></Script>
    </html>
  );
}
