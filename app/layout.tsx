import "./globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ClientLayout from "./ClientLayout";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Learning Platform",
  description: "Your go-to platform for learning and tutorials",
  icons: {
    icon: "/learningPlatform.png",
    apple: "/learningPlatform.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <head>
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
      </head>
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}

