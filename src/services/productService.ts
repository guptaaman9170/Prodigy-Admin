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

export const productService = {
  /**
   * Fetches paginated product list with optional sorting
   */
  async getProducts(params: FetchProductsParams = {}): Promise<ProductListResponse> {
    const { limit = 10, skip = 0, sortBy, order, delay, signal } = params;
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
    return response.data;
  },

  /**
   * Searches products by keyword with optional sorting and cancellation signal
   */
  async searchProducts(params: SearchProductsParams): Promise<ProductListResponse> {
    const { q, limit = 10, skip = 0, sortBy, order, delay, signal } = params;
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
    return response.data;
  },

  /**
   * Fetches products within a specific category
   */
  async getProductsByCategory(
    category: string,
    params: FetchProductsParams = {}
  ): Promise<ProductListResponse> {
    const { limit = 10, skip = 0, sortBy, order, delay, signal } = params;
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
    return response.data;
  },

  /**
   * Fetches the list of all available categories
   */
  async getCategories(): Promise<CategoryItem[]> {
    const response = await apiClient.get<Array<string | { slug: string; name: string; url?: string }>>(
      "/products/categories"
    );

    // Normalize both format variants (string[] vs CategoryItem[])
    return response.data.map((cat) => {
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
  },

  /**
   * Fetches a single product by its unique ID
   */
  async getProductById(id: number | string, signal?: AbortSignal): Promise<Product> {
    const response = await apiClient.get<Product>(`/products/${id}`, { signal });
    return response.data;
  },

  /**
   * Adds a new product via POST /products/add
   */
  async addProduct(product: ProductFormData): Promise<Product> {
    const response = await apiClient.post<Product>("/products/add", product);
    return response.data;
  },

  /**
   * Updates an existing product via PUT /products/:id
   */
  async updateProduct(id: number | string, updates: Partial<ProductFormData>): Promise<Product> {
    const response = await apiClient.put<Product>(`/products/${id}`, updates);
    return response.data;
  },

  /**
   * Deletes a product via DELETE /products/:id
   */
  async deleteProduct(id: number | string): Promise<{ id: number; isDeleted: boolean }> {
    const response = await apiClient.delete<{ id: number; isDeleted: boolean }>(`/products/${id}`);
    return response.data;
  },
};
