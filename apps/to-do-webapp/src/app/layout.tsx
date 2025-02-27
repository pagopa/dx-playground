import type { Metadata } from "next";

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
    </html>
  );
}
