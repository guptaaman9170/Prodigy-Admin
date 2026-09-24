import React from "react";
import { PackageSearch, RotateCcw } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  onReset?: () => void;
}

export default function EmptyState({
  title = "No products found",
  description = "No items matched your active search query or category filters. Try adjusting your parameters.",
  onReset,
}: EmptyStateProps) {
  return (
    <div className="w-full flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-slate-200 bg-white shadow-2xs">
      <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-4 shadow-sm">
        <PackageSearch className="w-7 h-7" />
      </div>
      <h3 className="text-base font-bold text-slate-900">{title}</h3>
      <p className="mt-1 max-w-sm text-xs text-slate-500 leading-relaxed">{description}</p>
      {onReset && (
        <button
          type="button"
          onClick={onReset}
          className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all shadow-sm"
        >
          <RotateCcw className="w-3.5 h-3.5 text-blue-600" />
          <span>Clear Filters</span>
        </button>
      )}
    </div>
  );
}
