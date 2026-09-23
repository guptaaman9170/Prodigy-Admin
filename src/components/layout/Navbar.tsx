"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useProductOverlay } from "@/context/ProductOverlayContext";
import {
  ShieldCheck,
  LogOut,
  RotateCcw,
  Sparkles,
  User as UserIcon,
  ChevronDown,
} from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { resetOverlay, isModified } = useProductOverlay();
  const [showResetNotice, setShowResetNotice] = useState(false);

  const handleResetData = () => {
    resetOverlay();
    setShowResetNotice(true);
    setTimeout(() => setShowResetNotice(false), 3000);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <Link
          href="/products"
          className="flex items-center gap-2.5 group transition-transform active:scale-95"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-white block leading-none">
              Prodigy<span className="text-indigo-400">Admin</span>
            </span>
            <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">
              Product Dashboard
            </span>
          </div>
        </Link>

        {/* Right Actions: Local Reset & User Profile */}
        <div className="flex items-center gap-3">
          {/* Simulated Data Reset Button */}
          {isModified && (
            <div className="relative">
              <button
                type="button"
                onClick={handleResetData}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition-all"
                title="Reset all local simulated adds, edits, and deletions back to raw API data"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Demo Changes</span>
              </button>
              {showResetNotice && (
                <div className="absolute top-full mt-2 right-0 bg-slate-800 border border-slate-700 text-slate-200 text-xs py-1.5 px-3 rounded-lg shadow-xl whitespace-nowrap z-50 animate-in fade-in">
                  Local changes reset to API defaults!
                </div>
              )}
            </div>
          )}

          {/* User Profile & Logout */}
          <div className="flex items-center gap-3 pl-2 sm:border-l sm:border-slate-800">
            <div className="flex items-center gap-2.5">
              {user?.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.image}
                  alt={user.firstName || "User"}
                  className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 object-cover"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400">
                  <UserIcon className="w-5 h-5" />
                </div>
              )}
              <div className="hidden md:block text-left">
                <div className="text-xs font-semibold text-slate-200 leading-tight">
                  {user ? `${user.firstName} ${user.lastName}` : "Emily Johnson"}
                </div>
                <div className="text-[11px] text-slate-400 leading-tight">
                  @{user?.username || "emilys"}
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <button
              id="logout-button"
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-medium text-slate-300 bg-slate-900 border border-slate-700/80 hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/30 transition-all"
              title="Sign out of admin session"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
