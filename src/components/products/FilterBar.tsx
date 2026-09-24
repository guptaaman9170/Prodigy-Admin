"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  X,
  RotateCcw,
  LayoutList,
  LayoutGrid,
  Download,
  Plus,
  SlidersHorizontal,
  FileSpreadsheet,
  ChevronDown,
} from "lucide-react";
import { CategoryItem, SortField, SortOrder } from "@/types/product";
import { useDebounce } from "@/hooks/useDebounce";

interface FilterBarProps {
  searchQuery: string;
  selectedCategory: string;
  selectedStatus?: string;
  sortBy: SortField;
  order: SortOrder;
  categories: CategoryItem[];
  totalItems: number;
  displayedItemsCount: number;
  viewMode: "table" | "grid";
  onSearchChange: (search: string) => void;
  onCategoryChange: (category: string) => void;
  onStatusChange?: (status: string) => void;
  onSortChange: (sortBy: SortField, order?: SortOrder) => void;
  onResetFilters: () => void;
  onAddProduct: () => void;
  onViewModeChange: (mode: "table" | "grid") => void;
}

export default function FilterBar({
  searchQuery,
  selectedCategory,
  selectedStatus = "all",
  sortBy,
  order,
  categories,
  totalItems,
  displayedItemsCount,
  viewMode,
  onSearchChange,
  onCategoryChange,
  onStatusChange,
  onSortChange,
  onResetFilters,
  onAddProduct,
  onViewModeChange,
}: FilterBarProps) {
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const debouncedSearch = useDebounce(localSearch, 400);

  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    if (debouncedSearch !== searchQuery) {
      onSearchChange(debouncedSearch);
    }
  }, [debouncedSearch, searchQuery, onSearchChange]);

  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    selectedCategory !== "all" ||
    selectedStatus !== "all" ||
    sortBy !== "none";

  return (
    <div className="space-y-4 mb-6">
      {/* Top Header of Catalog: Title, Count Badge, Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Products Catalog
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
              {totalItems} items
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage, filter, and track all {totalItems} inventory items across stores and fulfillment channels.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
            <span>Bulk Actions</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500" />
            <span>Import CSV</span>
          </button>

          <button
            id="add-product-button"
            type="button"
            onClick={onAddProduct}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-semibold text-white shadow-sm shadow-blue-500/20 transition-all transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Main Filter Toolbar Container */}
      <div className="pro-card p-4 space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="product-search-input"
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search by product title, SKU, or tag..."
              className="w-full pl-9 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
            />
            {localSearch && (
              <button
                type="button"
                onClick={() => {
                  setLocalSearch("");
                  onSearchChange("");
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Controls & View Toggle */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Category Filter */}
            <select
              id="category-filter-select"
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500 focus:bg-white cursor-pointer capitalize"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug} className="capitalize">
                  {c.name}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => onStatusChange && onStatusChange(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500 focus:bg-white cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="in_stock">In Stock</option>
              <option value="low_stock">Low Stock (≤ 10)</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>

            {/* Sort Dropdown */}
            <select
              id="sort-field-select"
              value={sortBy === "none" ? "none" : `${sortBy}-${order}`}
              onChange={(e) => {
                const val = e.target.value;
                if (val === "none") {
                  onSortChange("none");
                } else {
                  const [field, ord] = val.split("-") as [SortField, SortOrder];
                  onSortChange(field, ord);
                }
              }}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500 focus:bg-white cursor-pointer"
            >
              <option value="none">Recently Updated</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating-desc">Rating: Highest</option>
              <option value="rating-asc">Rating: Lowest</option>
              <option value="title-asc">Title: A to Z</option>
              <option value="title-desc">Title: Z to A</option>
              <option value="stock-desc">Stock: High to Low</option>
              <option value="stock-asc">Stock: Low to High</option>
            </select>

            {/* Reset Button */}
            <button
              type="button"
              onClick={onResetFilters}
              disabled={!hasActiveFilters}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-600 transition-colors disabled:opacity-40"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            {/* View Mode Toggle: Table vs Grid */}
            <div className="flex items-center p-0.5 rounded-xl border border-slate-200 bg-slate-50">
              <button
                type="button"
                onClick={() => onViewModeChange("table")}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === "table"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-slate-400 hover:text-slate-700"
                }`}
                title="Table View"
              >
                <LayoutList className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onViewModeChange("grid")}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === "grid"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-slate-400 hover:text-slate-700"
                }`}
                title="Grid/Card View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Secondary Meta Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
          <div>
            Displaying <strong className="text-slate-800 font-semibold">{displayedItemsCount} items</strong> • Store:{" "}
            <span className="text-slate-700 font-medium">All Fulfillment Nodes</span> • Currency:{" "}
            <span className="text-slate-700 font-medium">USD ($)</span>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-1 text-slate-600 hover:text-blue-600 font-semibold transition-colors self-start sm:self-auto"
          >
            <Download className="w-3 h-3 text-slate-400" />
            <span>Export View</span>
          </button>
        </div>
      </div>
    </div>
  );
}
