"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  Layers,
  PlusCircle,
  TrendingUp,
  ShoppingBag,
  BellRing,
  MessageSquare,
  Settings,
  HelpCircle,
  Building2,
  LogOut,
  X,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  productCount?: number;
  onOpenAddProduct?: () => void;
  activeTab?: "dashboard" | "products";
  onTabChange?: (tab: "dashboard" | "products") => void;
}

export default function Sidebar({
  isOpen,
  onClose,
  productCount = 194,
  onOpenAddProduct,
  activeTab = "products",
  onTabChange,
}: SidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuth();

  const isProductsActive = activeTab === "products" || pathname.startsWith("/products");
  const isDashboardActive = activeTab === "dashboard" && pathname === "/products";

  const handleNavClick = (tab?: "dashboard" | "products") => {
    if (tab && onTabChange) {
      onTabChange(tab);
    }
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Top: Brand Header */}
        <div>
          <div className="h-16 flex items-center justify-between px-5 border-b border-slate-100">
            <Link
              href="/products"
              onClick={() => handleNavClick("dashboard")}
              className="flex items-center gap-2.5 group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20 text-white">
                <Layers className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900 text-lg tracking-tight">
                  PulseStack
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 uppercase tracking-wider">
                  PRO
                </span>
              </div>
            </Link>

            {/* Close button on mobile */}
            <button
              type="button"
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="px-3 py-4 space-y-6 overflow-y-auto max-h-[calc(100vh-220px)]">
            {/* Section: MAIN */}
            <div>
              <div className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Main
              </div>
              <div className="space-y-1">
                {/* Dashboard button */}
                <button
                  type="button"
                  onClick={() => handleNavClick("dashboard")}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isDashboardActive
                      ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 shrink-0" />
                  <span>Dashboard</span>
                </button>

                {/* Products catalog button */}
                <button
                  type="button"
                  onClick={() => handleNavClick("products")}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isProductsActive && !isDashboardActive
                      ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Layers className="w-4 h-4 shrink-0" />
                    <span>Products</span>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                      isProductsActive && !isDashboardActive
                        ? "bg-blue-500 text-white"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {productCount}
                  </span>
                </button>

                {/* Add Product quick trigger */}
                <button
                  type="button"
                  onClick={() => {
                    if (onOpenAddProduct) onOpenAddProduct();
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                >
                  <PlusCircle className="w-4 h-4 shrink-0 text-slate-400" />
                  <span>Add Product</span>
                </button>

                {/* Analytics */}
                <button
                  type="button"
                  onClick={() => handleNavClick("dashboard")}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                >
                  <TrendingUp className="w-4 h-4 shrink-0 text-slate-400" />
                  <span>Analytics & Sales</span>
                </button>
              </div>
            </div>

            {/* Section: MANAGEMENT */}
            <div>
              <div className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Management
              </div>
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => handleNavClick("products")}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                >
                  <ShoppingBag className="w-4 h-4 shrink-0 text-slate-400" />
                  <span>Orders</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleNavClick("products")}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                >
                  <BellRing className="w-4 h-4 shrink-0 text-slate-400" />
                  <span>Inventory Alerts</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleNavClick("products")}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                >
                  <MessageSquare className="w-4 h-4 shrink-0 text-slate-400" />
                  <span>Customer Reviews</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleNavClick("products")}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                >
                  <Settings className="w-4 h-4 shrink-0 text-slate-400" />
                  <span>Settings</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleNavClick("products")}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                >
                  <HelpCircle className="w-4 h-4 shrink-0 text-slate-400" />
                  <span>Help & Docs</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Storage Meter & Account Footprint */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-3">
          {/* Storage Meter */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
              <span>Storage</span>
              <span>7.8 / 10 GB</span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full w-[78%]" />
            </div>
          </div>

          {/* Org & Logout button */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <Building2 className="w-4 h-4" />
              </div>
              <div className="truncate text-xs font-semibold text-slate-800">
                Acme Cloud HQ
              </div>
            </div>
            <button
              type="button"
              onClick={logout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
