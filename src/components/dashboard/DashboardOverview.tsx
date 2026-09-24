"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Download,
  Boxes,
  Plus,
  ArrowRight,
  MoreVertical,
  CheckCircle2,
  Star,
  AlertTriangle,
} from "lucide-react";
import KpiCards from "./KpiCards";
import { Product } from "@/types/product";
import { formatCurrency } from "@/lib/utils";

interface DashboardOverviewProps {
  products: Product[];
  totalProducts: number;
  categoriesCount: number;
  onOpenAddProduct: () => void;
  onViewCatalog: () => void;
}

export default function DashboardOverview({
  products,
  totalProducts,
  categoriesCount,
  onOpenAddProduct,
  onViewCatalog,
}: DashboardOverviewProps) {
  const [timeRange, setTimeRange] = useState<"7D" | "30D" | "90D">("30D");

  const recentItems = products.slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Header / Store Operations */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider">
            <span>Store Operations</span>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            <span className="text-slate-400 font-semibold normal-case">v2.4.9 live</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Dashboard Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Welcome back. Here is what is happening with your product catalog and inventory today.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Report</span>
          </button>
          <button
            type="button"
            onClick={onViewCatalog}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Boxes className="w-3.5 h-3.5 text-slate-500" />
            <span>Manage Inventory</span>
          </button>
          <button
            type="button"
            onClick={onOpenAddProduct}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-semibold text-white shadow-sm shadow-blue-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Top 4 KPI Metrics Cards */}
      <KpiCards
        totalProducts={totalProducts}
        products={products}
        categoriesCount={categoriesCount}
      />

      {/* Middle Row: Sales & Inventory Velocity + Category Share */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sales & Inventory Velocity Chart (8 cols) */}
        <div className="lg:col-span-8 pro-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 text-base">
                    Sales &amp; Inventory Velocity
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                    Live Feed
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Real-time revenue trajectories plotted against fulfillment turnover rates
                </p>
              </div>

              {/* Time Range Tabs */}
              <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200/80 text-xs font-semibold self-start">
                {(["7D", "30D", "90D"] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setTimeRange(r)}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      timeRange === r
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-5 text-xs text-slate-600 mb-6">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-blue-600" />
                <span>Gross Revenue ($48.2k)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-blue-200" />
                <span>Stock Turnover Rate (84.1%)</span>
              </div>
            </div>

            {/* SVG Visual Area Chart */}
            <div className="relative h-56 w-full pt-4">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 600 200" preserveAspectRatio="none">
                {/* Background Grid Lines */}
                <line x1="0" y1="40" x2="600" y2="40" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="0" y1="90" x2="600" y2="90" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="0" y1="140" x2="600" y2="140" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="0" y1="190" x2="600" y2="190" stroke="#e2e8f0" strokeWidth="1" />

                {/* Bars for Stock Turnover */}
                <rect x="35" y="100" width="16" height="90" rx="3" fill="#dbeafe" />
                <rect x="110" y="80" width="16" height="110" rx="3" fill="#dbeafe" />
                <rect x="185" y="70" width="16" height="120" rx="3" fill="#dbeafe" />
                <rect x="260" y="90" width="16" height="100" rx="3" fill="#dbeafe" />
                <rect x="335" y="60" width="16" height="130" rx="3" fill="#dbeafe" />
                <rect x="410" y="75" width="16" height="115" rx="3" fill="#dbeafe" />
                <rect x="485" y="40" width="16" height="150" rx="3" fill="#dbeafe" />
                <rect x="555" y="55" width="16" height="135" rx="3" fill="#dbeafe" />

                {/* Smooth Spline Curve for Gross Revenue */}
                <path
                  d="M 40,110 Q 110,85 185,95 T 340,75 T 485,90 T 560,25"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="3.5"
                />

                {/* Data Points */}
                <circle cx="40" cy="110" r="4.5" fill="#ffffff" stroke="#2563eb" strokeWidth="3" />
                <circle cx="185" cy="95" r="4.5" fill="#ffffff" stroke="#2563eb" strokeWidth="3" />
                <circle cx="340" cy="75" r="4.5" fill="#ffffff" stroke="#2563eb" strokeWidth="3" />
                <circle cx="485" cy="90" r="4.5" fill="#ffffff" stroke="#2563eb" strokeWidth="3" />
                <circle cx="560" cy="25" r="5.5" fill="#2563eb" stroke="#ffffff" strokeWidth="3" />
              </svg>
            </div>
          </div>

          {/* X Axis Dates */}
          <div className="flex justify-between text-[11px] font-medium text-slate-400 mt-2 px-2">
            <span>May 01</span>
            <span>May 05</span>
            <span>May 10</span>
            <span>May 15</span>
            <span>May 20</span>
            <span>May 25</span>
            <span>May 30</span>
          </div>
        </div>

        {/* Category Share Donut Chart (4 cols) */}
        <div className="lg:col-span-4 pro-card p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Category Share</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Inventory distribution across {categoriesCount} lines
              </p>
            </div>
            <button type="button" className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>

          {/* Donut Chart representation */}
          <div className="relative flex items-center justify-center my-6">
            <svg className="w-44 h-44 -rotate-90 transform" viewBox="0 0 100 100">
              {/* Electronics 42% (blue-600) */}
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="transparent"
                stroke="#2563eb"
                strokeWidth="11"
                strokeDasharray="100 238"
                strokeDashoffset="0"
              />
              {/* Accessories 24% (blue-400) */}
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="transparent"
                stroke="#60a5fa"
                strokeWidth="11"
                strokeDasharray="57 238"
                strokeDashoffset="-100"
              />
              {/* Smart Home 18% (slate-800) */}
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="transparent"
                stroke="#1e293b"
                strokeWidth="11"
                strokeDasharray="43 238"
                strokeDashoffset="-157"
              />
              {/* Apparel 16% (blue-200) */}
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="transparent"
                stroke="#bfdbfe"
                strokeWidth="11"
                strokeDasharray="38 238"
                strokeDashoffset="-200"
              />
            </svg>

            {/* Inner Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-slate-900 tracking-tight">
                {totalProducts}
              </span>
              <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
                SKUS
              </span>
            </div>
          </div>

          {/* Category Breakdown Legend */}
          <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                <span className="font-semibold text-slate-700">Electronics</span>
              </div>
              <span className="text-slate-500">81 units • <strong className="text-slate-800 font-bold">42%</strong></span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                <span className="font-semibold text-slate-700">Accessories</span>
              </div>
              <span className="text-slate-500">47 units • <strong className="text-slate-800 font-bold">24%</strong></span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-800" />
                <span className="font-semibold text-slate-700">Smart Home</span>
              </div>
              <span className="text-slate-500">35 units • <strong className="text-slate-800 font-bold">18%</strong></span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-200" />
                <span className="font-semibold text-slate-700">Apparel</span>
              </div>
              <span className="text-slate-500">31 units • <strong className="text-slate-800 font-bold">16%</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Products Snippet & System Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Products (8 cols) */}
        <div className="lg:col-span-8 pro-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Recent Products</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  High-velocity items tracked across all active warehouses
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onViewCatalog}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <span>View Full Catalog</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Snippet Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider pb-2">
                    <th className="py-2.5 px-3">Product Name</th>
                    <th className="py-2.5 px-3">SKU</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Price</th>
                    <th className="py-2.5 px-3">Rating</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.thumbnail}
                            alt={item.title}
                            className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 object-cover shrink-0"
                          />
                          <div>
                            <Link
                              href={`/products/${item.id}`}
                              className="font-bold text-slate-900 hover:text-blue-600 transition-colors line-clamp-1"
                            >
                              {item.title}
                            </Link>
                            <span className="text-[11px] text-slate-400">
                              {item.stock} units in stock
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-mono text-[11px] text-slate-500">
                        {item.sku || `PRD-${item.id}`}
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700 capitalize">
                          {item.category}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        {item.stock <= 0 ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-100">
                            <span className="w-1 h-1 rounded-full bg-rose-600" />
                            Out of Stock
                          </span>
                        ) : item.stock <= 10 ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            <span className="w-1 h-1 rounded-full bg-amber-600" />
                            Low Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                            <span className="w-1 h-1 rounded-full bg-emerald-600" />
                            In Stock
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 font-bold text-slate-900">
                        {formatCurrency(item.price)}
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1 font-semibold text-slate-700">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{item.rating.toFixed(1)}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 mt-2">
            <span>Showing 4 of {totalProducts} tracked SKUs</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onViewCatalog}
                className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-medium"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={onViewCatalog}
                className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-medium"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* System Activity Feed (4 cols) */}
        <div className="lg:col-span-4 pro-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-base">System Activity</h3>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Realtime
              </span>
            </div>

            <div className="space-y-4">
              {/* Event 1 */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Boxes className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-800">
                    Sony WH-1000XM5 stock replenished
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    <span className="font-bold text-blue-600">+50 units added</span> • 12m ago
                  </div>
                </div>
              </div>

              {/* Event 2 */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0 mt-0.5">
                  <Star className="w-4 h-4 fill-amber-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-800">
                    New 5-star review received
                  </div>
                  <div className="text-[11px] text-slate-500 line-clamp-1 italic mt-0.5">
                    &ldquo;Exceptional audio quality, instant setup...&rdquo;
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Apex Smartwatch Ultra 2 • 34m ago
                  </div>
                </div>
              </div>

              {/* Event 3 */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-rose-700">
                    Critical Stock Alert
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Keychron Q1 Pro threshold breached
                  </div>
                  <div className="text-[10px] font-bold text-rose-600 mt-0.5">
                    Reorder recommended • 1h ago
                  </div>
                </div>
              </div>

              {/* Event 4 */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-800">
                    Shopify multi-node sync complete
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    194 items reconciled • 2h ago
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="w-full mt-6 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors"
          >
            View Audit Logs
          </button>
        </div>
      </div>
    </div>
  );
}
