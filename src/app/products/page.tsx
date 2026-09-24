"use client";

import React, { useState, Suspense } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import DashboardOverview from "@/components/dashboard/DashboardOverview";
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
import { CheckCircle2 } from "lucide-react";

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

  // Navigation tab state: "dashboard" or "products"
  const [activeTab, setActiveTab] = useState<"dashboard" | "products">("products");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

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
    <div className="min-h-screen bg-slate-50 flex">
      {/* Responsive Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        productCount={total}
        onOpenAddProduct={handleOpenAdd}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Top Header */}
        <Header
          onOpenSidebar={() => setSidebarOpen(true)}
          onOpenAddProduct={handleOpenAdd}
          searchQuery={filters.search}
          onSearchChange={setSearch}
          breadcrumbs={
            activeTab === "dashboard"
              ? [
                  { label: "PulseStack", href: "/products" },
                  { label: "Dashboard Overview" },
                ]
              : [
                  { label: "PulseStack", href: "/products" },
                  { label: "Store Catalog", href: "/products" },
                  { label: "Products" },
                ]
          }
        />

        {/* Page Content Body */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {activeTab === "dashboard" ? (
            <DashboardOverview
              products={products}
              totalProducts={total}
              categoriesCount={categories.length || 14}
              onOpenAddProduct={handleOpenAdd}
              onViewCatalog={() => setActiveTab("products")}
            />
          ) : (
            <>
              {/* Products Catalog Filter Toolbar */}
              <FilterBar
                searchQuery={filters.search}
                selectedCategory={filters.category}
                sortBy={filters.sortBy}
                order={filters.order}
                categories={categories}
                totalItems={total}
                displayedItemsCount={products.length}
                viewMode={viewMode}
                onSearchChange={setSearch}
                onCategoryChange={setCategory}
                onSortChange={setSorting}
                onResetFilters={resetFilters}
                onAddProduct={handleOpenAdd}
                onViewModeChange={setViewMode}
              />

              {/* Data View: Loading, Error, Empty, or Table/Grid */}
              <div className="space-y-4">
                {isLoading ? (
                  viewMode === "table" ? (
                    <TableSkeleton rows={filters.limit} />
                  ) : (
                    <CardSkeleton count={Math.min(filters.limit, 6)} />
                  )
                ) : error ? (
                  <ErrorState message={error} onRetry={refetch} />
                ) : products.length === 0 ? (
                  <EmptyState onReset={resetFilters} />
                ) : (
                  <>
                    {/* View Switch: Table or Card Grid */}
                    {viewMode === "table" ? (
                      <ProductTable
                        products={products}
                        sortBy={filters.sortBy}
                        order={filters.order}
                        onSort={setSorting}
                        onEdit={handleOpenEdit}
                        onDelete={handleOpenDelete}
                      />
                    ) : (
                      <ProductCards
                        products={products}
                        onEdit={handleOpenEdit}
                        onDelete={handleOpenDelete}
                      />
                    )}

                    {/* Pagination */}
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
            </>
          )}
        </main>
      </div>

      {/* Add / Edit Form Modal */}
      <ProductFormModal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        onDeleteRequest={(prod) => {
          setFormModalOpen(false);
          setDeletingProduct(prod);
          setDeleteModalOpen(true);
        }}
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

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-900 text-white text-xs font-semibold shadow-2xl animate-in slide-in-from-bottom-2">
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
          <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500 font-semibold text-xs">
            <span>Loading PulseStack PRO...</span>
          </div>
        }
      >
        <ProductsDashboardContent />
      </Suspense>
    </ProtectedRoute>
  );
}
