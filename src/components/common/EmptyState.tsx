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
    <div className="w-full flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/30">
      <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-slate-400 mb-4 shadow-inner">
        <PackageSearch className="w-8 h-8 text-indigo-400" />
      </div>
      <h3 className="text-base font-semibold text-slate-200">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-slate-400">{description}</p>
      {onReset && (
        <button
          type="button"
          onClick={onReset}
          className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5 text-indigo-400" />
          <span>Clear Filters</span>
        </button>
      )}
    </div>
  );
}
