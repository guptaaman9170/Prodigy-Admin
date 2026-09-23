"use client";

import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface PaginationProps {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  disabled?: boolean;
}

export default function Pagination({
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  disabled = false,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  // Calculate start and end indices
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Generate page numbers with ellipses
  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    const delta = 1; // Number of pages to show around current page

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    const left = Math.max(2, currentPage - delta);
    const right = Math.min(totalPages - 1, currentPage + delta);

    pages.push(1);

    if (left > 2) {
      pages.push("...");
    }

    for (let i = left; i <= right; i++) {
      pages.push(i);
    }

    if (right < totalPages - 1) {
      pages.push("...");
    }

    pages.push(totalPages);

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2 text-sm text-slate-300">
      {/* Left side: Showing X-Y of Z & Page Size selector */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Item range counter */}
        <span className="text-xs sm:text-sm text-slate-400">
          Showing <span className="font-semibold text-slate-200">{startItem}–{endItem}</span> of{" "}
          <span className="font-semibold text-slate-200">{totalItems}</span>
        </span>

        {/* Page size dropdown */}
        <div className="flex items-center gap-2">
          <label htmlFor="pageSizeSelect" className="text-xs text-slate-400">
            Per page:
          </label>
          <select
            id="pageSizeSelect"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            disabled={disabled}
            className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 disabled:opacity-50 cursor-pointer"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {/* Right side: Page navigation controls */}
      <div className="flex items-center gap-1">
        {/* First Page */}
        <button
          type="button"
          onClick={() => onPageChange(1)}
          disabled={currentPage <= 1 || disabled}
          className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="First Page"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>

        {/* Previous Page */}
        <button
          id="prev-page-button"
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1 || disabled}
          className="flex items-center gap-1 py-1.5 px-2.5 rounded-lg border border-slate-800 bg-slate-900 text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Prev</span>
        </button>

        {/* Numeric page buttons */}
        <div className="flex items-center gap-1 mx-1">
          {pageNumbers.map((p, idx) => {
            if (p === "...") {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-2 py-1 text-xs text-slate-600 select-none"
                >
                  ...
                </span>
              );
            }

            const pageNum = Number(p);
            const isActive = pageNum === currentPage;

            return (
              <button
                key={pageNum}
                type="button"
                onClick={() => onPageChange(pageNum)}
                disabled={disabled}
                className={`min-w-8 h-8 px-2 text-xs font-medium rounded-lg transition-all ${
                  isActive
                    ? "bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/30"
                    : "border border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        {/* Next Page */}
        <button
          id="next-page-button"
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages || disabled}
          className="flex items-center gap-1 py-1.5 px-2.5 rounded-lg border border-slate-800 bg-slate-900 text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Last Page */}
        <button
          type="button"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage >= totalPages || disabled}
          className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Last Page"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
