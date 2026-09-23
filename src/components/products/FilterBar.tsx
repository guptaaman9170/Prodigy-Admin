"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  X,
  Filter,
  ArrowUpDown,
  Plus,
  Info,
  RotateCcw,
} from "lucide-react";
import { CategoryItem, SortField, SortOrder } from "@/types/product";
import { useDebounce } from "@/hooks/useDebounce";

interface FilterBarProps {
  searchQuery: string;
  selectedCategory: string;
  sortBy: SortField;
  order: SortOrder;
  categories: CategoryItem[];
  onSearchChange: (search: string) => void;
  onCategoryChange: (category: string) => void;
  onSortChange: (sortBy: SortField, order?: SortOrder) => void;
  onResetFilters: () => void;
  onAddProduct: () => void;
}

export default function FilterBar({
  searchQuery,
  selectedCategory,
  sortBy,
  order,
  categories,
  onSearchChange,
  onCategoryChange,
  onSortChange,
  onResetFilters,
  onAddProduct,
}: FilterBarProps) {
  // Local input state for smooth typing experience
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const debouncedSearch = useDebounce(localSearch, 400);

  // Sync external search change (e.g. from URL or reset) with local state
  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  // When debounced value changes, trigger parent search change
  useEffect(() => {
    if (debouncedSearch !== searchQuery) {
      onSearchChange(debouncedSearch);
    }
  }, [debouncedSearch, searchQuery, onSearchChange]);

  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    selectedCategory !== "all" ||
    sortBy !== "none";

  const isCompoundFilterActive =
    searchQuery.trim().length > 0 && selectedCategory !== "all";

  return (
    <div className="space-y-3 mb-6">
      {/* Primary Toolbar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-lg">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            id="product-search-input"
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search products by title, category, or brand..."
            className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-800 bg-slate-900/80 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
          />
          {localSearch && (
            <button
              type="button"
              onClick={() => {
                setLocalSearch("");
                onSearchChange("");
              }}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Controls & Add Button */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Category Dropdown */}
          <div className="relative flex items-center">
            <Filter className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <select
              id="category-filter-select"
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="pl-9 pr-8 py-2.5 rounded-xl border border-slate-800 bg-slate-900/80 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer capitalize"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.slug} value={cat.slug} className="capitalize">
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="relative flex items-center">
            <ArrowUpDown className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <select
              id="sort-field-select"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortField, order)}
              className="pl-9 pr-8 py-2.5 rounded-xl border border-slate-800 bg-slate-900/80 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="none">Sort: Default</option>
              <option value="title">Sort: Title</option>
              <option value="price">Sort: Price</option>
              <option value="rating">Sort: Rating</option>
              <option value="stock">Sort: Stock</option>
            </select>
          </div>

          {/* Ascending / Descending Toggle Button */}
          {sortBy !== "none" && (
            <button
              type="button"
              onClick={() => onSortChange(sortBy, order === "asc" ? "desc" : "asc")}
              className="py-2.5 px-3 rounded-xl border border-slate-800 bg-slate-900/80 text-xs font-medium text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
              title={`Currently sorted ${order === "asc" ? "Ascending" : "Descending"}. Click to toggle.`}
            >
              {order === "asc" ? "Asc ↑" : "Desc ↓"}
            </button>
          )}

          {/* Add Product Button */}
          <button
            id="add-product-button"
            type="button"
            onClick={onAddProduct}
            className="inline-flex items-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-indigo-600/20 transition-all transform active:scale-95 ml-auto sm:ml-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Active Filter Chips & Compound Indicator */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-slate-400">Active filters:</span>

          {searchQuery && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300">
              <span>Query: &ldquo;{searchQuery}&rdquo;</span>
              <button
                type="button"
                onClick={() => {
                  setLocalSearch("");
                  onSearchChange("");
                }}
                className="hover:text-indigo-100"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedCategory !== "all" && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 capitalize">
              <span>Category: {selectedCategory}</span>
              <button
                type="button"
                onClick={() => onCategoryChange("all")}
                className="hover:text-indigo-100"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {sortBy !== "none" && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 capitalize">
              <span>
                Sorted by {sortBy} ({order})
              </span>
              <button
                type="button"
                onClick={() => onSortChange("none")}
                className="hover:text-indigo-100"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-1 text-slate-400 hover:text-slate-200 ml-1 underline decoration-slate-600 underline-offset-2"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset All</span>
          </button>
        </div>
      )}

      {/* Explanatory Notice for Combined Search + Category Filter */}
      {isCompoundFilterActive && (
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400">
          <Info className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>
            <strong>Note:</strong> Compound search active. DummyJSON searches across catalog; results are filtered to category <em>&ldquo;{selectedCategory}&rdquo;</em> client-side.
          </span>
        </div>
      )}
    </div>
  );
}
