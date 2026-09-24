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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product) => {
        const isOutOfStock = product.stock <= 0;
        const isLowStock = product.stock > 0 && product.stock <= 10;

        return (
          <div
            key={product.id}
            className="pro-card p-4 flex flex-col justify-between gap-3 pro-card-hover"
          >
            {/* Top row: Thumbnail + Details */}
            <div className="flex gap-3.5 items-start">
              <div className="relative w-18 h-18 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      "https://dummyjson.com/image/100x100?text=No+Img";
                  }}
                />
                {product.isLocal && (
                  <div className="absolute top-1 left-1 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider capitalize">
                    {product.category}
                  </span>
                  {product.isLocal && (
                    <span className="inline-flex items-center gap-0.5 px-1 rounded text-[10px] bg-blue-50 text-blue-700 font-bold border border-blue-100">
                      <Sparkles className="w-2.5 h-2.5" />
                      Local
                    </span>
                  )}
                </div>

                <Link
                  href={`/products/${product.id}`}
                  className="font-bold text-slate-900 hover:text-blue-600 transition-colors line-clamp-1 block text-sm mt-0.5"
                >
                  {product.title}
                </Link>

                <p className="text-xs text-slate-400 mt-0.5 font-mono">
                  {product.sku ? `#${product.sku}` : `#PRD-${product.id}`}
                </p>

                <div className="flex items-center gap-3 mt-1.5">
                  <div className="text-base font-extrabold text-slate-900">
                    {formatCurrency(product.price)}
                  </div>
                  <div className="flex items-center gap-1 text-slate-700 text-xs font-semibold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{product.rating.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom row: Stock Badge + Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              {/* Stock badge */}
              <div>
                {isOutOfStock ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                    Out of stock
                  </span>
                ) : isLowStock ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                    {product.stock} units left
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    {product.stock} units
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1">
                <Link
                  href={`/products/${product.id}`}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                  title="View Details"
                >
                  <Eye className="w-4 h-4" />
                </Link>
                <button
                  type="button"
                  onClick={() => onEdit(product)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                  title="Edit Product"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(product)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
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
