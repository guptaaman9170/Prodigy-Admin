"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { productService } from "@/services/productService";
import { useProductOverlay } from "@/context/ProductOverlayContext";
import {
  Product,
  CategoryItem,
  SortField,
  SortOrder,
  ProductQueryFilters,
} from "@/types/product";

export function useProducts() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { applyOverlay } = useProductOverlay();

  // Parse and sanitize URL query parameters
  const rawPage = parseInt(searchParams.get("page") || "1", 10);
  const page = isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;

  const rawLimit = parseInt(searchParams.get("limit") || "10", 10);
  const limit = [10, 20, 50].includes(rawLimit) ? rawLimit : 10;

  const searchQuery = searchParams.get("q") || "";
  const selectedCategory = searchParams.get("category") || "all";
  const sortBy = (searchParams.get("sortBy") as SortField) || "none";
  const order = (searchParams.get("order") as SortOrder) || "asc";

  // Data states
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // References to guarantee race-condition immunity
  const currentRequestId = useRef(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Helper to update URL query params while preserving others
  const updateQueryParams = useCallback(
    (updates: Partial<Record<string, string | number | null>>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, val]) => {
        if (val === null || val === "" || val === "all" || val === "none") {
          params.delete(key);
        } else {
          params.set(key, String(val));
        }
      });

      // Construct clean URL
      const queryString = params.toString();
      router.push(queryString ? `${pathname}?${queryString}` : pathname, {
        scroll: false,
      });
    },
    [router, pathname, searchParams]
  );

  // Load categories list on initial load
  useEffect(() => {
    let isMounted = true;
    async function loadCategories() {
      try {
        setIsCategoriesLoading(true);
        const cats = await productService.getCategories();
        if (isMounted) {
          setCategories(cats);
        }
      } catch (err) {
        console.error("Failed to fetch product categories:", err);
      } finally {
        if (isMounted) setIsCategoriesLoading(false);
      }
    }
    loadCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  // Main data fetch function with race condition handling
  const fetchProductsData = useCallback(async () => {
    // 1. Cancel any active in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    // 2. Increment request ID sequence
    const thisRequestId = ++currentRequestId.current;

    setIsLoading(true);
    setError(null);

    const skip = (page - 1) * limit;

    try {
      let serverProducts: Product[] = [];
      let serverTotal = 0;

      // Handle Compound Search + Category:
      // When both category and search query are active, DummyJSON ignores one.
      // We handle this by fetching category products and filtering client-side or fetching search
      if (searchQuery.trim() && selectedCategory !== "all") {
        // Fetch matching search results
        const searchRes = await productService.searchProducts({
          q: searchQuery.trim(),
          limit: 100, // get broad matches
          sortBy: sortBy !== "none" ? sortBy : undefined,
          order,
          signal: abortController.signal,
        });

        // Client-side category match
        const categoryFiltered = searchRes.products.filter(
          (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
        );

        serverTotal = categoryFiltered.length;
        serverProducts = categoryFiltered.slice(skip, skip + limit);
      } else if (searchQuery.trim()) {
        // Standard Search
        const res = await productService.searchProducts({
          q: searchQuery.trim(),
          limit,
          skip,
          sortBy: sortBy !== "none" ? sortBy : undefined,
          order,
          signal: abortController.signal,
        });
        serverProducts = res.products;
        serverTotal = res.total;
      } else if (selectedCategory !== "all") {
        // Category Filter
        const res = await productService.getProductsByCategory(selectedCategory, {
          limit,
          skip,
          sortBy: sortBy !== "none" ? sortBy : undefined,
          order,
          signal: abortController.signal,
        });
        serverProducts = res.products;
        serverTotal = res.total;
      } else {
        // Standard Product List
        const res = await productService.getProducts({
          limit,
          skip,
          sortBy: sortBy !== "none" ? sortBy : undefined,
          order,
          signal: abortController.signal,
        });
        serverProducts = res.products;
        serverTotal = res.total;
      }

      // 3. Check if this response has been superseded by a newer request
      if (thisRequestId !== currentRequestId.current) {
        return;
      }

      // 4. Apply local CRUD overlay (reflects simulated adds, edits, and deletes)
      const overlayResult = applyOverlay(
        serverProducts,
        serverTotal,
        selectedCategory !== "all" ? selectedCategory : undefined,
        searchQuery.trim() || undefined
      );

      // 5. Apply client-side sorting if needed for overlaid items
      let finalProducts = overlayResult.products;
      if (sortBy && sortBy !== "none") {
        finalProducts = [...finalProducts].sort((a, b) => {
          const valA = a[sortBy];
          const valB = b[sortBy];

          if (typeof valA === "string") {
            const cmp = (valA as string).localeCompare(valB as string);
            return order === "desc" ? -cmp : cmp;
          }
          if (typeof valA === "number") {
            const numA = valA as number;
            const numB = (valB as number) || 0;
            return order === "desc" ? numB - numA : numA - numB;
          }
          return 0;
        });
      }

      setProducts(finalProducts);
      setTotal(overlayResult.total);

      // Safe page clamping: if page > totalPages and total > 0, clamp to max page
      const totalPages = Math.ceil(overlayResult.total / limit);
      if (totalPages > 0 && page > totalPages) {
        updateQueryParams({ page: totalPages });
      }
    } catch (err: unknown) {
      // Ignore errors caused by deliberate request aborts
      if (abortController.signal.aborted) {
        return;
      }

      // Check request ID before setting error
      if (thisRequestId === currentRequestId.current) {
        const errorObj = err as { message?: string };
        setError(errorObj?.message || "Failed to load products. Please check your connection.");
      }
    } finally {
      if (thisRequestId === currentRequestId.current) {
        setIsLoading(false);
      }
    }
  }, [
    page,
    limit,
    searchQuery,
    selectedCategory,
    sortBy,
    order,
    applyOverlay,
    updateQueryParams,
  ]);

  // Trigger fetch whenever parameters or overlay changes
  useEffect(() => {
    fetchProductsData();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchProductsData]);

  // Actions for UI interaction
  const setPage = useCallback(
    (newPage: number) => {
      updateQueryParams({ page: newPage });
    },
    [updateQueryParams]
  );

  const setLimit = useCallback(
    (newLimit: number) => {
      // Reset to page 1 when changing page size to avoid out-of-bounds
      updateQueryParams({ limit: newLimit, page: 1 });
    },
    [updateQueryParams]
  );

  const setSearch = useCallback(
    (newSearch: string) => {
      // Reset to page 1 when changing search query
      updateQueryParams({ q: newSearch.trim() || null, page: 1 });
    },
    [updateQueryParams]
  );

  const setCategory = useCallback(
    (newCategory: string) => {
      // Reset to page 1 when changing category filter
      updateQueryParams({ category: newCategory, page: 1 });
    },
    [updateQueryParams]
  );

  const setSorting = useCallback(
    (newSortBy: SortField, newOrder?: SortOrder) => {
      if (newSortBy === "none") {
        updateQueryParams({ sortBy: null, order: null });
      } else {
        const targetOrder = newOrder || (sortBy === newSortBy && order === "asc" ? "desc" : "asc");
        updateQueryParams({ sortBy: newSortBy, order: targetOrder });
      }
    },
    [sortBy, order, updateQueryParams]
  );

  const resetFilters = useCallback(() => {
    router.push(pathname, { scroll: false });
  }, [router, pathname]);

  return {
    products,
    total,
    categories,
    isLoading,
    isCategoriesLoading,
    error,
    filters: {
      page,
      limit,
      search: searchQuery,
      category: selectedCategory,
      sortBy,
      order,
    } as ProductQueryFilters,
    setPage,
    setLimit,
    setSearch,
    setCategory,
    setSorting,
    resetFilters,
    refetch: fetchProductsData,
  };
}
