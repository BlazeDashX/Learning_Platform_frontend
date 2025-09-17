"use client";

import { useState } from "react";
import Link from "next/link";
import DashboardIcon from "@mui/icons-material/Dashboard";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

interface SidebarProps {
  onCollapse?: (collapsed: boolean) => void;
  onLogout?: () => void;
}

export default function Sidebar({ onCollapse, onLogout }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive] = useState("/dashboard");

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
    onCollapse?.(!collapsed);
  };

  function NavItem({
    icon: Icon,
    label,
    href,
  }: {
    icon: React.ElementType;
    label: string;
    href?: string;
  }) {
    const isActive = active === href;
    return (
      <Link
        href={href || "#"}
        onClick={() => setActive(href || "")}
        className={`group flex items-center gap-3 p-3 rounded-lg transition-all duration-300 relative
          ${isActive ? "bg-gradient-to-r from-blue-500 to-indigo-500 shadow-md" : "hover:bg-gray-800/70"}
          ${collapsed ? "justify-center" : ""}
        `}
      >
        <Icon
          className={`text-lg ${
            isActive ? "text-white" : "text-gray-300"
          } transition-colors`}
        />
        {!collapsed && (
          <span
            className={`text-sm font-medium transition-all duration-300 ${
              isActive
                ? "text-white"
                : "text-gray-300 group-hover:text-white"
            }`}
          >
            {label}
          </span>
        )}
        {collapsed && (
          <span className="absolute left-full ml-2 bg-gray-900/95 text-white text-xs rounded px-2 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
            {label}
          </span>
        )}
      </Link>
    );
  }

  return (
    <aside
      className={`h-[calc(100vh-0px)] bg-gray-900/95 backdrop-blur-md text-white flex flex-col justify-between transition-all duration-300 z-40
        fixed md:static top-0 left-0
        ${collapsed ? "w-20" : "w-60"}
      `}
    >
      {/* Nav Items */}
      <div className="flex flex-col gap-6 mt-4">
        <div className="flex items-center gap-2 mb-6 px-4">
          {!collapsed && (
            <h2 className="text-2xl font-bold tracking-wide text-white">
              Dashboard
            </h2>
          )}
          <button
            onClick={toggleSidebar}
            className="text-white p-2 rounded hover:bg-gray-800 transition-all ml-auto"
          >
            <span className="material-icons">menu</span>
          </button>
        </div>

        <nav className="flex flex-col gap-2 px-2">
          <NavItem icon={AccountCircleIcon} label="Profile" href="/profile" />
          <NavItem icon={DashboardIcon} label="Overview" href="/dashboard" />
          <NavItem icon={MenuBookIcon} label="Courses" />
          <NavItem icon={PeopleIcon} label="Students" href="/students"/>
          <NavItem icon={SettingsIcon} label="Settings" />
          <NavItem
            icon={MenuBookIcon}
            label="Create Question"
            href="/question"
          />
        </nav>
      </div>
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 p-3 rounded-lg hover:bg-red-600 transition-colors shadow-md"
        >
          <span className="material-icons">logout</span>
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
