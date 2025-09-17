"use client";

import Header from "./components/Header";
import Footer from "./components/Footer";
import { Toaster } from "react-hot-toast";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-green-700 via-teal-800 to-cyan-900">
      <Header sidebarWidth={0} />
      <main className="flex-1 w-full">{children}</main>
      <Footer />
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
}
