import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  message?: string;
  onRetry: () => void;
  isRetrying?: boolean;
}

export default function ErrorState({
  message = "Failed to load products from server. Please check your network and try again.",
  onRetry,
  isRetrying = false,
}: ErrorStateProps) {
  return (
    <div className="w-full flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-rose-200 bg-white shadow-2xs">
      <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 mb-4 shadow-sm">
        <AlertTriangle className="w-7 h-7" />
      </div>
      <h3 className="text-base font-bold text-rose-900">Data Fetching Error</h3>
      <p className="mt-1 max-w-md text-xs text-slate-500 leading-relaxed">{message}</p>
      <button
        id="retry-button"
        type="button"
        onClick={onRetry}
        disabled={isRetrying}
        className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-sm shadow-blue-500/20 disabled:opacity-50"
      >
        <RefreshCw className={`w-3.5 h-3.5 ${isRetrying ? "animate-spin" : ""}`} />
        <span>{isRetrying ? "Retrying..." : "Retry Request"}</span>
      </button>
    </div>
  );
}
