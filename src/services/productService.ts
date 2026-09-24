import apiClient from "@/lib/axios";
import {
  Product,
  ProductListResponse,
  CategoryItem,
  SortField,
  SortOrder,
  ProductFormData,
} from "@/types/product";

export interface FetchProductsParams {
  limit?: number;
  skip?: number;
  sortBy?: SortField;
  order?: SortOrder;
  delay?: number;
  signal?: AbortSignal;
}

export interface SearchProductsParams extends FetchProductsParams {
  q: string;
}

// In-memory cache structures for blazing-fast navigation
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const productDetailsCache = new Map<number | string, CacheEntry<Product>>();
const productListCache = new Map<string, CacheEntry<ProductListResponse>>();
let categoriesCache: CacheEntry<CategoryItem[]> | null = null;

const PRODUCT_DETAILS_TTL = 5 * 60 * 1000; // 5 minutes
const PRODUCT_LIST_TTL = 3 * 60 * 1000;    // 3 minutes
const CATEGORIES_TTL = 15 * 60 * 1000;    // 15 minutes

// Helper to prime individual products into details cache from list results
function primeProductDetails(products: Product[]) {
  const now = Date.now();
  for (const product of products) {
    productDetailsCache.set(product.id, { data: product, timestamp: now });
  }
}

export const productService = {
  /**
   * Fetches paginated product list with in-memory caching
   */
  async getProducts(params: FetchProductsParams = {}): Promise<ProductListResponse> {
    const { limit = 10, skip = 0, sortBy, order, delay, signal } = params;
    const cacheKey = `list_${limit}_${skip}_${sortBy || "none"}_${order || "asc"}`;

    // Return cached list if valid and no artificial delay requested
    const cached = productListCache.get(cacheKey);
    if (!delay && cached && Date.now() - cached.timestamp < PRODUCT_LIST_TTL) {
      return cached.data;
    }

    const queryParams: Record<string, string | number> = { limit, skip };
    if (sortBy && sortBy !== "none") {
      queryParams.sortBy = sortBy;
      queryParams.order = order || "asc";
    }
    if (delay) {
      queryParams.delay = delay;
    }

    const response = await apiClient.get<ProductListResponse>("/products", {
      params: queryParams,
      signal,
    });

    const data = response.data;
    if (!delay) {
      productListCache.set(cacheKey, { data, timestamp: Date.now() });
      primeProductDetails(data.products);
    }
    return data;
  },

  /**
   * Searches products by keyword with caching
   */
  async searchProducts(params: SearchProductsParams): Promise<ProductListResponse> {
    const { q, limit = 10, skip = 0, sortBy, order, delay, signal } = params;
    const cacheKey = `search_${q.toLowerCase()}_${limit}_${skip}_${sortBy || "none"}_${order || "asc"}`;

    const cached = productListCache.get(cacheKey);
    if (!delay && cached && Date.now() - cached.timestamp < PRODUCT_LIST_TTL) {
      return cached.data;
    }

    const queryParams: Record<string, string | number> = { q, limit, skip };
    if (sortBy && sortBy !== "none") {
      queryParams.sortBy = sortBy;
      queryParams.order = order || "asc";
    }
    if (delay) {
      queryParams.delay = delay;
    }

    const response = await apiClient.get<ProductListResponse>("/products/search", {
      params: queryParams,
      signal,
    });

    const data = response.data;
    if (!delay) {
      productListCache.set(cacheKey, { data, timestamp: Date.now() });
      primeProductDetails(data.products);
    }
    return data;
  },

  /**
   * Fetches products within a specific category with caching
   */
  async getProductsByCategory(
    category: string,
    params: FetchProductsParams = {}
  ): Promise<ProductListResponse> {
    const { limit = 10, skip = 0, sortBy, order, delay, signal } = params;
    const cacheKey = `cat_${category}_${limit}_${skip}_${sortBy || "none"}_${order || "asc"}`;

    const cached = productListCache.get(cacheKey);
    if (!delay && cached && Date.now() - cached.timestamp < PRODUCT_LIST_TTL) {
      return cached.data;
    }

    const queryParams: Record<string, string | number> = { limit, skip };
    if (sortBy && sortBy !== "none") {
      queryParams.sortBy = sortBy;
      queryParams.order = order || "asc";
    }
    if (delay) {
      queryParams.delay = delay;
    }

    const response = await apiClient.get<ProductListResponse>(
      `/products/category/${encodeURIComponent(category)}`,
      {
        params: queryParams,
        signal,
      }
    );

    const data = response.data;
    if (!delay) {
      productListCache.set(cacheKey, { data, timestamp: Date.now() });
      primeProductDetails(data.products);
    }
    return data;
  },

  /**
   * Fetches the list of all available categories with 15-min cache
   */
  async getCategories(): Promise<CategoryItem[]> {
    if (categoriesCache && Date.now() - categoriesCache.timestamp < CATEGORIES_TTL) {
      return categoriesCache.data;
    }

    const response = await apiClient.get<Array<string | { slug: string; name: string; url?: string }>>(
      "/products/categories"
    );

    // Normalize both format variants (string[] vs CategoryItem[])
    const normalized = response.data.map((cat) => {
      if (typeof cat === "string") {
        return {
          slug: cat,
          name: cat
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" "),
        };
      }
      return {
        slug: cat.slug,
        name: cat.name || cat.slug,
        url: cat.url,
      };
    });

    categoriesCache = { data: normalized, timestamp: Date.now() };
    return normalized;
  },

  /**
   * Fetches a single product by its unique ID with cache
   */
  async getProductById(id: number | string, signal?: AbortSignal): Promise<Product> {
    const cached = productDetailsCache.get(id);
    if (cached && Date.now() - cached.timestamp < PRODUCT_DETAILS_TTL) {
      return cached.data;
    }

    const response = await apiClient.get<Product>(`/products/${id}`, { signal });
    const product = response.data;
    productDetailsCache.set(id, { data: product, timestamp: Date.now() });
    return product;
  },

  /**
   * Prefetches a single product into memory ahead of time (e.g. on mouse hover)
   */
  async prefetchProduct(id: number | string): Promise<void> {
    const cached = productDetailsCache.get(id);
    if (cached && Date.now() - cached.timestamp < PRODUCT_DETAILS_TTL) {
      return;
    }
    try {
      const response = await apiClient.get<Product>(`/products/${id}`);
      productDetailsCache.set(id, { data: response.data, timestamp: Date.now() });
    } catch {
      // Ignore background prefetch errors
    }
  },

  /**
   * Adds a new product via POST /products/add and clears list cache
   */
  async addProduct(product: ProductFormData): Promise<Product> {
    const response = await apiClient.post<Product>("/products/add", product);
    const created = response.data;
    productDetailsCache.set(created.id, { data: created, timestamp: Date.now() });
    productListCache.clear();
    return created;
  },

  /**
   * Updates an existing product via PUT /products/:id and syncs cache
   */
  async updateProduct(id: number | string, updates: Partial<ProductFormData>): Promise<Product> {
    const response = await apiClient.put<Product>(`/products/${id}`, updates);
    const updated = response.data;
    productDetailsCache.set(id, { data: updated, timestamp: Date.now() });
    productListCache.clear();
    return updated;
  },

  /**
   * Deletes a product via DELETE /products/:id and cleans cache
   */
  async deleteProduct(id: number | string): Promise<{ id: number; isDeleted: boolean }> {
    const response = await apiClient.delete<{ id: number; isDeleted: boolean }>(`/products/${id}`);
    productDetailsCache.delete(id);
    productListCache.clear();
    return response.data;
  },

  /**
   * Manually clears all caches
   */
  clearCache(): void {
    productDetailsCache.clear();
    productListCache.clear();
    categoriesCache = null;
  },
};

