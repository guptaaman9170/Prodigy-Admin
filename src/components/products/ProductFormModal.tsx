"use client";

import React, { useState, useEffect } from "react";
import { Product, ProductFormData, CategoryItem } from "@/types/product";
import {
  X,
  Loader2,
  Trash2,
  AlertTriangle,
  ArrowLeft,
  Bold,
  Italic,
  Underline,
  List,
  Link as LinkIcon,
  Code,
} from "lucide-react";

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProductFormData) => Promise<void>;
  onDeleteRequest?: (product: Product) => void;
  initialProduct?: Product | null;
  categories: CategoryItem[];
}

export default function ProductFormModal({
  isOpen,
  onClose,
  onSubmit,
  onDeleteRequest,
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
    thumbnail: "",
  });

  const [visibility, setVisibility] = useState<"published" | "draft" | "archived">("published");
  const [sku, setSku] = useState("");
  const [barcode, setBarcode] = useState("0849204918239");
  const [comparePrice, setComparePrice] = useState(0);
  const [costPerItem, setCostPerItem] = useState(0);
  const [lowStockThreshold, setLowStockThreshold] = useState(5);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

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
        thumbnail: initialProduct.thumbnail || "",
      });
      setSku(initialProduct.sku || `MON-${initialProduct.id}X`);
      setComparePrice(Math.round((initialProduct.price || 50) * 1.25));
      setCostPerItem(Math.round((initialProduct.price || 50) * 0.6));
    } else {
      setFormData({
        title: "",
        description: "",
        category: categories[0]?.slug || "beauty",
        price: 99.99,
        stock: 25,
        brand: "PulseTech",
        discountPercentage: 10,
        thumbnail: "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp",
      });
      setSku(`PRD-${Math.floor(1000 + Math.random() * 9000)}`);
      setComparePrice(129.99);
      setCostPerItem(55.0);
    }
    setErrors({});
    setSubmitError(null);
  }, [initialProduct, categories, isOpen]);

  if (!isOpen) return null;

  const handleGenerateSku = () => {
    const random = Math.floor(1000 + Math.random() * 9000);
    setSku(`SKU-${random}`);
  };

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-5xl bg-slate-50 border border-slate-200 rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden my-auto">
        {/* Header Bar */}
        <div className="bg-white border-b border-slate-200/80 px-6 py-4 flex items-center justify-between shrink-0">
          <div>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Products</span>
            </button>
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                {isEditMode ? `Edit Product: ${formData.title || "Item"}` : "Create New Product"}
              </h2>
              {sku && (
                <span className="text-xs font-mono font-semibold text-slate-500 px-2 py-0.5 rounded bg-slate-100">
                  SKU: {sku}
                </span>
              )}
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                Active Storefront
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Configure product specifications, pricing, inventory controls, and storefront visibility.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body: 2 Columns */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {submitError && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column (8 cols): Form Sections */}
            <div className="lg:col-span-8 space-y-6">
              {/* Section 01: General Information */}
              <div className="pro-card p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-600" />
                    <h3 className="font-bold text-slate-900 text-sm">General Information</h3>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Section 01
                  </span>
                </div>

                {/* Title */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-slate-700">Product Title</label>
                    <span className="text-[11px] text-slate-400">
                      {formData.title.length} / 80 characters
                    </span>
                  </div>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => {
                      setFormData({ ...formData, title: e.target.value });
                      if (errors.title) setErrors({ ...errors, title: "" });
                    }}
                    placeholder="e.g. Ultra-Slim 4K Monitor 32'' IPS LED"
                    className={`w-full px-3.5 py-2.5 rounded-xl border bg-white text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${
                      errors.title ? "border-rose-400" : "border-slate-200"
                    }`}
                  />
                  {errors.title && <p className="text-xs text-rose-600 mt-1">{errors.title}</p>}
                  <p className="text-[11px] text-slate-400 mt-1">
                    A succinct and descriptive title tailored for high search placement.
                  </p>
                </div>

                {/* SKU & Category Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      SKU (Stock Keeping Unit)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={sku}
                        onChange={(e) => setSku(e.target.value)}
                        className="flex-1 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-mono text-slate-800 focus:outline-none focus:border-blue-500"
                      />
                      <button
                        type="button"
                        onClick={handleGenerateSku}
                        className="px-2.5 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-[11px] font-semibold text-slate-600 transition-colors"
                      >
                        Generate
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => {
                        setFormData({ ...formData, category: e.target.value });
                        if (errors.category) setErrors({ ...errors, category: "" });
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500 capitalize cursor-pointer"
                    >
                      {categories.map((c) => (
                        <option key={c.slug} value={c.slug} className="capitalize">
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Brand Name & Barcode */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Brand Name
                    </label>
                    <input
                      type="text"
                      value={formData.brand || ""}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      placeholder="e.g. AuraVision Visuals"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Barcode / EAN
                    </label>
                    <input
                      type="text"
                      value={barcode}
                      onChange={(e) => setBarcode(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-mono text-slate-800 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Section 02: Media & Assets */}
              <div className="pro-card p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-600" />
                    <h3 className="font-bold text-slate-900 text-sm">Media &amp; Assets</h3>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Section 02
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Primary Image URL
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.thumbnail || ""}
                      onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                      placeholder="https://..."
                      className="flex-1 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-mono"
                    />
                    <button
                      type="button"
                      className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                    >
                      Fetch
                    </button>
                  </div>
                </div>

                {formData.thumbnail && (
                  <div className="w-32 h-32 rounded-xl border border-slate-200 bg-slate-100 p-2 overflow-hidden flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={formData.thumbnail}
                      alt="Product preview"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                )}
              </div>

              {/* Section 03: Pricing & Inventory */}
              <div className="pro-card p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-600" />
                    <h3 className="font-bold text-slate-900 text-sm">Pricing &amp; Inventory</h3>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Section 03
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Selling Price ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Compare-at Price ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={comparePrice}
                      onChange={(e) => setComparePrice(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 focus:outline-none focus:border-blue-500"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Shows strikethrough price tag
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Cost per Item ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={costPerItem}
                      onChange={(e) => setCostPerItem(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 focus:outline-none focus:border-blue-500"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Net profit: ${(formData.price - costPerItem).toFixed(2)}/unit
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Stock Quantity
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value, 10) || 0 })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Low Stock Threshold
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={lowStockThreshold}
                      onChange={(e) => setLowStockThreshold(parseInt(e.target.value, 10) || 5)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 focus:outline-none focus:border-blue-500"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Sends alert when inventory drops below this number
                    </span>
                  </div>
                </div>
              </div>

              {/* Section 04: Product Description */}
              <div className="pro-card p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-600" />
                    <h3 className="font-bold text-slate-900 text-sm">Product Description</h3>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Section 04
                  </span>
                </div>

                {/* Simulated Rich Text Toolbar */}
                <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200/80 w-fit">
                  <button type="button" className="p-1.5 rounded-lg hover:bg-white text-slate-600">
                    <Bold className="w-3.5 h-3.5" />
                  </button>
                  <button type="button" className="p-1.5 rounded-lg hover:bg-white text-slate-600">
                    <Italic className="w-3.5 h-3.5" />
                  </button>
                  <button type="button" className="p-1.5 rounded-lg hover:bg-white text-slate-600">
                    <Underline className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-px h-4 bg-slate-300 mx-1" />
                  <button type="button" className="p-1.5 rounded-lg hover:bg-white text-slate-600">
                    <List className="w-3.5 h-3.5" />
                  </button>
                  <button type="button" className="p-1.5 rounded-lg hover:bg-white text-slate-600">
                    <LinkIcon className="w-3.5 h-3.5" />
                  </button>
                  <button type="button" className="p-1.5 rounded-lg hover:bg-white text-slate-600">
                    <Code className="w-3.5 h-3.5" />
                  </button>
                </div>

                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => {
                    setFormData({ ...formData, description: e.target.value });
                    if (errors.description) setErrors({ ...errors, description: "" });
                  }}
                  placeholder="Craft an engaging marketing summary with formatted rich copy..."
                  className={`w-full px-3.5 py-2.5 rounded-xl border bg-white text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${
                    errors.description ? "border-rose-400" : "border-slate-200"
                  }`}
                />
                {errors.description && <p className="text-xs text-rose-600 mt-1">{errors.description}</p>}
              </div>
            </div>

            {/* Right Column (4 cols): Side Widgets */}
            <div className="lg:col-span-4 space-y-6">
              {/* Storefront Visibility Widget */}
              <div className="pro-card p-5 space-y-3">
                <h3 className="font-bold text-slate-900 text-sm">Storefront Visibility</h3>
                <p className="text-[11px] text-slate-400">
                  Control where and how this item appears to shoppers.
                </p>

                <div className="space-y-2 pt-2">
                  <label className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-slate-50 cursor-pointer">
                    <input
                      type="radio"
                      name="visibility"
                      checked={visibility === "published"}
                      onChange={() => setVisibility("published")}
                      className="mt-0.5 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-800">Published / Active</div>
                      <div className="text-[11px] text-slate-500">Live in customer catalog &amp; indexable</div>
                    </div>
                  </label>

                  <label className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-slate-50 cursor-pointer">
                    <input
                      type="radio"
                      name="visibility"
                      checked={visibility === "draft"}
                      onChange={() => setVisibility("draft")}
                      className="mt-0.5 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-800">Draft Mode</div>
                      <div className="text-[11px] text-slate-500">Hidden from search, visible only to admins</div>
                    </div>
                  </label>

                  <label className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-slate-50 cursor-pointer">
                    <input
                      type="radio"
                      name="visibility"
                      checked={visibility === "archived"}
                      onChange={() => setVisibility("archived")}
                      className="mt-0.5 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-800">Archived</div>
                      <div className="text-[11px] text-slate-500">Preserves order records but stops sales</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Inventory Snapshot Widget */}
              <div className="pro-card p-5 space-y-3">
                <h3 className="font-bold text-slate-900 text-sm">Inventory Snapshot</h3>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Available for Sale</span>
                    <span className="font-bold text-slate-800">{formData.stock} units</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Reserved / Pending</span>
                    <span className="font-bold text-slate-800">2 units</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Sales Velocity (30d)</span>
                    <span className="font-bold text-slate-800">43 sold</span>
                  </div>
                </div>

                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-3">
                  <div className="h-full bg-blue-600 rounded-full w-[78%]" />
                </div>
                <span className="text-[10px] text-slate-400">Stock level healthy (78% capacity)</span>
              </div>

              {/* Active Orders Pending Alert */}
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Active Orders Pending</span>
                </div>
                <p className="text-[11px] text-amber-700 leading-relaxed">
                  2 pending customer orders are linked to this SKU. Modifying or deleting will flag these shipments.
                </p>
              </div>
            </div>
          </div>

          {/* Sticky Bottom Actions Bar */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            {isEditMode && onDeleteRequest && initialProduct ? (
              <button
                type="button"
                onClick={() => onDeleteRequest(initialProduct)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Product</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                id="save-product-submit-button"
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white shadow-sm shadow-blue-500/20 transition-all disabled:opacity-50"
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
          </div>
        </form>
      </div>
    </div>
  );
}
