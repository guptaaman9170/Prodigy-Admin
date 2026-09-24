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
  Copy as DuplicateIcon,
  Loader2,
  AlertTriangle,
  QrCode,
  Bluetooth,
  BatteryCharging,
  Headphones,
  Compass,
  Zap,
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
  const comparePrice = Math.round(product.price * 1.15);
  const discountAmount = Math.max(0, comparePrice - product.price);

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

              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                {product.stock > 0 ? "In Stock" : "Out of Stock"}
              </span>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm"
              >
                <DuplicateIcon className="w-3.5 h-3.5 text-slate-500" />
                <span>Duplicate</span>
              </button>

              <button
                type="button"
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

          {/* Product Overview Grid (Matching Image 3) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column (5 cols): Media Gallery + Warranty */}
            <div className="lg:col-span-5 space-y-4">
              {/* Main Image Card */}
              <div className="pro-card p-6 relative group overflow-hidden bg-white flex flex-col items-center justify-center">
                {/* Badges in Image */}
                <div className="absolute top-4 left-4 flex gap-1.5">
                  <span className="px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-sm text-[10px] font-bold text-white tracking-wider uppercase">
                    HIGH-RES
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-blue-600/90 backdrop-blur-sm text-[10px] font-bold text-white tracking-wider uppercase">
                    ANC 2.0
                  </span>
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
                  <span>Color: Matte Obsidian</span>
                  <span className="text-blue-600 font-bold">360° View Ready</span>
                </div>
              </div>

              {/* Thumbnails Row */}
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
                      {product.warrantyInformation || "2-Year Worldwide Advanced Replacement"}
                    </div>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                  Active
                </span>
              </div>
            </div>

            {/* Right Column (7 cols): Information, Pricing, Specs */}
            <div className="lg:col-span-7 space-y-6">
              {/* Product Header Card */}
              <div className="pro-card p-6 space-y-5">
                {/* Badges */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 capitalize border border-blue-100">
                    Premium {product.category}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                    Featured Item
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    ID: 994-PST
                  </span>
                </div>

                {/* Big Title */}
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {product.title}
                </h1>

                {/* SKU & Ratings line */}
                <div className="flex items-center gap-4 flex-wrap text-xs text-slate-500">
                  <div className="flex items-center gap-1.5 font-mono">
                    <span>SKU: {product.sku || "SKU-HDPH-9021"}</span>
                    <button
                      type="button"
                      onClick={handleCopySku}
                      className="p-1 hover:text-slate-800"
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
                      ({product.reviews?.length || 428} reviews)
                    </span>
                  </div>

                  <span>•</span>

                  <span className="font-semibold text-emerald-600">
                    96% Recommend
                  </span>
                </div>

                {/* Price Display */}
                <div className="pt-2 border-t border-slate-100 flex items-baseline gap-3 flex-wrap">
                  <span className="text-4xl font-black text-slate-900 tracking-tight">
                    {formatCurrency(product.price)}
                  </span>
                  <span className="text-base text-slate-400 line-through">
                    {formatCurrency(comparePrice)}
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-blue-50 text-blue-600 border border-blue-100">
                    Save {formatCurrency(discountAmount)} (12% off)
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    MSRP: {formatCurrency(comparePrice)} USD
                  </span>
                </div>

                {/* Stock Availability Box */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-700">Stock Availability</span>
                      <span className="text-xs font-bold text-blue-600 bg-white px-2 py-0.5 rounded-md border border-slate-200 shadow-2xs">
                        {product.stock} units
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Allocated across Austin ({Math.floor(product.stock * 0.6)}) &amp; Frankfurt ({Math.floor(product.stock * 0.4)}) hubs.
                    </p>
                    <div className="text-[10px] text-slate-400 mt-2">
                      Threshold: 25 units • <span className="text-emerald-600 font-bold">Status: Optimal</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2 bg-white rounded-xl border border-slate-200 shrink-0">
                    <QrCode className="w-8 h-8 text-slate-800" />
                    <div className="text-[10px] font-mono leading-tight">
                      <div className="font-bold text-slate-700">SCANNABLE BARCODE</div>
                      <div className="text-slate-400">085002931481</div>
                      <div className="text-slate-400">EAN / UPC Compliant</div>
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

                {/* Engineered Specifications Chips */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                    Engineered Specifications
                  </h3>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 font-semibold border border-blue-100">
                      <Bluetooth className="w-3.5 h-3.5" />
                      <span>Bluetooth 5.3 - LE Audio</span>
                    </span>

                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 font-semibold border border-blue-100">
                      <BatteryCharging className="w-3.5 h-3.5" />
                      <span>40h ANC / 60h Passive</span>
                    </span>

                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 font-semibold border border-blue-100">
                      <Headphones className="w-3.5 h-3.5" />
                      <span>Hybrid Active ANC (-42dB)</span>
                    </span>

                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 font-semibold border border-blue-100">
                      <Compass className="w-3.5 h-3.5" />
                      <span>Spatial Head Tracking</span>
                    </span>

                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 font-semibold border border-blue-100">
                      <Zap className="w-3.5 h-3.5" />
                      <span>15m Quick Charge = 6h Play</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Tabs Section (Matching Image 3) */}
          <div className="pro-card overflow-hidden">
            {/* Tabs Header */}
            <div className="flex items-center justify-between px-6 border-b border-slate-200/80 bg-white">
              <div className="flex gap-8">
                <button
                  type="button"
                  onClick={() => setActiveTab("reviews")}
                  className={`py-4 text-xs font-bold border-b-2 transition-all ${
                    activeTab === "reviews"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-slate-500 hover:text-slate-900"
                  }`}
                >
                  Customer Reviews ({product.reviews?.length || 428})
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

              <div className="text-[11px] text-slate-400 hidden sm:block">
                Last synced: 4 mins ago
              </div>
            </div>

            {/* Tab 1: Customer Reviews Content */}
            {activeTab === "reviews" && (
              <div className="p-6 space-y-6">
                {/* Score Breakdown Banner */}
                <div className="p-6 rounded-2xl bg-slate-50/70 border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  {/* Left: Big Score & CSAT */}
                  <div className="flex flex-col items-center justify-center text-center md:border-r md:border-slate-200 md:pr-8">
                    <span className="text-4xl font-black text-slate-900">4.9</span>
                    <div className="flex text-amber-400 gap-1 my-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-slate-700">Based on 428 ratings</span>
                    <span className="text-[11px] text-slate-400">98.4% CSAT Satisfaction Score</span>
                  </div>

                  {/* Middle: Rating Distribution Bars */}
                  <div className="flex-1 space-y-1.5 max-w-md">
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-slate-500 w-10">5 star</span>
                      <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 rounded-full w-[82%]" />
                      </div>
                      <span className="text-slate-600 font-bold w-8 text-right">82%</span>
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-slate-500 w-10">4 star</span>
                      <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 rounded-full w-[12%]" />
                      </div>
                      <span className="text-slate-600 font-bold w-8 text-right">12%</span>
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-slate-500 w-10">3 star</span>
                      <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 rounded-full w-[4%]" />
                      </div>
                      <span className="text-slate-600 font-bold w-8 text-right">4%</span>
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-slate-500 w-10">2 star</span>
                      <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 rounded-full w-[1%]" />
                      </div>
                      <span className="text-slate-600 font-bold w-8 text-right">1%</span>
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-slate-500 w-10">1 star</span>
                      <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 rounded-full w-[1%]" />
                      </div>
                      <span className="text-slate-600 font-bold w-8 text-right">1%</span>
                    </div>
                  </div>
                </div>

                {/* Featured Reviews List */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-slate-900 text-sm">Featured Reviews</h3>
                    <div className="text-xs text-slate-500">
                      Sort by: <strong className="text-slate-800">Highest Rated</strong>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Review Card 1 */}
                    <div className="pro-card p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                            MV
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-xs text-slate-900">Marcus Vance</span>
                              <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 rounded border border-blue-100 uppercase">
                                VERIFIED BUYER
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-400">
                              Senior Sound Designer, Apex Audio
                            </div>
                          </div>
                        </div>
                        <span className="text-[11px] text-slate-400">2 days ago</span>
                      </div>

                      <div className="flex text-amber-400 gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed italic">
                        &ldquo;Best headphones I have ever used in the studio for cross-checking masters. Frequency separation across the 100Hz-250Hz lower-midrange is shockingly clean.&rdquo;
                      </p>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                        <span>Purchased: Obsidian Black / Batch 04</span>
                        <span className="font-medium text-slate-600">38 people found this helpful</span>
                      </div>
                    </div>

                    {/* Review Card 2 */}
                    <div className="pro-card p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">
                            ER
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-xs text-slate-900">Elena Rostova</span>
                              <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 rounded border border-blue-100 uppercase">
                                VERIFIED BUYER
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-400">
                              Podcast Host &amp; Remote Architect
                            </div>
                          </div>
                        </div>
                        <span className="text-[11px] text-slate-400">1 week ago</span>
                      </div>

                      <div className="flex text-amber-400 gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed italic">
                        &ldquo;The active noise cancellation completely silences mechanical keyboard clicks and HVAC rumble during recording. Multi-device Bluetooth 5.3 switching swaps seamlessly.&rdquo;
                      </p>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                        <span>Purchased: Obsidian Black / Batch 02</span>
                        <span className="font-medium text-slate-600">24 people found this helpful</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-center mt-6">
                    <button
                      type="button"
                      className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-sm"
                    >
                      View All 428 Verified Customer Reviews
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Inventory Log */}
            {activeTab === "inventory" && (
              <div className="p-6 text-xs text-slate-600 space-y-3">
                <div className="font-bold text-slate-900 text-sm">Fulfillment &amp; Restock History</div>
                <p>Austin Hub: 52 units in warehouse bay A-14. Frankfurt Hub: 32 units in bay F-02.</p>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  Last stock shipment #SHP-9812 verified and scanned by Austin inventory team on May 24.
                </div>
              </div>
            )}

            {/* Tab 3: Pricing */}
            {activeTab === "pricing" && (
              <div className="p-6 text-xs text-slate-600 space-y-3">
                <div className="font-bold text-slate-900 text-sm">Tiered Pricing &amp; B2B Wholesale</div>
                <p>Standard unit price: {formatCurrency(product.price)}. Wholesale discount tier available for orders &gt; 50 units (18% discount applied at checkout).</p>
              </div>
            )}

            {/* Tab 4: SEO */}
            {activeTab === "seo" && (
              <div className="p-6 text-xs text-slate-600 space-y-3">
                <div className="font-bold text-slate-900 text-sm">Search Engine Metadata</div>
                <div className="font-mono text-[11px] text-slate-500">
                  Slug: /products/{product.id} • Meta Title: {product.title} - Official PulseStack Store
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
