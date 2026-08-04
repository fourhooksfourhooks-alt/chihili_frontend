import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { categoryAPI, type Category } from '@/api/category.api';

interface CategoryState {
  // All categories cache
  allCategories: Category[];
  // Filtered/displayed categories
  categories: Category[];
  // Root categories (for navigation)
  rootCategories: Category[];
  // Current selected category
  currentCategory: Category | null;
  // Loading states
  loading: boolean;
  rootLoading: boolean;
  error: string | null;
  // Cache flags
  isInitialized: boolean;
  lastFetch: number | null;
}

interface CategoryActions {
  // Initialization
  initializeCategories: () => Promise<void>;
  
  // Fetch operations
  fetchAllCategories: (force?: boolean) => Promise<void>;
  fetchRootCategories: () => Promise<void>;
  fetchCategoryBySlug: (slug: string) => Promise<void>;
  fetchCategoryById: (id: string) => Promise<void>;
  getChildCategories: (parentId: string) => Promise<void>;
  searchCategories: (searchTerm: string) => Promise<void>;
  
  // Filter operations
  filterCategories: (predicate: (category: Category) => boolean) => void;
  resetCategoryFilter: () => void;
  
  // Utility operations
  clearError: () => void;
  clearCurrentCategory: () => void;
  reset: () => void;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useCategoryStore = create<CategoryState & CategoryActions>()(
  devtools(
    (set, get) => ({
      // Initial state
      allCategories: [],
      categories: [],
      rootCategories: [],
      currentCategory: null,
      loading: false,
      rootLoading: false,
      error: null,
      isInitialized: false,
      lastFetch: null,

      // ===== INITIALIZATION =====
      initializeCategories: async () => {
        const state = get();
        if (state.isInitialized && state.lastFetch && 
            Date.now() - state.lastFetch < CACHE_DURATION) {
          return; // Use cached data
        }
        
        // Load both root categories and all categories in parallel for better performance
        try {
          await Promise.all([
            get().fetchAllCategories(true),
            get().fetchRootCategories()
          ]);
          
          set({ isInitialized: true });
        } catch (error) {
          console.error('Failed to initialize categories:', error);
          // Still mark as initialized to prevent constant retries
          set({ 
            isInitialized: true,
            error: error instanceof Error ? error.message : 'Failed to initialize categories'
          });
        }
      },

      // ===== FETCH OPERATIONS =====
      fetchAllCategories: async (force = false) => {
        const state = get();
        
        if (!force && state.allCategories.length > 0 && 
            state.lastFetch && Date.now() - state.lastFetch < CACHE_DURATION) {
          set({ categories: state.allCategories });
          return;
        }

        set({ loading: true, error: null });
        try {
          const response = await categoryAPI.getAllCategories({
            isActive: true,
            limit: 100, // Get more categories for clothing
            sort: 'name'
          });
          
          const categories = response.data.categories;
          
          set({ 
            allCategories: categories,
            categories: categories,
            loading: false,
            lastFetch: Date.now()
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch categories',
            loading: false 
          });
        }
      },

      fetchRootCategories: async () => {
        set({ rootLoading: true, error: null });
        try {
          const response = await categoryAPI.getRootCategories({
            isActive: true,
            sort: 'name'
          });
          
          set({ 
            rootCategories: response.data.categories,
            rootLoading: false 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch root categories',
            rootLoading: false 
          });
        }
      },

      fetchCategoryBySlug: async (slug: string) => {
        set({ loading: true, error: null });
        try {
          const response = await categoryAPI.getCategoryBySlug(slug);
          set({ 
            currentCategory: response.data.category,
            loading: false 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch category',
            loading: false 
          });
        }
      },

      fetchCategoryById: async (id: string) => {
        // Try to find in cache first
        const cached = get().allCategories.find(cat => cat._id === id);
        if (cached) {
          set({ currentCategory: cached });
          return;
        }

        set({ loading: true, error: null });
        try {
          const response = await categoryAPI.getCategoryById(id);
          set({ 
            currentCategory: response.data.category,
            loading: false 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch category',
            loading: false 
          });
        }
      },

      getChildCategories: async (parentId: string) => {
        set({ loading: true, error: null });
        try {
          const response = await categoryAPI.getChildCategories(parentId);
          set({ 
            categories: response.data.categories,
            loading: false 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch child categories',
            loading: false 
          });
        }
      },

      searchCategories: async (searchTerm: string) => {
        if (!searchTerm.trim()) {
          set({ categories: get().allCategories });
          return;
        }

        set({ loading: true, error: null });
        try {
          const response = await categoryAPI.searchCategories(searchTerm, {
            isActive: true
          });
          set({ 
            categories: response.data.categories,
            loading: false 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to search categories',
            loading: false 
          });
        }
      },

      // ===== FILTER OPERATIONS =====
      filterCategories: (predicate: (category: Category) => boolean) => {
        const filteredCategories = get().allCategories.filter(predicate);
        set({ categories: filteredCategories });
      },

      resetCategoryFilter: () => {
        set({ categories: get().allCategories });
      },

      // ===== UTILITY OPERATIONS =====
      clearError: () => set({ error: null }),

      clearCurrentCategory: () => set({ currentCategory: null }),

      reset: () => set({
        allCategories: [],
        categories: [],
        rootCategories: [],
        currentCategory: null,
        loading: false,
        rootLoading: false,
        error: null,
        isInitialized: false,
        lastFetch: null
      }),
    }),
    { name: 'category-store' }
  )
);

// ===== OPTIMIZED SELECTORS =====

// State selectors
export const useCategories = () => useCategoryStore((state) => state.categories);
export const useAllCategories = () => useCategoryStore((state) => state.allCategories);
export const useRootCategories = () => useCategoryStore((state) => state.rootCategories);
export const useCurrentCategory = () => useCategoryStore((state) => state.currentCategory);
export const useCategoryLoading = () => useCategoryStore((state) => state.loading);
export const useRootCategoryLoading = () => useCategoryStore((state) => state.rootLoading);
export const useCategoryError = () => useCategoryStore((state) => state.error);
export const useCategoryInitialized = () => useCategoryStore((state) => state.isInitialized);

// Action selectors - Direct access for better performance
export const categoryStore = {
  // Initialization
  initialize: () => useCategoryStore.getState().initializeCategories(),
  
  // Fetch operations
  fetchAll: (force?: boolean) => useCategoryStore.getState().fetchAllCategories(force),
  fetchRoots: () => useCategoryStore.getState().fetchRootCategories(),
  fetchBySlug: (slug: string) => useCategoryStore.getState().fetchCategoryBySlug(slug),
  fetchById: (id: string) => useCategoryStore.getState().fetchCategoryById(id),
  getChildren: (parentId: string) => useCategoryStore.getState().getChildCategories(parentId),
  search: (term: string) => useCategoryStore.getState().searchCategories(term),
  
  // Filter operations
  filter: (predicate: (category: Category) => boolean) => useCategoryStore.getState().filterCategories(predicate),
  resetFilter: () => useCategoryStore.getState().resetCategoryFilter(),
  
  // Utility operations
  clearError: () => useCategoryStore.getState().clearError(),
  clearCurrent: () => useCategoryStore.getState().clearCurrentCategory(),
  reset: () => useCategoryStore.getState().reset(),
  
  // Computed getters
  getState: () => useCategoryStore.getState(),
  getCategoryById: (id: string) => useCategoryStore.getState().allCategories.find(cat => cat._id === id),
  getCategoryBySlug: (slug: string) => useCategoryStore.getState().allCategories.find(cat => cat.slug === slug),
  getCategoryByName: (name: string) => useCategoryStore.getState().allCategories.find(cat => cat.name.toLowerCase() === name.toLowerCase()),
};

// Legacy selectors for backward compatibility (deprecated - use categoryStore object instead)
export const useFetchCategories = () => useCategoryStore((state) => state.fetchAllCategories);
export const useFetchCategoryBySlug = () => useCategoryStore((state) => state.fetchCategoryBySlug);
export const useFetchCategoryById = () => useCategoryStore((state) => state.fetchCategoryById);
export const useFetchRootCategories = () => useCategoryStore((state) => state.fetchRootCategories);
export const useGetChildCategories = () => useCategoryStore((state) => state.getChildCategories);
export const useSearchCategories = () => useCategoryStore((state) => state.searchCategories);
export const useClearError = () => useCategoryStore((state) => state.clearError);
export const useClearCurrentCategory = () => useCategoryStore((state) => state.clearCurrentCategory);

export default useCategoryStore;