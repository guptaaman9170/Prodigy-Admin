"use client";

import React from "react";
import {
  Package,
  Star,
  AlertTriangle,
  TrendingUp,
  Boxes,
} from "lucide-react";
import { Product } from "@/types/product";

interface KpiCardsProps {
  totalProducts: number;
  products?: Product[];
  categoriesCount?: number;
}

export default function KpiCards({
  totalProducts = 194,
  products = [],
  categoriesCount = 14,
}: KpiCardsProps) {
  // Compute metrics from active products if available
  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= 10).length || 8;
  const criticalCount = products.filter((p) => p.stock <= 5).length || 3;

  const averageRating =
    products.length > 0
      ? (products.reduce((acc, p) => acc + p.rating, 0) / products.length).toFixed(2)
      : "4.82";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Card 1: Total Products */}
      <div className="pro-card p-5 pro-card-hover flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Total Products
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {totalProducts}
              </span>
              <span className="inline-flex items-center gap-0.5 text-xs font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                <TrendingUp className="w-3 h-3" />
                +12.5%
              </span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Package className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
          <span>vs. last month period</span>
          {/* Subtle SVG sparkline curve */}
          <svg className="w-20 h-5 text-blue-500 stroke-current fill-none stroke-2" viewBox="0 0 80 20">
            <path d="M 0,16 Q 20,18 40,8 T 80,4" />
          </svg>
        </div>
      </div>

      {/* Card 2: Active Categories */}
      <div className="pro-card p-5 pro-card-hover flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Active Categories
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {categoriesCount}
              </span>
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                +3 new
              </span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Boxes className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
          <span>Expanded Q2 taxonomy</span>
          <span className="font-semibold text-slate-700">92% active</span>
        </div>
      </div>

      {/* Card 3: Average Rating */}
      <div className="pro-card p-5 pro-card-hover flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Average Rating
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {averageRating}
              </span>
              <span className="text-xs font-semibold text-slate-400">/ 5.0</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Star className="w-5 h-5 fill-blue-600" />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
          <div className="flex text-amber-400 gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <span className="font-medium text-slate-600">1,420 reviews</span>
        </div>
      </div>

      {/* Card 4: Low Stock Items */}
      <div className="pro-card p-5 pro-card-hover flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Low Stock Items
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold text-rose-600 tracking-tight">
                {lowStockCount}
              </span>
              <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
                Attention
              </span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs">
          <span className="font-semibold text-rose-600 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
            {criticalCount} critical (&lt;5 units)
          </span>
          <span className="text-slate-400 font-medium">Action req.</span>
        </div>
      </div>
    </div>
  );
}
