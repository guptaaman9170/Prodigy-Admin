"use client";

import React, { useState } from "react";
import { Product } from "@/types/product";
import { AlertTriangle, Trash2, X, Loader2 } from "lucide-react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: number) => Promise<void>;
  product?: Product | null;
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  product,
}: DeleteConfirmModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmedCheckbox, setConfirmedCheckbox] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !product) return null;

  const handleDelete = async () => {
    if (isDeleting || !confirmedCheckbox) return;

    setError(null);
    try {
      setIsDeleting(true);
      await onConfirm(product.id);
      onClose();
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      setError(errorObj?.message || "Failed to delete product. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 sm:p-7 relative overflow-hidden">
        {/* Top Icon & Title */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0">
            <Trash2 className="w-6 h-6" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-extrabold text-slate-900">Delete this product?</h3>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Are you sure you want to delete{" "}
              <strong className="text-slate-900 font-bold">&ldquo;{product.title}&rdquo;</strong>{" "}
              <span className="font-mono text-slate-400">
                ({product.sku ? `#${product.sku}` : `#PRD-${product.id}`})
              </span>
              ? This action cannot be undone and will immediately remove this item from your live catalog and stop incoming orders.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Critical Inventory Warning box */}
        <div className="mt-4 p-3.5 rounded-2xl bg-rose-50/80 border border-rose-200/80 text-rose-800 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span>Critical Inventory Warning</span>
          </div>
          <p className="text-[11px] text-rose-600 leading-relaxed">
            Warning: 2 pending customer orders are currently linked to this SKU. Deleting will immediately put these shipments on administrative hold.
          </p>
        </div>

        {/* Confirmation Checkbox */}
        <div className="mt-4 pt-1">
          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={confirmedCheckbox}
              onChange={(e) => setConfirmedCheckbox(e.target.checked)}
              className="mt-0.5 rounded border-slate-300 text-rose-600 focus:ring-rose-500 w-4 h-4 cursor-pointer"
            />
            <span className="text-xs font-semibold text-slate-700">
              I understand that this action is permanent and irreversible
            </span>
          </label>
        </div>

        {error && (
          <div className="mt-3 p-2.5 rounded-xl bg-rose-100 text-rose-700 text-xs">
            {error}
          </div>
        )}

        {/* Buttons */}
        <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            id="confirm-delete-button"
            type="button"
            onClick={handleDelete}
            disabled={isDeleting || !confirmedCheckbox}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-xs font-bold text-white shadow-sm shadow-rose-600/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-3.5 h-3.5" />
                <span>Yes, Delete Product</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
