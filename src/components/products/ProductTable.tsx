"use client";

import React, { useState } from "react";
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
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(products.map((p) => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const renderSortIcon = (field: SortField) => {
    if (sortBy !== field) {
      return (
        <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
      );
    }
    return order === "asc" ? (
      <ArrowUp className="w-3.5 h-3.5 text-blue-600" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-blue-600" />
    );
  };

  return (
    <div className="w-full overflow-hidden pro-card">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200/80 bg-slate-50/75 text-[11px] font-bold text-slate-500 uppercase tracking-wider select-none">
              <th scope="col" className="py-3 px-4 w-12 text-center">
                <input
                  type="checkbox"
                  checked={
                    products.length > 0 &&
                    selectedIds.length === products.length
                  }
                  onChange={handleSelectAll}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                />
              </th>
              <th
                scope="col"
                className="py-3 px-4 cursor-pointer group hover:text-slate-900 transition-colors"
                onClick={() => onSort("title")}
              >
                <div className="flex items-center gap-1.5">
                  <span>Product</span>
                  {renderSortIcon("title")}
                </div>
              </th>
              <th scope="col" className="py-3 px-4">
                Category
              </th>
              <th
                scope="col"
                className="py-3 px-4 cursor-pointer group hover:text-slate-900 transition-colors"
                onClick={() => onSort("price")}
              >
                <div className="flex items-center gap-1.5">
                  <span>Price</span>
                  {renderSortIcon("price")}
                </div>
              </th>
              <th
                scope="col"
                className="py-3 px-4 cursor-pointer group hover:text-slate-900 transition-colors"
                onClick={() => onSort("rating")}
              >
                <div className="flex items-center gap-1.5">
                  <span>Rating</span>
                  {renderSortIcon("rating")}
                </div>
              </th>
              <th
                scope="col"
                className="py-3 px-4 cursor-pointer group hover:text-slate-900 transition-colors"
                onClick={() => onSort("stock")}
              >
                <div className="flex items-center gap-1.5">
                  <span>Stock Status</span>
                  {renderSortIcon("stock")}
                </div>
              </th>
              <th scope="col" className="py-3 px-4">
                Sales Velocity
              </th>
              <th scope="col" className="py-3 px-4 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
            {products.map((product) => {
              const isSelected = selectedIds.includes(product.id);
              const isOutOfStock = product.stock <= 0;
              const isLowStock = product.stock > 0 && product.stock <= 10;

              // Generate pseudo sales velocity for visual parity with design
              const velocityType =
                product.stock > 100
                  ? { label: "High", rate: "94/wk", bar: "w-14 bg-blue-600" }
                  : product.stock > 40
                  ? { label: "Med", rate: "52/wk", bar: "w-10 bg-blue-500" }
                  : product.stock > 10
                  ? { label: "Stable", rate: "19/wk", bar: "w-8 bg-blue-400" }
                  : product.stock > 0
                  ? { label: "Spike", rate: "31/wk", bar: "w-12 bg-amber-500" }
                  : { label: "Idle", rate: "0/wk", bar: "w-4 bg-slate-300" };

              return (
                <tr
                  key={product.id}
                  className={`hover:bg-slate-50/80 transition-colors group ${
                    isSelected ? "bg-blue-50/40" : ""
                  }`}
                >
                  {/* Row Checkbox */}
                  <td className="py-3.5 px-4 text-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleSelectOne(product.id)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                    />
                  </td>

                  {/* Product: Thumbnail + Title + SKU */}
                  <td className="py-3.5 px-4 max-w-sm">
                    <div className="flex items-center gap-3">
                      <div className="relative w-11 h-11 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
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
                          <div
                            title="Locally added product"
                            className="absolute top-1 left-1 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white"
                          />
                        )}
                      </div>

                      <div className="min-w-0">
                        <Link
                          href={`/products/${product.id}`}
                          className="font-bold text-slate-900 hover:text-blue-600 transition-colors line-clamp-1 block text-sm"
                          title={product.title}
                        >
                          {product.title}
                        </Link>
                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                          <span className="font-mono">
                            {product.sku ? `#${product.sku}` : `#PRD-${product.id}`}
                          </span>
                          {product.isLocal && (
                            <span className="inline-flex items-center gap-0.5 px-1.5 rounded text-[10px] bg-blue-50 text-blue-600 font-semibold border border-blue-100">
                              <Sparkles className="w-2.5 h-2.5" />
                              Local
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 capitalize">
                      {product.category}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="py-3.5 px-4 font-bold text-slate-900 text-sm">
                    {formatCurrency(product.price)}
                  </td>

                  {/* Rating */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{product.rating.toFixed(1)}</span>
                      <span className="text-[11px] text-slate-400 font-normal">
                        ({product.reviews?.length ? product.reviews.length * 40 + 12 : 84})
                      </span>
                    </div>
                  </td>

                  {/* Stock Status Badge */}
                  <td className="py-3.5 px-4">
                    {isOutOfStock ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                        Out of Stock: 0 units
                      </span>
                    ) : isLowStock ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                        Low Stock: {product.stock} units
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                        In Stock: {product.stock} units
                      </span>
                    )}
                  </td>

                  {/* Sales Velocity */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${velocityType.bar}`} />
                      </div>
                      <span className="text-[11px] text-slate-500 font-medium whitespace-nowrap">
                        {velocityType.label}{" "}
                        <span className="text-slate-400">({velocityType.rate})</span>
                      </span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="inline-flex items-center gap-1">
                      <Link
                        href={`/products/${product.id}`}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        title="View Product"
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
