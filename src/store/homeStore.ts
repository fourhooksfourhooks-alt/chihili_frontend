import { create } from 'zustand';
import { 
  Category, 
  Product, 
  RecentlyViewedProduct,
  HeroBanner,
  AlsoBoughtProduct,
  getCategories, 
  getAllProducts, 
  addToRecentlyViewed,
  getRecentlyViewed,
  getFestivalProducts,
  getBestSellingProducts,
  getHeroBanners,
  getAlsoBoughtProducts
} from '@/api/home.api';

interface HomeStore {
  // Categories
  categories: Category[];
  totalCategories: number;
  loadingCategories: boolean;
  categoryError: string | null;
  
  // Products
  products: Product[];
  totalProducts: number;
  loadingProducts: boolean;
  productError: string | null;
  
  // Recently Viewed Products
  recentlyViewed: RecentlyViewedProduct[];
  loadingRecentlyViewed: boolean;
  recentlyViewedError: string | null;
  
  // Festival Products
  festivalProducts: Product[];
  totalFestivalProducts: number;
  loadingFestivalProducts: boolean;
  festivalProductsError: string | null;
  
  // Best Selling Products
  bestSellingProducts: Product[];
  totalBestSellingProducts: number;
  loadingBestSellingProducts: boolean;
  bestSellingProductsError: string | null;
  
  // Hero Banners
  heroBanners: HeroBanner[];
  totalHeroBanners: number;
  loadingHeroBanners: boolean;
  heroBannersError: string | null;
  
  // Also Bought Products
  alsoBoughtProducts: AlsoBoughtProduct[];
  loadingAlsoBoughtProducts: boolean;
  alsoBoughtProductsError: string | null;
  
  // Actions
  fetchCategories: (page?: number, limit?: number) => Promise<void>;
  fetchProducts: (page?: number, limit?: number, status?: string, sortBy?: string, sortOrder?: number) => Promise<void>;
  addProductToRecentlyViewed: (productId: string) => Promise<void>;
  fetchRecentlyViewed: (limit?: number) => Promise<void>;
  fetchFestivalProducts: (page?: number, limit?: number) => Promise<void>;
  fetchBestSellingProducts: (page?: number, limit?: number) => Promise<void>;
  fetchHeroBanners: (limit?: number) => Promise<void>;
  fetchAlsoBoughtProducts: (productId: string, page?: number, limit?: number) => Promise<void>;
  clearErrors: () => void;
}

export const useHomeStore = create<HomeStore>((set) => ({
  // Initial state
  categories: [],
  totalCategories: 0,
  loadingCategories: false,
  categoryError: null,
  
  products: [],
  totalProducts: 0,
  loadingProducts: false,
  productError: null,
  
  // Recently Viewed
  recentlyViewed: [],
  loadingRecentlyViewed: false,
  recentlyViewedError: null,
  
  // Festival Products
  festivalProducts: [],
  totalFestivalProducts: 0,
  loadingFestivalProducts: false,
  festivalProductsError: null,
  
  // Best Selling Products
  bestSellingProducts: [],
  totalBestSellingProducts: 0,
  loadingBestSellingProducts: false,
  bestSellingProductsError: null,
  
  // Hero Banners
  heroBanners: [],
  totalHeroBanners: 0,
  loadingHeroBanners: false,
  heroBannersError: null,
  
  // Also Bought Products
  alsoBoughtProducts: [],
  loadingAlsoBoughtProducts: false,
  alsoBoughtProductsError: null,
  
  // Actions
  fetchCategories: async (page = 1, limit = 10) => {
    set({ loadingCategories: true, categoryError: null });
    try {
      const response = await getCategories(page, limit);
      set({
        categories: response.data.categories,
        totalCategories: response.data.total,
        loadingCategories: false
      });
    } catch (error) {
      console.error('Error in fetchCategories:', error);
      set({
        loadingCategories: false,
        categoryError: error instanceof Error ? error.message : 'Failed to fetch categories'
      });
    }
  },
  
  fetchProducts: async (page = 1, limit = 10, status = 'active', sortBy = 'createdAt', sortOrder = -1) => {
    set({ loadingProducts: true, productError: null });
    try {
      const response = await getAllProducts(page, limit, status, sortBy, sortOrder);
      set({
        products: response.data.products,
        totalProducts: response.data.total,
        loadingProducts: false
      });
    } catch (error) {
      console.error('Error in fetchProducts:', error);
      set({
        loadingProducts: false,
        productError: error instanceof Error ? error.message : 'Failed to fetch products'
      });
    }
  },
  
  // Add product to recently viewed
  addProductToRecentlyViewed: async (productId: string) => {
    try {
      await addToRecentlyViewed(productId);
      // We don't need to update state here as this is just recording the view
    } catch (error) {
      console.error('Error adding product to recently viewed:', error);
      // Silent fail - don't want to interrupt user experience for this
    }
  },
  
  // Fetch recently viewed products
  fetchRecentlyViewed: async (limit = 8) => {
    set({ loadingRecentlyViewed: true, recentlyViewedError: null });
    try {
      const response = await getRecentlyViewed(limit);
      set({
        recentlyViewed: response.data.recentlyViewed,
        loadingRecentlyViewed: false
      });
    } catch (error) {
      console.error('Error fetching recently viewed products:', error);
      set({
        loadingRecentlyViewed: false,
        recentlyViewedError: error instanceof Error ? error.message : 'Failed to fetch recently viewed products'
      });
    }
  },
  
  // Fetch festival products
  fetchFestivalProducts: async (page = 1, limit = 10) => {
    set({ loadingFestivalProducts: true, festivalProductsError: null });
    try {
      const response = await getFestivalProducts(page, limit);
      set({
        festivalProducts: response.data.products,
        totalFestivalProducts: response.data.total,
        loadingFestivalProducts: false
      });
    } catch (error) {
      console.error('Error fetching festival products:', error);
      set({
        loadingFestivalProducts: false,
        festivalProductsError: error instanceof Error ? error.message : 'Failed to fetch festival products'
      });
    }
  },
  
  // Fetch best selling products
  fetchBestSellingProducts: async (page = 1, limit = 10) => {
    set({ loadingBestSellingProducts: true, bestSellingProductsError: null });
    try {
      const response = await getBestSellingProducts(page, limit);
      set({
        bestSellingProducts: response.data.products,
        totalBestSellingProducts: response.data.total,
        loadingBestSellingProducts: false
      });
    } catch (error) {
      console.error('Error fetching best selling products:', error);
      set({
        loadingBestSellingProducts: false,
        bestSellingProductsError: error instanceof Error ? error.message : 'Failed to fetch best selling products'
      });
    }
  },
  
  // Fetch hero banners
  fetchHeroBanners: async (limit = 5) => {
    set({ loadingHeroBanners: true, heroBannersError: null });
    try {
      const response = await getHeroBanners(limit);
      set({
        heroBanners: response.data.heroBanners,
        totalHeroBanners: response.data.total,
        loadingHeroBanners: false
      });
    } catch (error) {
      console.error('Error fetching hero banners:', error);
      set({
        loadingHeroBanners: false,
        heroBannersError: error instanceof Error ? error.message : 'Failed to fetch hero banners'
      });
    }
  },
  
  // Fetch also bought products
  fetchAlsoBoughtProducts: async (productId: string, page = 1, limit = 10) => {
    set({ loadingAlsoBoughtProducts: true, alsoBoughtProductsError: null });
    try {
      const response = await getAlsoBoughtProducts(productId, page, limit);
      set({
        alsoBoughtProducts: response.data.related,
        loadingAlsoBoughtProducts: false
      });
    } catch (error) {
      console.error('Error fetching also bought products:', error);
      set({
        loadingAlsoBoughtProducts: false,
        alsoBoughtProductsError: error instanceof Error ? error.message : 'Failed to fetch also bought products'
      });
    }
  },
  
  clearErrors: () => set({ 
    categoryError: null, 
    productError: null, 
    recentlyViewedError: null, 
    festivalProductsError: null,
    bestSellingProductsError: null,
    heroBannersError: null,
    alsoBoughtProductsError: null
  })
}));
