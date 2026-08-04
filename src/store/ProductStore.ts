import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import * as ProductAPI from '@/api/Product.api';
import type { 
  Product, 
  ProductListParams, 
  BestSellingParams, 
  FestivalFavoritesParams 
} from '@/api/Product.api';

interface ProductState {
  // Product lists
  products: Product[];
  bestSellingProducts: Product[];
  festivalFavorites: Product[];
  relatedProducts: Product[];
  
  // Single product
  currentProduct: Product | null;
  
  // Pagination & meta
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  
  // Loading states
  loading: boolean;
  bestSellingLoading: boolean;
  festivalLoading: boolean;
  relatedLoading: boolean;
  productLoading: boolean;
  
  // Error states
  error: string | null;
  
  // Current filters/params
  currentParams: ProductListParams;
  
  // Optimization flags
  isInitialized: boolean;
  lastFetch: number | null;
}

interface ProductActions {
  // Initialization
  initializeProducts: () => Promise<void>;
  
  // Product list actions
  fetchProducts: (params?: ProductListParams) => Promise<void>;
  searchProducts: (query: string, options?: Omit<ProductListParams, 'search'>) => Promise<void>;
  filterByCategory: (categoryId: string, options?: Omit<ProductListParams, 'category'>) => Promise<void>;
  sortProducts: (sortBy: 'newest' | 'lowToHigh' | 'highToLow' | 'popularity') => Promise<void>;
  filterByPriceRange: (minPrice: number, maxPrice: number) => Promise<void>;
  loadMore: () => Promise<void>;
  
  // Single product actions
  fetchProductBySlug: (slug: string) => Promise<void>;
  getProductBySlug: (slug: string) => Promise<void>; // Added alias for backwards compatibility
  fetchRelatedProducts: (productId: string) => Promise<void>;
  
  // Homepage sections
  fetchBestSellingProducts: (params?: BestSellingParams) => Promise<void>;
  fetchFestivalFavorites: (params?: FestivalFavoritesParams) => Promise<void>;
  
  // Utility actions
  clearProducts: () => void;
  clearCurrentProduct: () => void;
  clearError: () => void;
  resetFilters: () => void;
  clearSearchParams: () => void;
  clearCategoryParams: () => void;
  
  // Pagination
  setPage: (page: number) => Promise<void>;
  setLimit: (limit: number) => Promise<void>;
}

type ProductStore = ProductState & ProductActions;

const initialState: ProductState = {
  products: [],
  bestSellingProducts: [],
  festivalFavorites: [],
  relatedProducts: [],
  currentProduct: null,
  total: 0,
  page: 1,
  limit: 12,
  totalPages: 0,
  loading: false,
  bestSellingLoading: false,
  festivalLoading: false,
  relatedLoading: false,
  productLoading: false,
  error: null,
  currentParams: {
    page: 1,
    limit: 12,
    status: 'active' as const,
    sortBy: 'newest' as const
  },
  isInitialized: false,
  lastFetch: null,
};

export const useProductStore = create<ProductStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // ===== INITIALIZATION =====
      
      initializeProducts: async () => {
        const state = get();
        if (state.isInitialized) return;
        
        await get().fetchProducts();
        set({ isInitialized: true });
      },

      // ===== PRODUCT LIST ACTIONS =====
      
      fetchProducts: async (params = {}) => {
        set({ loading: true, error: null });
        try {
          const currentParams = get().currentParams;
          
          // Create a clean params object, removing undefined values and overriding existing ones
          const cleanParams: ProductListParams = { 
            status: 'active' as const // Always filter for active products on public site
          };
          
          // Add non-undefined values from currentParams first
          Object.entries(currentParams).forEach(([key, value]) => {
            if (value !== undefined && key !== 'status') {
              (cleanParams as any)[key] = value;
            }
          });
          
          // Override with new params, including setting to undefined to remove filters
          Object.entries(params).forEach(([key, value]) => {
            if (key !== 'status') {
              if (value === undefined) {
                // Remove the parameter by not setting it
                delete (cleanParams as any)[key];
              } else {
                (cleanParams as any)[key] = value;
              }
            }
          });
          
          const response = await ProductAPI.getAllProducts(cleanParams);
          
          set({
            products: response.data.products,
            total: response.data.total,
            page: cleanParams.page || 1,
            limit: cleanParams.limit || 12,
            totalPages: Math.ceil(response.data.total / (cleanParams.limit || 12)),
            currentParams: cleanParams,
            loading: false,
            lastFetch: Date.now(),
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to fetch products',
            loading: false,
          });
        }
      },

      searchProducts: async (query, options = {}) => {
        const params = { ...options, search: query, page: 1 };
        await get().fetchProducts(params);
      },

      filterByCategory: async (categoryId, options = {}) => {
        const params = { ...options, category: categoryId, page: 1 };
        await get().fetchProducts(params);
      },

      sortProducts: async (sortBy) => {
        const params = { ...get().currentParams, sortBy, page: 1 };
        await get().fetchProducts(params);
      },

      filterByPriceRange: async (minPrice, maxPrice) => {
        const params = { ...get().currentParams, minPrice, maxPrice, page: 1 };
        await get().fetchProducts(params);
      },

      loadMore: async () => {
        const { currentParams, products } = get();
        const nextPage = currentParams.page! + 1;
        
        set({ loading: true });
        try {
          const response = await ProductAPI.getAllProducts({
            ...currentParams,
            page: nextPage,
          });
          
          set({
            products: [...products, ...response.data.products],
            page: nextPage,
            currentParams: { ...currentParams, page: nextPage },
            loading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to load more products',
            loading: false,
          });
        }
      },

      // ===== SINGLE PRODUCT ACTIONS =====

      fetchProductBySlug: async (slug) => {
        set({ productLoading: true, error: null });
        try {
          const response = await ProductAPI.getProductBySlug(slug);
          set({
            currentProduct: response.data.product,
            productLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to fetch product',
            productLoading: false,
          });
        }
      },
      
      // Alias for fetchProductBySlug to ensure compatibility with existing code
      getProductBySlug: async (slug) => {
        return get().fetchProductBySlug(slug);
      },

      fetchRelatedProducts: async (productId) => {
        set({ relatedLoading: true });
        try {
          const response = await ProductAPI.getPeopleAlsoBought(productId);
          set({
            relatedProducts: response.data.related,
            relatedLoading: false,
          });
        } catch (error) {
          set({
            relatedProducts: [],
            relatedLoading: false,
          });
        }
      },

      // ===== HOMEPAGE SECTIONS =====

      fetchBestSellingProducts: async (params = {}) => {
        set({ bestSellingLoading: true });
        try {
          const response = await ProductAPI.getBestSellingProducts(params);
          set({
            bestSellingProducts: response.data.products,
            bestSellingLoading: false,
          });
        } catch (error) {
          set({
            bestSellingProducts: [],
            bestSellingLoading: false,
          });
        }
      },

      fetchFestivalFavorites: async (params = {}) => {
        set({ festivalLoading: true });
        try {
          const response = await ProductAPI.getFestivalFavorites(params);
          set({
            festivalFavorites: response.data.products,
            festivalLoading: false,
          });
        } catch (error) {
          set({
            festivalFavorites: [],
            festivalLoading: false,
          });
        }
      },

      // ===== UTILITY ACTIONS =====

      clearProducts: () => {
        set({
          products: [],
          total: 0,
          page: 1,
          totalPages: 0,
        });
      },

      clearCurrentProduct: () => {
        set({
          currentProduct: null,
          relatedProducts: [],
        });
      },

      clearError: () => {
        set({ error: null });
      },

      resetFilters: () => {
        const defaultParams = {
          page: 1,
          limit: 12,
          status: 'active' as const,
          sortBy: 'newest' as const,
        };
        set({
          currentParams: defaultParams,
        });
        get().fetchProducts(defaultParams);
      },

      clearSearchParams: () => {
        const currentParams = get().currentParams;
        const newParams = { ...currentParams };
        delete newParams.search;
        set({ currentParams: newParams });
      },

      clearCategoryParams: () => {
        const currentParams = get().currentParams;
        const newParams = { ...currentParams };
        delete newParams.category;
        set({ currentParams: newParams });
      },

      // ===== PAGINATION =====

      setPage: async (page) => {
        const params = { ...get().currentParams, page };
        await get().fetchProducts(params);
      },

      setLimit: async (limit) => {
        const params = { ...get().currentParams, limit, page: 1 };
        await get().fetchProducts(params);
      },
    }),
    {
      name: 'product-store',
    }
  )
);

// ===== OPTIMIZED ACTION OBJECT =====

export const productStore = {
  // Initialization
  initialize: () => useProductStore.getState().initializeProducts(),
  
  // Product list actions
  fetch: (params?: ProductListParams) => useProductStore.getState().fetchProducts(params),
  search: (query: string, options?: Omit<ProductListParams, 'search'>) => 
    useProductStore.getState().searchProducts(query, options),
  filterByCategory: (categoryId: string, options?: Omit<ProductListParams, 'category'>) => 
    useProductStore.getState().filterByCategory(categoryId, options),
  sort: (sortBy: 'newest' | 'lowToHigh' | 'highToLow' | 'popularity') => 
    useProductStore.getState().sortProducts(sortBy),
  filterByPrice: (minPrice: number, maxPrice: number) => 
    useProductStore.getState().filterByPriceRange(minPrice, maxPrice),
  loadMore: () => useProductStore.getState().loadMore(),
  
  // Single product actions
  fetchBySlug: (slug: string) => useProductStore.getState().fetchProductBySlug(slug),
  fetchRelated: (productId: string) => useProductStore.getState().fetchRelatedProducts(productId),
  
  // Homepage sections
  fetchBestSelling: (params?: BestSellingParams) => 
    useProductStore.getState().fetchBestSellingProducts(params),
  fetchFestival: (params?: FestivalFavoritesParams) => 
    useProductStore.getState().fetchFestivalFavorites(params),
  
  // Utility actions
  clear: () => useProductStore.getState().clearProducts(),
  clearCurrent: () => useProductStore.getState().clearCurrentProduct(),
  clearError: () => useProductStore.getState().clearError(),
  resetFilters: () => useProductStore.getState().resetFilters(),
  clearSearchParams: () => useProductStore.getState().clearSearchParams(),
  clearCategoryParams: () => useProductStore.getState().clearCategoryParams(),
  
  // Pagination
  setPage: (page: number) => useProductStore.getState().setPage(page),
  setLimit: (limit: number) => useProductStore.getState().setLimit(limit),
  
  // State getters
  getState: () => useProductStore.getState(),
  getProducts: () => useProductStore.getState().products,
  getCurrentProduct: () => useProductStore.getState().currentProduct,
  getParams: () => useProductStore.getState().currentParams,
  isLoading: () => useProductStore.getState().loading,
  getError: () => useProductStore.getState().error,
};

// ===== SELECTORS =====

export const useProducts = () => useProductStore((state) => state.products);
export const useCurrentProduct = () => useProductStore((state) => state.currentProduct);
export const useBestSellingProducts = () => useProductStore((state) => state.bestSellingProducts);
export const useFestivalFavorites = () => useProductStore((state) => state.festivalFavorites);
export const useRelatedProducts = () => useProductStore((state) => state.relatedProducts);

// Individual loading selectors to avoid object recreation
export const useProductsLoading = () => useProductStore((state) => state.loading);
export const useCurrentProductLoading = () => useProductStore((state) => state.productLoading);
export const useBestSellingLoading = () => useProductStore((state) => state.bestSellingLoading);
export const useFestivalLoading = () => useProductStore((state) => state.festivalLoading);
export const useRelatedLoading = () => useProductStore((state) => state.relatedLoading);

// Individual pagination selectors
export const useProductPage = () => useProductStore((state) => state.page);
export const useProductLimit = () => useProductStore((state) => state.limit);
export const useProductTotal = () => useProductStore((state) => state.total);
export const useProductTotalPages = () => useProductStore((state) => state.totalPages);

// Individual action selectors
export const useFetchProducts = () => useProductStore((state) => state.fetchProducts);
export const useLoadMore = () => useProductStore((state) => state.loadMore);
export const useSortProducts = () => useProductStore((state) => state.sortProducts);
export const useFilterByCategory = () => useProductStore((state) => state.filterByCategory);
export const useFilterByPriceRange = () => useProductStore((state) => state.filterByPriceRange);
export const useSearchProducts = () => useProductStore((state) => state.searchProducts);
export const useResetFilters = () => useProductStore((state) => state.resetFilters);

export default useProductStore;
