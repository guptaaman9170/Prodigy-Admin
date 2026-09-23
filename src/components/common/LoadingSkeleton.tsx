import React from "react";

export function TableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-900/50">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-800 bg-slate-900/90 text-xs text-slate-400 uppercase tracking-wider">
            <th className="py-3.5 px-4 w-16">Item</th>
            <th className="py-3.5 px-4">Title & Brand</th>
            <th className="py-3.5 px-4">Category</th>
            <th className="py-3.5 px-4">Price</th>
            <th className="py-3.5 px-4">Rating</th>
            <th className="py-3.5 px-4">Stock</th>
            <th className="py-3.5 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60">
          {Array.from({ length: rows }).map((_, i) => (
            <tr key={i} className="animate-pulse">
              <td className="py-3.5 px-4">
                <div className="w-12 h-12 rounded-lg bg-slate-800 animate-shimmer" />
              </td>
              <td className="py-3.5 px-4">
                <div className="h-4 w-44 rounded bg-slate-800 animate-shimmer mb-2" />
                <div className="h-3 w-24 rounded bg-slate-800/60 animate-shimmer" />
              </td>
              <td className="py-3.5 px-4">
                <div className="h-6 w-20 rounded-full bg-slate-800 animate-shimmer" />
              </td>
              <td className="py-3.5 px-4">
                <div className="h-4 w-16 rounded bg-slate-800 animate-shimmer" />
              </td>
              <td className="py-3.5 px-4">
                <div className="h-4 w-12 rounded bg-slate-800 animate-shimmer" />
              </td>
              <td className="py-3.5 px-4">
                <div className="h-6 w-20 rounded-full bg-slate-800 animate-shimmer" />
              </td>
              <td className="py-3.5 px-4 text-right">
                <div className="inline-flex gap-2">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 animate-shimmer" />
                  <div className="w-8 h-8 rounded-lg bg-slate-800 animate-shimmer" />
                  <div className="w-8 h-8 rounded-lg bg-slate-800 animate-shimmer" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function CardSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-3 animate-pulse"
        >
          <div className="flex gap-3">
            <div className="w-20 h-20 rounded-lg bg-slate-800 animate-shimmer shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 rounded bg-slate-800 animate-shimmer" />
              <div className="h-3 w-1/2 rounded bg-slate-800/60 animate-shimmer" />
              <div className="h-5 w-20 rounded-full bg-slate-800 animate-shimmer" />
            </div>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-slate-800">
            <div className="h-5 w-16 rounded bg-slate-800 animate-shimmer" />
            <div className="h-5 w-20 rounded-full bg-slate-800 animate-shimmer" />
          </div>
          <div className="flex gap-2 pt-1">
            <div className="h-8 flex-1 rounded bg-slate-800 animate-shimmer" />
            <div className="h-8 flex-1 rounded bg-slate-800 animate-shimmer" />
          </div>
        </div>
      ))}
    </div>
  );
}
