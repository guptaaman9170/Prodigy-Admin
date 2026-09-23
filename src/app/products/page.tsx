"use client";

import React, { useState, Suspense } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Navbar from "@/components/layout/Navbar";
import FilterBar from "@/components/products/FilterBar";
import ProductTable from "@/components/products/ProductTable";
import ProductCards from "@/components/products/ProductCards";
import Pagination from "@/components/products/Pagination";
import ProductFormModal from "@/components/products/ProductFormModal";
import DeleteConfirmModal from "@/components/products/DeleteConfirmModal";
import { TableSkeleton, CardSkeleton } from "@/components/common/LoadingSkeleton";
import EmptyState from "@/components/common/EmptyState";
import ErrorState from "@/components/common/ErrorState";
import { useProducts } from "@/hooks/useProducts";
import { useProductOverlay } from "@/context/ProductOverlayContext";
import { Product, ProductFormData } from "@/types/product";
import { CheckCircle2, Package } from "lucide-react";

function ProductsDashboardContent() {
  const {
    products,
    total,
    categories,
    isLoading,
    error,
    filters,
    setPage,
    setLimit,
    setSearch,
    setCategory,
    setSorting,
    resetFilters,
    refetch,
  } = useProducts();

  const { createProduct, editProduct, removeProduct } = useProductOverlay();

  // Modals state
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Handlers for Add / Edit
  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setFormModalOpen(true);
  };

  const handleFormSubmit = async (formData: ProductFormData) => {
    if (editingProduct) {
      await editProduct(editingProduct.id, formData);
      showToast(`Updated "${formData.title}" successfully`);
    } else {
      await createProduct(formData);
      showToast(`Created "${formData.title}" successfully`);
    }
    refetch();
  };

  // Handlers for Delete
  const handleOpenDelete = (product: Product) => {
    setDeletingProduct(product);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async (id: number) => {
    await removeProduct(id);
    showToast("Product deleted successfully");
    refetch();
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title & Stats Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Product Inventory
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Browse, search, filter, and manage items in your e-commerce catalog
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
              <Package className="w-4 h-4 text-indigo-400" />
              <span>
                Total Catalog: <strong className="text-white font-semibold">{total}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <FilterBar
          searchQuery={filters.search}
          selectedCategory={filters.category}
          sortBy={filters.sortBy}
          order={filters.order}
          categories={categories}
          onSearchChange={setSearch}
          onCategoryChange={setCategory}
          onSortChange={setSorting}
          onResetFilters={resetFilters}
          onAddProduct={handleOpenAdd}
        />

        {/* Content Area: Loading / Error / Empty / Data */}
        <div className="space-y-4">
          {isLoading ? (
            <>
              <div className="hidden md:block">
                <TableSkeleton rows={filters.limit} />
              </div>
              <div className="md:hidden">
                <CardSkeleton count={Math.min(filters.limit, 6)} />
              </div>
            </>
          ) : error ? (
            <ErrorState message={error} onRetry={refetch} />
          ) : products.length === 0 ? (
            <EmptyState onReset={resetFilters} />
          ) : (
            <>
              {/* Desktop View: Table */}
              <div className="hidden md:block">
                <ProductTable
                  products={products}
                  sortBy={filters.sortBy}
                  order={filters.order}
                  onSort={setSorting}
                  onEdit={handleOpenEdit}
                  onDelete={handleOpenDelete}
                />
              </div>

              {/* Mobile View: Cards */}
              <div className="md:hidden">
                <ProductCards
                  products={products}
                  onEdit={handleOpenEdit}
                  onDelete={handleOpenDelete}
                />
              </div>

              {/* Custom Pagination */}
              <Pagination
                currentPage={filters.page}
                pageSize={filters.limit}
                totalItems={total}
                onPageChange={setPage}
                onPageSizeChange={setLimit}
              />
            </>
          )}
        </div>
      </main>

      {/* Add / Edit Modal */}
      <ProductFormModal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialProduct={editingProduct}
        categories={categories}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        product={deletingProduct}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-xs sm:text-sm shadow-2xl animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <ProtectedRoute>
      <Suspense
        fallback={
          <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
            <span>Loading Dashboard...</span>
          </div>
        }
      >
        <ProductsDashboardContent />
      </Suspense>
    </ProtectedRoute>
  );
}
