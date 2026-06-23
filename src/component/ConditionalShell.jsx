"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/component/home/NavBar";
import Footer from "@/component/home/Footer";

export default function ConditionalShell({ children }) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");

  return (
    <>
      {!isDashboard && <Navbar />}
      {children}
      {!isDashboard && <Footer />}
    </>
  );
}