"use client";

import Link from "next/link";

interface HeaderProps {
  sidebarWidth?: number;
}

export default function Header({ sidebarWidth = 0 }: HeaderProps) {
  return (
    <header
      className="bg-gradient-to-r from-green-600 via-teal-700 to-cyan-800 text-white p-4 flex justify-between items-center shadow-md transition-all duration-300"
      style={{ marginLeft: `${sidebarWidth}px` }}
    >
      <h1 className="text-xl font-bold select-none">Learning Platform</h1>
      <nav>
        <Link href="/" className="mr-4 hover:text-cyan-300 transition-colors">
          Home
        </Link>
        <Link href="/courses" className="hover:text-cyan-300 transition-colors">
          Courses
        </Link>
      </nav>
    </header>
  );
}
