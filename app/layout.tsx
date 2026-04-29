import type { Metadata, Viewport } from "next";
// import localFont from "next/font/local";
import "./globals.css";
import { Navigation } from "@/components/Navigation";

// const geistSans = localFont({
//   src: "./fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });
// const geistMono = localFont({
//   src: "./fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

export const metadata: Metadata = {
  title: "Kos Rama Adit - Shared Expense Tracker",
  description: "Buat nyatet pengeluaran kos bersama.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#020617", // slate-950
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`antialiased bg-slate-950 text-slate-50 min-h-screen pb-20`}
      // className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-950 text-slate-50 min-h-screen pb-20`}
      >
        <div className="max-w-md mx-auto min-h-screen relative shadow-2xl bg-slate-950 shadow-slate-900/50">
          {children}
          <Navigation />
        </div>
      </body>
    </html>
  );
}
