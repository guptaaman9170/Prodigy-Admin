"use client";

import React from "react";
import Link from "next/link";
import { Product } from "@/types/product";
import { formatCurrency } from "@/lib/utils";
import { Star, Eye, Pencil, Trash2, Sparkles } from "lucide-react";

interface ProductCardsProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export default function ProductCards({
  products,
  onEdit,
  onDelete,
}: ProductCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {products.map((product) => {
        const isOutOfStock = product.stock <= 0;
        const isLowStock = product.stock > 0 && product.stock <= 10;

        return (
          <div
            key={product.id}
            className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 flex flex-col justify-between gap-3 shadow-lg relative overflow-hidden group hover:border-slate-700 transition-all"
          >
            {/* Top row: Thumbnail + Details */}
            <div className="flex gap-3.5 items-start">
              <div className="relative w-20 h-20 rounded-xl bg-slate-800 border border-slate-700/60 overflow-hidden flex items-center justify-center shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      "https://dummyjson.com/image/100x100?text=No+Img";
                  }}
                />
                {product.isLocal && (
                  <div className="absolute top-1 left-1 w-2 h-2 rounded-full bg-indigo-400 ring-2 ring-slate-900" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] font-medium text-slate-400 capitalize">
                    {product.category}
                  </span>
                  {product.isLocal && (
                    <span className="inline-flex items-center gap-0.5 px-1 rounded text-[10px] bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                      <Sparkles className="w-2.5 h-2.5" />
                      Local
                    </span>
                  )}
                </div>

                <Link
                  href={`/products/${product.id}`}
                  className="font-semibold text-slate-100 hover:text-indigo-400 transition-colors line-clamp-1 block text-sm mt-0.5"
                >
                  {product.title}
                </Link>

                <p className="text-xs text-slate-400 mt-0.5 truncate">
                  {product.brand || "Generic"}
                </p>

                <div className="flex items-center gap-3 mt-1.5">
                  <div className="text-sm font-bold text-white">
                    {formatCurrency(product.price)}
                  </div>
                  <div className="flex items-center gap-1 text-slate-300 text-xs">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{product.rating.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom row: Stock Badge + Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
              {/* Stock badge */}
              <div>
                {isOutOfStock ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                    Out of stock
                  </span>
                ) : isLowStock ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    {product.stock} left
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    {product.stock} in stock
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1">
                <Link
                  href={`/products/${product.id}`}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
                  title="View Details"
                >
                  <Eye className="w-4 h-4" />
                </Link>
                <button
                  type="button"
                  onClick={() => onEdit(product)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors"
                  title="Edit Product"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(product)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="Delete Product"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
