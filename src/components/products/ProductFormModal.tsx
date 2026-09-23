"use client";

import React, { useState, useEffect } from "react";
import { Product, ProductFormData, CategoryItem } from "@/types/product";
import { X, Loader2, Sparkles, AlertCircle } from "lucide-react";

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProductFormData) => Promise<void>;
  initialProduct?: Product | null;
  categories: CategoryItem[];
}

export default function ProductFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialProduct,
  categories,
}: ProductFormModalProps) {
  const isEditMode = !!initialProduct;

  const [formData, setFormData] = useState<ProductFormData>({
    title: "",
    description: "",
    category: "",
    price: 0,
    stock: 0,
    brand: "",
    discountPercentage: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Pre-fill form when editing or clear when adding
  useEffect(() => {
    if (initialProduct) {
      setFormData({
        title: initialProduct.title || "",
        description: initialProduct.description || "",
        category: initialProduct.category || "",
        price: initialProduct.price || 0,
        stock: initialProduct.stock || 0,
        brand: initialProduct.brand || "",
        discountPercentage: initialProduct.discountPercentage || 0,
        thumbnail: initialProduct.thumbnail,
      });
    } else {
      setFormData({
        title: "",
        description: "",
        category: categories[0]?.slug || "beauty",
        price: 19.99,
        stock: 50,
        brand: "",
        discountPercentage: 0,
      });
    }
    setErrors({});
    setSubmitError(null);
  }, [initialProduct, categories, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Product title is required";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = "Price must be greater than $0";
    }

    if (isNaN(Number(formData.stock)) || Number(formData.stock) < 0) {
      newErrors.stock = "Stock must be 0 or higher";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setSubmitError(null);
    if (!validate()) return;

    try {
      setIsSubmitting(true);
      await onSubmit(formData);
      onClose();
    } catch (err: unknown) {
      const error = err as { message?: string };
      setSubmitError(error?.message || "Failed to save product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
          <div>
            <h2 className="text-lg font-bold text-white">
              {isEditMode ? "Edit Product" : "Add New Product"}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {isEditMode
                ? "Update product details in the catalog"
                : "Fill in product specifications to create a new item"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {submitError && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <span>{submitError}</span>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value });
                if (errors.title) setErrors({ ...errors, title: "" });
              }}
              placeholder="e.g. Wireless Noise-Cancelling Headphones"
              className={`w-full px-3.5 py-2 rounded-xl border bg-slate-950 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 ${
                errors.title
                  ? "border-rose-500/60 focus:ring-rose-500"
                  : "border-slate-800 focus:border-indigo-500 focus:ring-indigo-500"
              }`}
            />
            {errors.title && <p className="text-xs text-rose-400 mt-1">{errors.title}</p>}
          </div>

          {/* Category & Brand Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Category <span className="text-rose-400">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => {
                  setFormData({ ...formData, category: e.target.value });
                  if (errors.category) setErrors({ ...errors, category: "" });
                }}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-800 bg-slate-950 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 capitalize"
              >
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug} className="capitalize">
                    {c.name}
                  </option>
                ))}
              </select>
              {errors.category && <p className="text-xs text-rose-400 mt-1">{errors.category}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Brand</label>
              <input
                type="text"
                value={formData.brand || ""}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                placeholder="e.g. Sony, Apple, Generic"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-800 bg-slate-950 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Price & Stock Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Price ($ USD) <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={formData.price}
                onChange={(e) => {
                  setFormData({ ...formData, price: parseFloat(e.target.value) || 0 });
                  if (errors.price) setErrors({ ...errors, price: "" });
                }}
                className={`w-full px-3.5 py-2 rounded-xl border bg-slate-950 text-sm text-slate-100 focus:outline-none focus:ring-1 ${
                  errors.price
                    ? "border-rose-500/60 focus:ring-rose-500"
                    : "border-slate-800 focus:border-indigo-500 focus:ring-indigo-500"
                }`}
              />
              {errors.price && <p className="text-xs text-rose-400 mt-1">{errors.price}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Stock Quantity <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => {
                  setFormData({ ...formData, stock: parseInt(e.target.value, 10) || 0 });
                  if (errors.stock) setErrors({ ...errors, stock: "" });
                }}
                className={`w-full px-3.5 py-2 rounded-xl border bg-slate-950 text-sm text-slate-100 focus:outline-none focus:ring-1 ${
                  errors.stock
                    ? "border-rose-500/60 focus:ring-rose-500"
                    : "border-slate-800 focus:border-indigo-500 focus:ring-indigo-500"
                }`}
              />
              {errors.stock && <p className="text-xs text-rose-400 mt-1">{errors.stock}</p>}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Description <span className="text-rose-400">*</span>
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => {
                setFormData({ ...formData, description: e.target.value });
                if (errors.description) setErrors({ ...errors, description: "" });
              }}
              placeholder="Provide a detailed overview of the product specifications, features, and benefits..."
              className={`w-full px-3.5 py-2 rounded-xl border bg-slate-950 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 ${
                errors.description
                  ? "border-rose-500/60 focus:ring-rose-500"
                  : "border-slate-800 focus:border-indigo-500 focus:ring-indigo-500"
              }`}
            />
            {errors.description && (
              <p className="text-xs text-rose-400 mt-1">{errors.description}</p>
            )}
          </div>

          {/* Simulated API Note */}
          <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-[11px] text-indigo-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 shrink-0 text-indigo-400" />
            <span>
              Calls DummyJSON API and saves changes in local overlay so you can immediately see the update.
            </span>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl border border-slate-700 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              id="save-product-submit-button"
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{isEditMode ? "Save Changes" : "Create Product"}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
