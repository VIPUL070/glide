import type { Metadata } from "next";
import { DM_Sans } from 'next/font/google';
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'], 
  variable: '--font-dm-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "GLIDE - Smart Vehicle Booking Platform",
  description: "Why twist your day around traffic when you can just GLIDE through it? GLIDE is the next-gen vehicle booking platform built for urban creators, daily commuters, and everyone who values their time. No friction, no endless waiting—just sleek, smart, and instant rides tailored to your vibe. Book your ride and experience transportation the way it was meant to be: effortless",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}