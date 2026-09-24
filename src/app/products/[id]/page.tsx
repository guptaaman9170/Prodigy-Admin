"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import ProductFormModal from "@/components/products/ProductFormModal";
import { productService } from "@/services/productService";
import { useProductOverlay } from "@/context/ProductOverlayContext";
import { Product, ProductFormData } from "@/types/product";
import { formatCurrency } from "@/lib/utils";
import {
  ArrowLeft,
  Star,
  ShieldCheck,
  Copy,
  Check,
  Edit3,
  Share2,
  Loader2,
  AlertTriangle,
  QrCode,
  Box,
  Scale,
  Truck,
  RotateCcw,
  Package,
  MessageSquare,
} from "lucide-react";

function ProductDetailContent() {
  const params = useParams();
  const router = useRouter();
  const idParam = params?.id as string;
  const productId = parseInt(idParam, 10);

  const { applySingleProductOverlay, editProduct } = useProductOverlay();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"reviews" | "inventory" | "pricing" | "seo">("reviews");
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [copiedSku, setCopiedSku] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadProduct() {
      if (isNaN(productId) || productId <= 0) {
        setNotFound(true);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setNotFound(false);

      try {
        let serverProduct: Product | null = null;
        try {
          serverProduct = await productService.getProductById(productId);
        } catch {
          serverProduct = null;
        }

        const finalProduct = applySingleProductOverlay(serverProduct, productId);

        if (!finalProduct) {
          if (isMounted) setNotFound(true);
        } else {
          if (isMounted) {
            setProduct(finalProduct);
            setSelectedImage(
              finalProduct.images?.[0] || finalProduct.thumbnail || ""
            );
          }
        }
      } catch {
        if (isMounted) setNotFound(true);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadProduct();

    return () => {
      isMounted = false;
    };
  }, [productId, applySingleProductOverlay]);

  const handleCopySku = () => {
    if (!product) return;
    navigator.clipboard.writeText(product.sku || `SKU-${product.id}`);
    setCopiedSku(true);
    setTimeout(() => setCopiedSku(false), 2000);
  };

  const handleEditSubmit = async (formData: ProductFormData) => {
    if (!product) return;
    const updated = await editProduct(product.id, formData);
    setProduct(updated);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <span className="text-xs font-semibold text-slate-500">
            Loading product specifications...
          </span>
        </div>
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="pro-card p-8 text-center max-w-md w-full shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500 mx-auto mb-4">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">Product Not Found</h1>
          <p className="mt-2 text-xs text-slate-500 leading-relaxed">
            The product you requested (ID: #{idParam}) does not exist in the active catalog or was deleted.
          </p>
          <div className="mt-6">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Products</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : [product.thumbnail];
  const discountPercentage = product.discountPercentage ? Math.round(product.discountPercentage) : 0;
  const comparePrice = discountPercentage > 0
    ? Number((product.price / (1 - discountPercentage / 100)).toFixed(2))
    : Number((product.price * 1.15).toFixed(2));
  const discountAmount = Math.max(0, comparePrice - product.price);

  // Dynamic reviews metrics
  const reviews = product.reviews || [];
  const totalReviewsCount = reviews.length;

  const ratingCounts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r) => {
    const rounded = Math.min(5, Math.max(1, Math.round(r.rating)));
    ratingCounts[rounded] = (ratingCounts[rounded] || 0) + 1;
  });

  const getPercentage = (count: number) => {
    if (totalReviewsCount === 0) return 0;
    return Math.round((count / totalReviewsCount) * 100);
  };

  const positiveReviews = reviews.filter((r) => r.rating >= 3).length;
  const recommendationPercentage = totalReviewsCount > 0
    ? Math.round((positiveReviews / totalReviewsCount) * 100)
    : Math.min(100, Math.round((product.rating / 5) * 100));

  const averageRating = totalReviewsCount > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviewsCount).toFixed(1)
    : product.rating.toFixed(1);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeTab="products"
      />

      {/* Main Container */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <Header
          onOpenSidebar={() => setSidebarOpen(true)}
          breadcrumbs={[
            { label: "PulseStack", href: "/products" },
            { label: "Store Catalog", href: "/products" },
            { label: product.category, href: `/products?category=${product.category}` },
            { label: product.title },
          ]}
        />

        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Top Navigation & Action Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-wrap">
              <button
                type="button"
                onClick={() => router.push("/products")}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Products</span>
              </button>

              <span className="text-slate-300">/</span>

              <span className="text-xs font-semibold text-slate-500 capitalize">
                {product.category}
              </span>

              <span className="text-slate-300">/</span>

              <span className="text-xs font-bold text-slate-800 truncate max-w-xs">
                {product.title}
              </span>

              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold border ${
                product.stock > 0
                  ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                  : "bg-rose-50 text-rose-700 border-rose-100"
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${product.stock > 0 ? "bg-emerald-600" : "bg-rose-600"}`} />
                {product.availabilityStatus || (product.stock > 0 ? "In Stock" : "Out of Stock")}
              </span>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Product URL copied to clipboard!");
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm"
              >
                <Share2 className="w-3.5 h-3.5 text-slate-500" />
                <span>Share Preview</span>
              </button>

              <button
                type="button"
                onClick={() => setIsEditModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white shadow-sm shadow-blue-500/20"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Product</span>
              </button>
            </div>
          </div>

          {/* Product Overview Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column (5 cols): Media Gallery + Warranty */}
            <div className="lg:col-span-5 space-y-4">
              {/* Main Image Card */}
              <div className="pro-card p-6 relative group overflow-hidden bg-white flex flex-col items-center justify-center">
                {/* Dynamic Badges in Image */}
                <div className="absolute top-4 left-4 flex gap-1.5 flex-wrap">
                  <span className="px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-sm text-[10px] font-bold text-white tracking-wider uppercase">
                    {product.brand ? product.brand.toUpperCase() : "ORIGINAL"}
                  </span>
                  <span className={`px-2 py-0.5 rounded-md backdrop-blur-sm text-[10px] font-bold text-white tracking-wider uppercase ${
                    product.stock > 0 ? "bg-emerald-600/90" : "bg-rose-600/90"
                  }`}>
                    {product.availabilityStatus ? product.availabilityStatus.toUpperCase() : (product.stock > 0 ? "IN STOCK" : "OUT OF STOCK")}
                  </span>
                  {discountPercentage > 0 && (
                    <span className="px-2 py-0.5 rounded-md bg-blue-600/90 backdrop-blur-sm text-[10px] font-bold text-white tracking-wider uppercase">
                      -{discountPercentage}% OFF
                    </span>
                  )}
                </div>

                {/* Main Image */}
                <div className="w-full aspect-square flex items-center justify-center max-h-80">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedImage}
                    alt={product.title}
                    className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* Bottom Overlay in image */}
                <div className="w-full flex items-center justify-between text-[11px] font-semibold text-slate-400 pt-3 border-t border-slate-100 mt-2">
                  <span className="truncate max-w-[200px]">
                    {product.tags && product.tags.length > 0
                      ? product.tags.map((t) => `#${t}`).join(" ")
                      : product.brand
                      ? `Brand: ${product.brand}`
                      : `Catalog ID: #${product.id}`}
                  </span>
                  <span className="text-blue-600 font-bold">
                    {images.length > 1 ? `${images.length} High-Res Views` : "Verified Asset"}
                  </span>
                </div>
              </div>

              {/* Thumbnails Row */}
              {images.length > 1 && (
                <div className="flex gap-2.5 overflow-x-auto pb-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImage(img)}
                      className={`w-18 h-18 rounded-xl border p-1 bg-white shrink-0 overflow-hidden transition-all ${
                        selectedImage === img
                          ? "border-blue-600 ring-2 ring-blue-500/20"
                          : "border-slate-200 opacity-60 hover:opacity-100"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-contain rounded-lg"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Manufacturer Warranty Card */}
              <div className="pro-card p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800">
                      Manufacturer Warranty
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {product.warrantyInformation || "Standard 1-Year Limited Warranty"}
                    </div>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                  Active
                </span>
              </div>
            </div>

            {/* Right Column (7 cols): Information, Pricing, Dynamic Specs */}
            <div className="lg:col-span-7 space-y-6">
              {/* Product Header Card */}
              <div className="pro-card p-6 space-y-5">
                {/* Badges */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 capitalize border border-blue-100">
                    {product.category}
                  </span>
                  {product.brand && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                      {product.brand}
                    </span>
                  )}
                  <span className="text-xs font-mono text-slate-400">
                    ID: #{product.id}
                  </span>
                </div>

                {/* Big Title */}
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {product.title}
                </h1>

                {/* SKU & Ratings line */}
                <div className="flex items-center gap-4 flex-wrap text-xs text-slate-500">
                  <div className="flex items-center gap-1.5 font-mono">
                    <span>SKU: {product.sku || `SKU-${product.category.substring(0, 3).toUpperCase()}-${product.id}`}</span>
                    <button
                      type="button"
                      onClick={handleCopySku}
                      className="p-1 hover:text-slate-800 transition-colors"
                      title="Copy SKU"
                    >
                      {copiedSku ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  <span>•</span>

                  <div className="flex items-center gap-1 text-slate-700 font-semibold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{product.rating.toFixed(1)}</span>
                    <span className="text-slate-400 font-normal">
                      ({totalReviewsCount} {totalReviewsCount === 1 ? "review" : "reviews"})
                    </span>
                  </div>

                  <span>•</span>

                  <span className="font-semibold text-emerald-600">
                    {recommendationPercentage}% Recommend
                  </span>
                </div>

                {/* Price Display */}
                <div className="pt-2 border-t border-slate-100 flex items-baseline gap-3 flex-wrap">
                  <span className="text-4xl font-black text-slate-900 tracking-tight">
                    {formatCurrency(product.price)}
                  </span>
                  {discountAmount > 0 && (
                    <>
                      <span className="text-base text-slate-400 line-through">
                        {formatCurrency(comparePrice)}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-blue-50 text-blue-600 border border-blue-100">
                        Save {formatCurrency(discountAmount)} ({discountPercentage}% off)
                      </span>
                    </>
                  )}
                  <span className="text-xs text-slate-400 font-medium">
                    MSRP: {formatCurrency(comparePrice)} USD
                  </span>
                </div>

                {/* Stock Availability Box */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-700">Stock Availability</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-md border shadow-2xs ${
                        product.stock > 10
                          ? "bg-white text-blue-600 border-slate-200"
                          : product.stock > 0
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-rose-50 text-rose-700 border-rose-200"
                      }`}>
                        {product.stock} units
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500">
                        ({product.availabilityStatus || (product.stock > 0 ? "In Stock" : "Out of Stock")})
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      {product.shippingInformation || "Standard ground delivery across regional hubs."}
                    </p>
                    <div className="text-[10px] text-slate-400 mt-2">
                      Minimum Order (MOQ): <strong className="text-slate-700">{product.minimumOrderQuantity || 1} units</strong> •{" "}
                      Return Window: <strong className="text-slate-700">{product.returnPolicy || "30-day return policy"}</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 p-2.5 bg-white rounded-xl border border-slate-200 shrink-0">
                    <QrCode className="w-8 h-8 text-slate-800" />
                    <div className="text-[10px] font-mono leading-tight">
                      <div className="font-bold text-slate-700">SCANNABLE BARCODE</div>
                      <div className="text-slate-500 font-semibold">{product.meta?.barcode || product.sku || `085${product.id}29314`}</div>
                      <div className="text-slate-400">EAN / UPC / QR Compliant</div>
                    </div>
                  </div>
                </div>

                {/* Product Description */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Product Description
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {product.description}
                  </p>
                </div>

                {/* DYNAMIC PRODUCT SPECIFICATIONS */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                    Specifications &amp; Logistics
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
                    {/* Dimensions */}
                    {product.dimensions && (
                      <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                        <Box className="w-4 h-4 text-blue-600 shrink-0" />
                        <div className="min-w-0">
                          <div className="text-[10px] uppercase font-bold text-slate-400">Dimensions</div>
                          <div className="font-semibold text-slate-800 truncate">
                            {product.dimensions.width} × {product.dimensions.height} × {product.dimensions.depth} cm
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Weight */}
                    {product.weight !== undefined && (
                      <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                        <Scale className="w-4 h-4 text-blue-600 shrink-0" />
                        <div className="min-w-0">
                          <div className="text-[10px] uppercase font-bold text-slate-400">Weight</div>
                          <div className="font-semibold text-slate-800 truncate">
                            {product.weight} {product.weight > 50 ? "g" : "kg"}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Shipping Info */}
                    <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                      <Truck className="w-4 h-4 text-blue-600 shrink-0" />
                      <div className="min-w-0">
                        <div className="text-[10px] uppercase font-bold text-slate-400">Shipping</div>
                        <div className="font-semibold text-slate-800 truncate">
                          {product.shippingInformation || "Ships in 3-5 business days"}
                        </div>
                      </div>
                    </div>

                    {/* Return Policy */}
                    <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                      <RotateCcw className="w-4 h-4 text-blue-600 shrink-0" />
                      <div className="min-w-0">
                        <div className="text-[10px] uppercase font-bold text-slate-400">Return Policy</div>
                        <div className="font-semibold text-slate-800 truncate">
                          {product.returnPolicy || "30 days return policy"}
                        </div>
                      </div>
                    </div>

                    {/* Minimum Order Quantity */}
                    <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                      <Package className="w-4 h-4 text-blue-600 shrink-0" />
                      <div className="min-w-0">
                        <div className="text-[10px] uppercase font-bold text-slate-400">Min. Order (MOQ)</div>
                        <div className="font-semibold text-slate-800 truncate">
                          {product.minimumOrderQuantity || 1} units
                        </div>
                      </div>
                    </div>

                    {/* Warranty */}
                    <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                      <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                      <div className="min-w-0">
                        <div className="text-[10px] uppercase font-bold text-slate-400">Warranty</div>
                        <div className="font-semibold text-slate-800 truncate">
                          {product.warrantyInformation || "Standard Warranty"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Tabs Section */}
          <div className="pro-card overflow-hidden">
            {/* Tabs Header */}
            <div className="flex items-center justify-between px-6 border-b border-slate-200/80 bg-white overflow-x-auto">
              <div className="flex gap-8 shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveTab("reviews")}
                  className={`py-4 text-xs font-bold border-b-2 transition-all ${
                    activeTab === "reviews"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-slate-500 hover:text-slate-900"
                  }`}
                >
                  Customer Reviews ({totalReviewsCount})
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("inventory")}
                  className={`py-4 text-xs font-bold border-b-2 transition-all ${
                    activeTab === "inventory"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-slate-500 hover:text-slate-900"
                  }`}
                >
                  Inventory Log &amp; History
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("pricing")}
                  className={`py-4 text-xs font-bold border-b-2 transition-all ${
                    activeTab === "pricing"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-slate-500 hover:text-slate-900"
                  }`}
                >
                  Pricing &amp; Discounts
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("seo")}
                  className={`py-4 text-xs font-bold border-b-2 transition-all ${
                    activeTab === "seo"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-slate-500 hover:text-slate-900"
                  }`}
                >
                  SEO &amp; Metadata
                </button>
              </div>

              <div className="text-[11px] text-slate-400 hidden sm:block shrink-0">
                Live Data Synchronized
              </div>
            </div>

            {/* Tab 1: Customer Reviews Content */}
            {activeTab === "reviews" && (
              <div className="p-6 space-y-6">
                {/* Score Breakdown Banner */}
                <div className="p-6 rounded-2xl bg-slate-50/70 border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  {/* Left: Score & CSAT */}
                  <div className="flex flex-col items-center justify-center text-center md:border-r md:border-slate-200 md:pr-8">
                    <span className="text-4xl font-black text-slate-900">{averageRating}</span>
                    <div className="flex text-amber-400 gap-1 my-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.round(Number(averageRating))
                              ? "fill-amber-400 text-amber-400"
                              : "text-slate-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-slate-700">
                      Based on {totalReviewsCount} {totalReviewsCount === 1 ? "rating" : "ratings"}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {recommendationPercentage}% Customer Satisfaction (CSAT)
                    </span>
                  </div>

                  {/* Middle: Rating Distribution Bars */}
                  <div className="flex-1 space-y-1.5 max-w-md">
                    {[5, 4, 3, 2, 1].map((stars) => {
                      const count = ratingCounts[stars] || 0;
                      const pct = getPercentage(count);
                      return (
                        <div key={stars} className="flex items-center gap-3 text-xs">
                          <span className="text-slate-500 w-12">{stars} star</span>
                          <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-600 rounded-full transition-all duration-300"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-slate-600 font-bold w-12 text-right">
                            {count} ({pct}%)
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Reviews List */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-slate-900 text-sm">
                      Customer Reviews ({totalReviewsCount})
                    </h3>
                  </div>

                  {reviews.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {reviews.map((rev, idx) => {
                        const initials = rev.reviewerName
                          ? rev.reviewerName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .substring(0, 2)
                              .toUpperCase()
                          : "U";

                        const reviewDate = rev.date
                          ? new Date(rev.date).toLocaleDateString(undefined, {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : "Verified Purchase";

                        return (
                          <div key={idx} className="pro-card p-4 space-y-3">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                                  {initials}
                                </div>
                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-bold text-xs text-slate-900">
                                      {rev.reviewerName}
                                    </span>
                                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 rounded border border-emerald-100 uppercase">
                                      VERIFIED BUYER
                                    </span>
                                  </div>
                                  <div className="text-[10px] text-slate-400">
                                    {rev.reviewerEmail}
                                  </div>
                                </div>
                              </div>
                              <span className="text-[11px] text-slate-400">{reviewDate}</span>
                            </div>

                            <div className="flex text-amber-400 gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3.5 h-3.5 ${
                                    i < rev.rating
                                      ? "fill-amber-400 text-amber-400"
                                      : "text-slate-200"
                                  }`}
                                />
                              ))}
                            </div>

                            <p className="text-xs text-slate-600 leading-relaxed italic">
                              &ldquo;{rev.comment}&rdquo;
                            </p>

                            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                              <span>Product: {product.title}</span>
                              <span className="font-medium text-slate-600">Helpful review</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-8 text-center rounded-2xl bg-slate-50 border border-slate-200">
                      <MessageSquare className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <div className="text-xs font-bold text-slate-700">No customer reviews yet</div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Be the first to review this {product.category} product!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab 2: Inventory Log */}
            {activeTab === "inventory" && (
              <div className="p-6 text-xs text-slate-600 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-sm">Fulfillment &amp; Restock History</h4>
                  <span className="text-slate-400 font-mono text-[11px]">
                    SKU: {product.sku || product.id}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="font-bold text-slate-800">Primary Warehouse Bay</div>
                    <div className="text-slate-500 mt-1">
                      Available Stock: <strong className="text-slate-900">{product.stock} units</strong>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      Availability Status: {product.availabilityStatus || "Optimal Stock"}
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="font-bold text-slate-800">Procurement &amp; Batch Policy</div>
                    <div className="text-slate-500 mt-1">
                      Minimum Order Quantity: <strong className="text-slate-900">{product.minimumOrderQuantity || 1} units</strong>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      Carrier: {product.shippingInformation || "Standard ground delivery"}
                    </div>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-blue-50/50 border border-blue-100 text-blue-800 text-[11px]">
                  Last inventory sync verified via automated warehouse barcode scanning. Threshold: 25 units.
                </div>
              </div>
            )}

            {/* Tab 3: Pricing */}
            {activeTab === "pricing" && (
              <div className="p-6 text-xs text-slate-600 space-y-4">
                <h4 className="font-bold text-slate-900 text-sm">Tiered Pricing &amp; B2B Wholesale</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="text-slate-400 text-[11px] font-semibold">Standard Unit Price</div>
                    <div className="text-lg font-bold text-slate-900 mt-1">{formatCurrency(product.price)}</div>
                    <div className="text-[11px] text-slate-500 mt-1">Individual consumer MSRP tier</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-blue-50/50 border border-blue-200">
                    <div className="text-blue-600 text-[11px] font-semibold">Tier 1 Wholesale (10+ units)</div>
                    <div className="text-lg font-bold text-blue-900 mt-1">{formatCurrency(product.price * 0.9)}</div>
                    <div className="text-[11px] text-blue-700 mt-1">10% bulk discount applied</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-indigo-50/50 border border-indigo-200">
                    <div className="text-indigo-600 text-[11px] font-semibold">Enterprise Bulk (50+ units)</div>
                    <div className="text-lg font-bold text-indigo-900 mt-1">{formatCurrency(product.price * 0.82)}</div>
                    <div className="text-[11px] text-indigo-700 mt-1">18% wholesale contract rate</div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: SEO */}
            {activeTab === "seo" && (
              <div className="p-6 text-xs text-slate-600 space-y-3 font-mono">
                <h4 className="font-bold text-slate-900 text-sm font-sans">Search Engine Metadata &amp; Tracking</h4>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-[11px]">
                  <div><span className="text-slate-400">Canonical Path:</span> /products/{product.id}</div>
                  <div><span className="text-slate-400">Meta Title:</span> {product.title} | PulseStack Catalog</div>
                  <div><span className="text-slate-400">Category Tag:</span> {product.category}</div>
                  <div><span className="text-slate-400">Barcode / GTIN:</span> {product.meta?.barcode || "N/A"}</div>
                  <div><span className="text-slate-400">QR Code Link:</span> {product.meta?.qrCode || "Generated on demand"}</div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Edit Modal if triggered from header */}
      <ProductFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditSubmit}
        initialProduct={product}
        categories={[{ slug: product.category, name: product.category }]}
      />
    </div>
  );
}

export default function ProductDetailPage() {
  return (
    <ProtectedRoute>
      <ProductDetailContent />
    </ProtectedRoute>
  );
}

