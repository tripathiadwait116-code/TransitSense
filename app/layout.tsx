import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Transit Sense — RTC Bus Tracker by KLHH Students",
  description:
    "Real-time RTC bus tracking, live ETA arrival predictions, traffic delay monitoring, and seat availability for Telangana. Built by KLHH Students.",
  keywords: [
    "Transit Sense",
    "KLHH RTC bus tracker",
    "Hyderabad bus tracking",
    "TSRTC live bus",
    "Bus ETA Hyderabad",
    "RTC bus tracker",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased selection:bg-teal-500 selection:text-white">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
