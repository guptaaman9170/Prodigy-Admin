"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Product, ProductFormData } from "@/types/product";
import { productService } from "@/services/productService";

const STORAGE_KEY_ADDED = "prodigy_overlay_added";
const STORAGE_KEY_UPDATED = "prodigy_overlay_updated";
const STORAGE_KEY_DELETED = "prodigy_overlay_deleted";

interface ProductOverlayContextType {
  addedProducts: Product[];
  updatedProducts: Record<number, Partial<Product>>;
  deletedProductIds: number[];
  applyOverlay: (
    serverProducts: Product[],
    serverTotal: number,
    categoryFilter?: string,
    searchQuery?: string
  ) => { products: Product[]; total: number };
  applySingleProductOverlay: (serverProduct: Product | null, id: number) => Product | null;
  createProduct: (data: ProductFormData) => Promise<Product>;
  editProduct: (id: number, data: Partial<ProductFormData>) => Promise<Product>;
  removeProduct: (id: number) => Promise<void>;
  resetOverlay: () => void;
  isModified: boolean;
}

const ProductOverlayContext = createContext<ProductOverlayContextType | undefined>(undefined);

export function ProductOverlayProvider({ children }: { children: React.ReactNode }) {
  const [addedProducts, setAddedProducts] = useState<Product[]>([]);
  const [updatedProducts, setUpdatedProducts] = useState<Record<number, Partial<Product>>>({});
  const [deletedProductIds, setDeletedProductIds] = useState<number[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate local overlay state from localStorage on mount
  useEffect(() => {
    try {
      const storedAdded = localStorage.getItem(STORAGE_KEY_ADDED);
      const storedUpdated = localStorage.getItem(STORAGE_KEY_UPDATED);
      const storedDeleted = localStorage.getItem(STORAGE_KEY_DELETED);

      if (storedAdded) setAddedProducts(JSON.parse(storedAdded));
      if (storedUpdated) setUpdatedProducts(JSON.parse(storedUpdated));
      if (storedDeleted) setDeletedProductIds(JSON.parse(storedDeleted));
    } catch (e) {
      console.error("Failed to load local product overlay data", e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Save changes to localStorage whenever state changes
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY_ADDED, JSON.stringify(addedProducts));
      localStorage.setItem(STORAGE_KEY_UPDATED, JSON.stringify(updatedProducts));
      localStorage.setItem(STORAGE_KEY_DELETED, JSON.stringify(deletedProductIds));
    } catch (e) {
      console.error("Failed to persist local product overlay data", e);
    }
  }, [addedProducts, updatedProducts, deletedProductIds, isHydrated]);

  /**
   * Applies local CRUD overlays onto raw server products list
   */
  const applyOverlay = useCallback(
    (
      serverProducts: Product[],
      serverTotal: number,
      categoryFilter?: string,
      searchQuery?: string
    ) => {
      // 1. Filter out deleted products from server response
      const deletedSet = new Set(deletedProductIds);
      let list = serverProducts.filter((p) => !deletedSet.has(p.id));

      // 2. Apply modifications to server products
      list = list.map((p) => {
        if (updatedProducts[p.id]) {
          return { ...p, ...updatedProducts[p.id] };
        }
        return p;
      });

      // 3. Filter matching locally added products
      let matchingAdded = [...addedProducts].filter((p) => !deletedSet.has(p.id));

      // Apply modifications to locally added products as well
      matchingAdded = matchingAdded.map((p) => {
        if (updatedProducts[p.id]) {
          return { ...p, ...updatedProducts[p.id] };
        }
        return p;
      });

      if (categoryFilter && categoryFilter !== "all") {
        matchingAdded = matchingAdded.filter(
          (p) => p.category.toLowerCase() === categoryFilter.toLowerCase()
        );
      }

      if (searchQuery && searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        matchingAdded = matchingAdded.filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q)
        );
      }

      // Check which added products are not already in list
      const existingIds = new Set(list.map((p) => p.id));
      const newItemsToPrepend = matchingAdded.filter((p) => !existingIds.has(p.id));

      // Prepend newly added products at the top of the list
      const combined = [...newItemsToPrepend, ...list];
      const adjustedTotal = Math.max(
        0,
        serverTotal - deletedProductIds.length + matchingAdded.length
      );

      return {
        products: combined,
        total: adjustedTotal,
      };
    },
    [addedProducts, updatedProducts, deletedProductIds]
  );

  /**
   * Applies overlay onto a single product item (for detail page)
   */
  const applySingleProductOverlay = useCallback(
    (serverProduct: Product | null, id: number): Product | null => {
      if (deletedProductIds.includes(id)) {
        return null;
      }

      const localAdded = addedProducts.find((p) => p.id === id);
      if (localAdded) {
        if (updatedProducts[id]) {
          return { ...localAdded, ...updatedProducts[id] };
        }
        return localAdded;
      }

      if (!serverProduct) return null;

      if (updatedProducts[id]) {
        return { ...serverProduct, ...updatedProducts[id] };
      }

      return serverProduct;
    },
    [addedProducts, updatedProducts, deletedProductIds]
  );

  /**
   * Creates a product: sends POST to API and stores locally
   */
  const createProduct = useCallback(async (data: ProductFormData): Promise<Product> => {
    // Call API (simulated on server)
    const apiResult = await productService.addProduct(data);

    // Create a complete product structure with unique local ID if needed
    const newProduct: Product = {
      id: apiResult.id || Date.now(),
      title: data.title,
      description: data.description,
      category: data.category,
      price: Number(data.price),
      stock: Number(data.stock),
      brand: data.brand || "Generic",
      rating: data.rating || 5.0,
      discountPercentage: data.discountPercentage || 0,
      thumbnail:
        data.thumbnail ||
        "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp",
      images: data.images && data.images.length > 0
        ? data.images
        : [
            data.thumbnail ||
              "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/1.webp",
          ],
      availabilityStatus: Number(data.stock) > 0 ? "In Stock" : "Out of Stock",
      isLocal: true,
      meta: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };

    setAddedProducts((prev) => [newProduct, ...prev]);
    return newProduct;
  }, []);

  /**
   * Updates a product: sends PUT to API and saves override locally
   */
  const editProduct = useCallback(
    async (id: number, data: Partial<ProductFormData>): Promise<Product> => {
      // Call API
      const apiResult = await productService.updateProduct(id, data);

      const updates: Partial<Product> = {
        ...data,
        price: data.price !== undefined ? Number(data.price) : undefined,
        stock: data.stock !== undefined ? Number(data.stock) : undefined,
      };

      setUpdatedProducts((prev) => ({
        ...prev,
        [id]: {
          ...(prev[id] || {}),
          ...updates,
        },
      }));

      return {
        ...apiResult,
        ...updates,
      } as Product;
    },
    []
  );

  /**
   * Deletes a product: sends DELETE to API and registers deleted ID locally
   */
  const removeProduct = useCallback(
    async (id: number): Promise<void> => {
      await productService.deleteProduct(id);

      setDeletedProductIds((prev) => (prev.includes(id) ? prev : [...prev, id]));

      // Also remove from addedProducts if it was a locally created item
      setAddedProducts((prev) => prev.filter((p) => p.id !== id));
    },
    []
  );

  /**
   * Resets local overrides so live server data is shown clean
   */
  const resetOverlay = useCallback(() => {
    setAddedProducts([]);
    setUpdatedProducts({});
    setDeletedProductIds([]);
    localStorage.removeItem(STORAGE_KEY_ADDED);
    localStorage.removeItem(STORAGE_KEY_UPDATED);
    localStorage.removeItem(STORAGE_KEY_DELETED);
  }, []);

  const isModified =
    addedProducts.length > 0 ||
    Object.keys(updatedProducts).length > 0 ||
    deletedProductIds.length > 0;

  return (
    <ProductOverlayContext.Provider
      value={{
        addedProducts,
        updatedProducts,
        deletedProductIds,
        applyOverlay,
        applySingleProductOverlay,
        createProduct,
        editProduct,
        removeProduct,
        resetOverlay,
        isModified,
      }}
    >
      {children}
    </ProductOverlayContext.Provider>
  );
}

export function useProductOverlay() {
  const context = useContext(ProductOverlayContext);
  if (!context) {
    throw new Error("useProductOverlay must be used within a ProductOverlayProvider");
  }
  return context;
}
