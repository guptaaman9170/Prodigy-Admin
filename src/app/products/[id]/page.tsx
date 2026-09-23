"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Navbar from "@/components/layout/Navbar";
import { productService } from "@/services/productService";
import { useProductOverlay } from "@/context/ProductOverlayContext";
import { Product } from "@/types/product";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  ArrowLeft,
  Star,
  Shield,
  Truck,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  Loader2,
  Calendar,
  User,
} from "lucide-react";

function ProductDetailContent() {
  const params = useParams();
  const router = useRouter();
  const idParam = params?.id as string;
  const productId = parseInt(idParam, 10);

  const { applySingleProductOverlay } = useProductOverlay();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

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
          // If server returns 404, serverProduct remains null
          serverProduct = null;
        }

        // Apply local simulation overlay (added/edited/deleted)
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          <span className="text-sm font-medium text-slate-400">
            Loading product details...
          </span>
        </div>
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md text-center p-8 rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mx-auto mb-4">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h1 className="text-xl font-bold text-white">Product Not Found</h1>
            <p className="mt-2 text-sm text-slate-400">
              The product you are looking for (ID: #{idParam}) does not exist, has been removed, or is invalid.
            </p>
            <div className="mt-6">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Product Catalog</span>
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 10;
  const images = product.images && product.images.length > 0 ? product.images : [product.thumbnail];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Breadcrumb & Back */}
        <div className="mb-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Products</span>
          </button>
        </div>

        {/* Product Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Left Column: Image Gallery (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Primary Featured Image */}
            <div className="w-full aspect-square rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden flex items-center justify-center p-4 relative group shadow-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedImage || product.thumbnail}
                alt={product.title}
                className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    "https://dummyjson.com/image/400x400?text=No+Preview";
                }}
              />
              {product.isLocal && (
                <div className="absolute top-4 left-4 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-indigo-500/10 border border-indigo-500/20 text-indigo-300">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Local Mock</span>
                </div>
              )}
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(img)}
                    className={`w-16 h-16 rounded-xl border overflow-hidden p-1 bg-slate-900 shrink-0 transition-all ${
                      selectedImage === img
                        ? "border-indigo-500 ring-2 ring-indigo-500/20"
                        : "border-slate-800 opacity-60 hover:opacity-100"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Information & Specs (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div>
              {/* Category & Brand Header */}
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700 capitalize">
                  {product.category}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {product.brand || "Generic"}
                </span>
                {product.sku && (
                  <span className="text-xs font-mono text-slate-500">
                    SKU: {product.sku}
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {product.title}
              </h1>

              {/* Rating and Reviews Count */}
              <div className="flex items-center gap-3 mt-3">
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{product.rating.toFixed(2)}</span>
                </div>
                <span className="text-xs text-slate-400">
                  {product.reviews?.length || 0} Customer Reviews
                </span>
              </div>

              {/* Price & Discount */}
              <div className="mt-5 flex items-baseline gap-3">
                <span className="text-3xl font-black text-white">
                  {formatCurrency(product.price)}
                </span>
                {product.discountPercentage && product.discountPercentage > 0 ? (
                  <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {product.discountPercentage}% OFF
                  </span>
                ) : null}
              </div>

              {/* Stock Status */}
              <div className="mt-4">
                {isOutOfStock ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    <span className="w-2 h-2 rounded-full bg-rose-400" />
                    Currently Out of Stock
                  </span>
                ) : isLowStock ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    Low Stock: Only {product.stock} units left
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    In Stock ({product.stock} units available)
                  </span>
                )}
              </div>

              {/* Description */}
              <div className="mt-6">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Description
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Metadata Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-slate-800">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/50 border border-slate-800">
                  <Shield className="w-5 h-5 text-indigo-400 shrink-0" />
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase font-semibold">
                      Warranty
                    </div>
                    <div className="text-xs font-medium text-slate-300">
                      {product.warrantyInformation || "Standard 1-year warranty"}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/50 border border-slate-800">
                  <Truck className="w-5 h-5 text-indigo-400 shrink-0" />
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase font-semibold">
                      Shipping
                    </div>
                    <div className="text-xs font-medium text-slate-300">
                      {product.shippingInformation || "Ships in 2-4 business days"}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/50 border border-slate-800">
                  <RotateCcw className="w-5 h-5 text-indigo-400 shrink-0" />
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase font-semibold">
                      Return Policy
                    </div>
                    <div className="text-xs font-medium text-slate-300">
                      {product.returnPolicy || "30 days return window"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <section className="mt-12 pt-8 border-t border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-white">Customer Reviews</h2>
              <p className="text-xs text-slate-400">
                Verified buyer feedback and satisfaction ratings
              </p>
            </div>
            <div className="text-xs font-semibold text-slate-400">
              {product.reviews?.length || 0} total reviews
            </div>
          </div>

          {product.reviews && product.reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {product.reviews.map((rev, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 text-xs">
                        <User className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-semibold text-slate-200">
                        {rev.reviewerName}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-amber-400">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span className="text-xs font-medium">{rev.rating}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed italic">
                    &ldquo;{rev.comment}&rdquo;
                  </p>

                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 pt-1">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(rev.date)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center rounded-xl border border-dashed border-slate-800 text-slate-500 text-xs">
              No customer reviews recorded for this product yet.
            </div>
          )}
        </section>
      </main>
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
