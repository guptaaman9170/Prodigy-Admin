"use client";

import React from "react";
import Link from "next/link";
import { Product, SortField, SortOrder } from "@/types/product";
import { formatCurrency } from "@/lib/utils";
import {
  Star,
  Eye,
  Pencil,
  Trash2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Sparkles,
} from "lucide-react";

interface ProductTableProps {
  products: Product[];
  sortBy: SortField;
  order: SortOrder;
  onSort: (field: SortField) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export default function ProductTable({
  products,
  sortBy,
  order,
  onSort,
  onEdit,
  onDelete,
}: ProductTableProps) {
  // Sort header icon helper
  const renderSortIcon = (field: SortField) => {
    if (sortBy !== field) {
      return <ArrowUpDown className="w-3.5 h-3.5 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />;
    }
    return order === "asc" ? (
      <ArrowUp className="w-3.5 h-3.5 text-indigo-400" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-indigo-400" />
    );
  };

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl backdrop-blur-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800/80 bg-slate-900/90 text-xs font-semibold text-slate-300 uppercase tracking-wider select-none">
              <th scope="col" className="py-4 px-4 w-20">
                Image
              </th>
              <th
                scope="col"
                className="py-4 px-4 cursor-pointer group hover:text-white transition-colors"
                onClick={() => onSort("title")}
              >
                <div className="flex items-center gap-1.5">
                  <span>Product Title</span>
                  {renderSortIcon("title")}
                </div>
              </th>
              <th scope="col" className="py-4 px-4">
                Category
              </th>
              <th
                scope="col"
                className="py-4 px-4 cursor-pointer group hover:text-white transition-colors"
                onClick={() => onSort("price")}
              >
                <div className="flex items-center gap-1.5">
                  <span>Price</span>
                  {renderSortIcon("price")}
                </div>
              </th>
              <th
                scope="col"
                className="py-4 px-4 cursor-pointer group hover:text-white transition-colors"
                onClick={() => onSort("rating")}
              >
                <div className="flex items-center gap-1.5">
                  <span>Rating</span>
                  {renderSortIcon("rating")}
                </div>
              </th>
              <th
                scope="col"
                className="py-4 px-4 cursor-pointer group hover:text-white transition-colors"
                onClick={() => onSort("stock")}
              >
                <div className="flex items-center gap-1.5">
                  <span>Stock</span>
                  {renderSortIcon("stock")}
                </div>
              </th>
              <th scope="col" className="py-4 px-4 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-sm">
            {products.map((product) => {
              const isOutOfStock = product.stock <= 0;
              const isLowStock = product.stock > 0 && product.stock <= 10;

              return (
                <tr
                  key={product.id}
                  className="hover:bg-slate-800/40 transition-colors group"
                >
                  {/* Thumbnail */}
                  <td className="py-3 px-4">
                    <div className="relative w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700/60 overflow-hidden flex items-center justify-center shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={product.thumbnail}
                        alt={product.title}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        onError={(e) => {
                          // Fallback placeholder on error
                          (e.currentTarget as HTMLImageElement).src =
                            "https://dummyjson.com/image/100x100?text=No+Img";
                        }}
                      />
                      {product.isLocal && (
                        <div
                          title="Locally created or modified product"
                          className="absolute top-1 left-1 w-2 h-2 rounded-full bg-indigo-400 ring-2 ring-slate-900"
                        />
                      )}
                    </div>
                  </td>

                  {/* Title & Brand */}
                  <td className="py-3 px-4 max-w-xs">
                    <Link
                      href={`/products/${product.id}`}
                      className="font-medium text-slate-100 hover:text-indigo-400 transition-colors line-clamp-1 block"
                      title={product.title}
                    >
                      {product.title}
                    </Link>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                      <span>{product.brand || "Generic"}</span>
                      {product.sku && (
                        <>
                          <span>•</span>
                          <span className="font-mono text-[11px] text-slate-500">
                            {product.sku}
                          </span>
                        </>
                      )}
                      {product.isLocal && (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[10px] bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                          <Sparkles className="w-2.5 h-2.5" />
                          Local
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700/60 capitalize">
                      {product.category}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="py-3 px-4 font-semibold text-slate-100">
                    <div>{formatCurrency(product.price)}</div>
                    {product.discountPercentage && product.discountPercentage > 0 ? (
                      <div className="text-[11px] font-normal text-emerald-400">
                        {product.discountPercentage}% off
                      </div>
                    ) : null}
                  </td>

                  {/* Rating */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5 text-slate-200">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="font-medium text-xs">
                        {product.rating.toFixed(1)}
                      </span>
                    </div>
                  </td>

                  {/* Stock Status */}
                  <td className="py-3 px-4">
                    {isOutOfStock ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                        Out of stock
                      </span>
                    ) : isLowStock ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        {product.stock} left
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        {product.stock} in stock
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <Link
                        href={`/products/${product.id}`}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                        title="View Product Details"
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
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
