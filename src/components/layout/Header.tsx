"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useProductOverlay } from "@/context/ProductOverlayContext";
import {
  Menu,
  Search,
  Bell,
  Plus,
  ChevronDown,
  RotateCcw,
  LogOut,
} from "lucide-react";

interface HeaderProps {
  onOpenSidebar: () => void;
  onOpenAddProduct?: () => void;
  breadcrumbs?: { label: string; href?: string }[];
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
}

export default function Header({
  onOpenSidebar,
  onOpenAddProduct,
  breadcrumbs = [
    { label: "PulseStack", href: "/products" },
    { label: "Store Catalog", href: "/products" },
    { label: "Products" },
  ],
  searchQuery = "",
  onSearchChange,
}: HeaderProps) {
  const { user, logout } = useAuth();
  const { resetOverlay, isModified } = useProductOverlay();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [resetNotice, setResetNotice] = useState(false);

  const handleReset = () => {
    resetOverlay();
    setResetNotice(true);
    setTimeout(() => setResetNotice(false), 3000);
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left: Mobile Hamburger & Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          title="Open Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Breadcrumbs */}
        <nav className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 font-medium truncate">
          {breadcrumbs.map((crumb, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            return (
              <React.Fragment key={idx}>
                {crumb.href && !isLast ? (
                  <Link
                    href={crumb.href}
                    className="hover:text-blue-600 transition-colors truncate"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span
                    className={
                      isLast ? "text-slate-900 font-semibold truncate" : "truncate"
                    }
                  >
                    {crumb.label}
                  </span>
                )}
                {!isLast && <span className="text-slate-400">›</span>}
              </React.Fragment>
            );
          })}
        </nav>
      </div>

      {/* Middle: Global Search Input with Cmd+K */}
      <div className="flex-1 max-w-md hidden md:block">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search catalog..."
            value={searchQuery}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            className="w-full pl-9 pr-14 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-slate-200/70 text-[10px] font-mono text-slate-500 font-medium">
            <span>⌘</span>
            <span>K</span>
          </div>
        </div>
      </div>

      {/* Right Actions: Notifications, + New Product, User Avatar */}
      <div className="flex items-center gap-3">
        {/* Reset Local Overlay Demo Button */}
        {isModified && (
          <div className="relative">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 hover:bg-amber-100 transition-colors"
              title="Reset simulated changes"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset Demo</span>
            </button>
            {resetNotice && (
              <div className="absolute right-0 top-full mt-2 bg-slate-900 text-white text-xs px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap z-50">
                Demo state restored to API!
              </div>
            )}
          </div>
        )}

        {/* Notifications Icon with unread badge */}
        <button
          type="button"
          className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
        </button>

        {/* Primary "+ New Product" button */}
        {onOpenAddProduct && (
          <button
            type="button"
            onClick={onOpenAddProduct}
            className="inline-flex items-center gap-1.5 py-2 px-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm shadow-blue-600/30 transition-all transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Product</span>
          </button>
        )}

        {/* User Profile dropdown */}
        <div className="relative pl-1">
          <button
            type="button"
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-100 transition-colors"
          >
            {user?.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.image}
                alt={user.firstName || "User"}
                className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                {user ? user.firstName.charAt(0) : "A"}
              </div>
            )}

            <div className="hidden lg:block text-left">
              <div className="text-xs font-bold text-slate-900 leading-tight">
                {user ? `${user.firstName} ${user.lastName}` : "Alex Morgan"}
              </div>
              <div className="text-[10px] text-slate-500 font-medium leading-tight">
                Product Lead
              </div>
            </div>

            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {/* Profile Dropdown Menu */}
          {profileDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl p-1.5 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-3 py-2 border-b border-slate-100">
                <div className="text-xs font-bold text-slate-900">
                  {user ? `${user.firstName} ${user.lastName}` : "Alex Morgan"}
                </div>
                <div className="text-[11px] text-slate-400 truncate">
                  {user?.email || "alex.morgan@pulsetack.io"}
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setProfileDropdownOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition-colors mt-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
