import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import ConditionalShell from "@/component/ConditionalShell";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata = {
  title: "FitMate — Fitness & Gym Management",
  description: "Book classes, follow trainers, track your fitness journey",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#0A0B0F]">
        <ConditionalShell>{children}</ConditionalShell>
        <ToastContainer position="top-right" theme="dark" />
      </body>
    </html>
  );
}