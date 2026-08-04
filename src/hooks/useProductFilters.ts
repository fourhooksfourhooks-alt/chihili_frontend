import { useCallback } from 'react';
import type { ProductListParams } from "@/api/Product.api";
import { productStore } from "@/store/ProductStore";

export interface FilterOptions {
  categories: string[];
  colors: string[];
  priceRange: [number, number];
  discount: string;
  sortBy: string;
  searchQuery?: string;
}

interface UseProductFiltersOptions {
  allCategories?: any[];
  clearSearchOnCategory?: boolean;
  clearCategoryOnSearch?: boolean;
}

export const useProductFilters = (options: UseProductFiltersOptions = {}) => {
  const { allCategories = [], clearSearchOnCategory = false, clearCategoryOnSearch = false } = options;

  const applyFilters = useCallback(
    async (filters: FilterOptions) => {
      const params: ProductListParams = {
        page: 1,
        limit: 12,
        status: 'active',
        sortBy: filters.sortBy as any,
        minPrice: filters.priceRange[0],
        maxPrice: filters.priceRange[1],
      };

      // Add search query if provided, or explicitly clear it
      if (filters.searchQuery?.trim()) {
        params.search = filters.searchQuery.trim();
        // If clearCategoryOnSearch is true, don't add category filter when searching
        if (clearCategoryOnSearch) {
          params.category = undefined;
        }
      } else {
        params.search = undefined;
      }

      // Add category filter (use first selected category for now)
      if (filters.categories.length > 0 && !clearCategoryOnSearch) {
        const firstCategory = allCategories.find(cat => 
          filters.categories.includes(cat.name)
        );
        if (firstCategory) {
          params.category = firstCategory._id;
        }
        // If clearSearchOnCategory is true, don't add search when filtering by category
        if (clearSearchOnCategory) {
          params.search = undefined;
        }
      } else if (!filters.searchQuery?.trim()) {
        params.category = undefined;
      }

      // Add color filter (use first selected color)
      if (filters.colors.length > 0) {
        params.color = filters.colors[0];
      } else {
        params.color = undefined;
      }

      // Add discount filter
      const discountValue = parseInt(filters.discount.split("%")[0]);
      if (discountValue > 0) {
        params.minDiscount = discountValue;
      } else {
        params.minDiscount = undefined;
      }

      await productStore.fetch(params);
    },
    [allCategories, clearSearchOnCategory, clearCategoryOnSearch]
  );

  return { applyFilters };
};
