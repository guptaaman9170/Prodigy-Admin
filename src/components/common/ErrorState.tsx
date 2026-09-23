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
    <div className="w-full flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-rose-500/20 bg-rose-500/5">
      <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-4">
        <AlertTriangle className="w-8 h-8" />
      </div>
      <h3 className="text-base font-semibold text-rose-200">Data Fetching Error</h3>
      <p className="mt-1.5 max-w-md text-sm text-slate-400">{message}</p>
      <button
        id="retry-button"
        type="button"
        onClick={onRetry}
        disabled={isRetrying}
        className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-md shadow-indigo-600/20 disabled:opacity-50"
      >
        <RefreshCw className={`w-3.5 h-3.5 ${isRetrying ? "animate-spin" : ""}`} />
        <span>{isRetrying ? "Retrying..." : "Retry Request"}</span>
      </button>
    </div>
  );
}
