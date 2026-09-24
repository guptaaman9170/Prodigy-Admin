import React from "react";

export function TableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="w-full overflow-hidden pro-card">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-200/80 bg-slate-50/75 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <th className="py-3 px-4 w-12 text-center">
              <div className="w-4 h-4 rounded bg-slate-200 mx-auto" />
            </th>
            <th className="py-3 px-4">Product</th>
            <th className="py-3 px-4">Category</th>
            <th className="py-3 px-4">Price</th>
            <th className="py-3 px-4">Rating</th>
            <th className="py-3 px-4">Stock Status</th>
            <th className="py-3 px-4">Sales Velocity</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {Array.from({ length: rows }).map((_, i) => (
            <tr key={i} className="animate-pulse">
              <td className="py-3.5 px-4 text-center">
                <div className="w-4 h-4 rounded bg-slate-200 mx-auto" />
              </td>
              <td className="py-3.5 px-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-slate-200 shrink-0" />
                  <div className="space-y-1.5 flex-1">
                    <div className="h-3.5 w-40 rounded bg-slate-200" />
                    <div className="h-2.5 w-20 rounded bg-slate-100" />
                  </div>
                </div>
              </td>
              <td className="py-3.5 px-4">
                <div className="h-5 w-20 rounded-md bg-slate-200" />
              </td>
              <td className="py-3.5 px-4">
                <div className="h-4 w-16 rounded bg-slate-200" />
              </td>
              <td className="py-3.5 px-4">
                <div className="h-4 w-12 rounded bg-slate-200" />
              </td>
              <td className="py-3.5 px-4">
                <div className="h-6 w-28 rounded-md bg-slate-200" />
              </td>
              <td className="py-3.5 px-4">
                <div className="h-2 w-24 rounded-full bg-slate-200" />
              </td>
              <td className="py-3.5 px-4 text-right">
                <div className="inline-flex gap-1">
                  <div className="w-7 h-7 rounded-lg bg-slate-200" />
                  <div className="w-7 h-7 rounded-lg bg-slate-200" />
                  <div className="w-7 h-7 rounded-lg bg-slate-200" />
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="pro-card p-4 space-y-3 animate-pulse"
        >
          <div className="flex gap-3">
            <div className="w-18 h-18 rounded-xl bg-slate-200 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3.5 w-3/4 rounded bg-slate-200" />
              <div className="h-2.5 w-1/2 rounded bg-slate-100" />
              <div className="h-4 w-20 rounded bg-slate-200" />
            </div>
          </div>
          <div className="flex justify-between items-center pt-3 border-t border-slate-100">
            <div className="h-5 w-20 rounded bg-slate-200" />
            <div className="flex gap-1">
              <div className="w-6 h-6 rounded bg-slate-200" />
              <div className="w-6 h-6 rounded bg-slate-200" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
