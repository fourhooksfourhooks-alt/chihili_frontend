"use client";

import React, { useState, useMemo, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ChevronDown,
  Search,
  Menu,
  ArrowLeft,
  Filter,
  X,
} from "lucide-react";

// Components
import ProductCard from "@/components/ProductCard";
import FilterSidebar from "@/components/FilterSidebar";
import MobileFilterModal from "@/components/MobileFilterModal";
import MobileSortModal from "@/components/MobileSortModal";

// Optimized store imports
import { useCategories, useCategoryLoading, categoryStore } from "@/store/CategoryStore";
import { 
  useProducts, 
  useProductsLoading, 
  useProductPage, 
  useProductTotalPages, 
  useProductTotal,
  productStore 
} from "@/store/ProductStore";
import { useAuthStore } from "@/store/authStore";

import { useProductFilters, type FilterOptions } from "@/hooks/useProductFilters";
import { usePageSpecificStore } from "@/hooks/usePageSpecificStore";

// Clothing-specific color options
const CLOTHING_COLORS = [
  { name: "White", color: "#FFFFFF", border: true },
  { name: "Black", color: "#000000", border: false },
  { name: "Maroon", color: "#800020", border: false },
  { name: "Green", color: "#22C55E", border: false },
  { name: "Red", color: "#EF4444", border: false },
  { name: "Yellow", color: "#EAB308", border: false },
  { name: "Blue", color: "#3B82F6", border: false },
  { name: "Pink", color: "#EC4899", border: false },
  { name: "Purple", color: "#8B5CF6", border: false },
  { name: "Orange", color: "#F97316", border: false },
] as const;

// Sort options
const SORT_OPTIONS = [
  { label: "Popularity", value: "popularity" },
  { label: "Price: Low to High", value: "lowToHigh" },
  { label: "Price: High to Low", value: "highToLow" },
  { label: "Newest", value: "newest" },
] as const;

const SearchPage = () => {
  return (
    <Suspense fallback={<SearchPageSkeleton />}>
      <SearchPageContent />
    </Suspense>
  );
};

// Loading skeleton component
const SearchPageSkeleton = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Search Header Skeleton */}
      <div className="bg-gray-50 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-3">
              <div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
          <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
      {/* Desktop Layout Skeleton */}
      <div className="hidden lg:block my-8">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            <div className="w-80 flex-shrink-0 space-y-4">
              <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-24 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="flex-1">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="h-80 bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Mobile Layout Skeleton */}
      <div className="block lg:hidden">
        <div className="p-4">
          <div className="h-10 bg-gray-200 rounded animate-pulse mb-4"></div>
          <div className="grid grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const SearchPageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get search query from URL
  const searchQuery = searchParams.get('q') || '';
  
  // Filter states
  const [filters, setFilters] = useState<FilterOptions>({
    categories: [],
    colors: [],
    priceRange: [100, 50000],
    discount: "0% and above",
    sortBy: "popularity",
    searchQuery,
  });

  // UI states
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [activeFilterTab, setActiveFilterTab] = useState("Categories");

  // Store data
  const categories = useCategories();
  const categoryLoading = useCategoryLoading();
  const products = useProducts();
  const productLoading = useProductsLoading();
  const page = useProductPage();
  const totalPages = useProductTotalPages();
  const total = useProductTotal();

  // Auth store
  const { isAuthenticated } = useAuthStore();

  // Product filters hook
  const { applyFilters } = useProductFilters({ 
    allCategories: categories,
    clearCategoryOnSearch: true // Clear category when searching
  });

  // Page-specific store management
  usePageSpecificStore({ pageType: 'search' });

  // Initialize stores on mount
  useEffect(() => {
    const initialize = async () => {
      await Promise.all([
        categoryStore.initialize(),
        productStore.initialize()
      ]);
    };
    initialize();
  }, []);
  
  // Update filters when search query changes from URL
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      searchQuery: searchQuery,
    }));
  }, [searchQuery]);

  // Calculate dynamic counts from current products
  const filterCounts = useMemo(() => {
    const categoryCounts: Record<string, number> = {};
    const colorCounts: Record<string, number> = {};
    const sizeCounts: Record<string, number> = {};

    products.forEach((product) => {
      // Category counts
      const productCategories = Array.isArray(product.categories) 
        ? product.categories 
        : [];
      
      productCategories.forEach((category) => {
        const categoryName = typeof category === 'string' ? category : category?.name;
        if (categoryName) {
          categoryCounts[categoryName] = (categoryCounts[categoryName] || 0) + 1;
        }
      });

      // Color and size counts from variants
      product.variants.forEach((variant) => {
        if (variant.attributes.color) {
          colorCounts[variant.attributes.color] = (colorCounts[variant.attributes.color] || 0) + 1;
        }
        if (variant.attributes.size) {
          sizeCounts[variant.attributes.size] = (sizeCounts[variant.attributes.size] || 0) + 1;
        }
      });
    });

    return { categoryCounts, colorCounts, sizeCounts };
  }, [products]);

  // Enhance categories with counts and selection state
  const enhancedCategories = useMemo(() => {
    return categories.map((category) => ({
      ...category,
      count: filterCounts.categoryCounts[category.name] || 0,
      selected: filters.categories.includes(category.name),
    }));
  }, [categories, filterCounts.categoryCounts, filters.categories]);

  // Enhance colors with counts and selection state
  const enhancedColors = useMemo(() => {
    return CLOTHING_COLORS.map((color) => ({
      ...color,
      count: filterCounts.colorCounts[color.name] || 0,
      selected: filters.colors.includes(color.name),
    }));
  }, [filterCounts.colorCounts, filters.colors]);

  // Apply filters when they change
  useEffect(() => {
    applyFilters(filters);
  }, [filters, applyFilters]);

  // Infinite scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 1000 &&
        !productLoading &&
        page < totalPages
      ) {
        // Use the existing loadMore method from store which handles pagination internally
        productStore.loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [productLoading, page, totalPages]);

  // Filter handlers
  const handleCategoryChange = useCallback((categoryName: string) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(categoryName)
        ? prev.categories.filter(cat => cat !== categoryName)
        : [...prev.categories, categoryName],
    }));
  }, []);

  const handleColorChange = useCallback((colorName: string) => {
    setFilters(prev => ({
      ...prev,
      colors: prev.colors.includes(colorName)
        ? prev.colors.filter(color => color !== colorName)
        : [...prev.colors, colorName],
    }));
  }, []);

  const handlePriceRangeChange = useCallback((type: "min" | "max", value: string) => {
    const newValue = parseInt(value);
    setFilters(prev => ({
      ...prev,
      priceRange: type === "min" 
        ? [newValue, prev.priceRange[1]]
        : [prev.priceRange[0], newValue] as [number, number],
    }));
  }, []);

  const handleSortChange = useCallback((sortValue: string) => {
    setFilters(prev => ({ ...prev, sortBy: sortValue }));
    setShowSort(false);
  }, []);

  const handleDiscountChange = useCallback((discountValue: string) => {
    setFilters(prev => ({ ...prev, discount: discountValue }));
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilters({
      categories: [],
      colors: [],
      priceRange: [100, 50000],
      discount: "0% and above",
      sortBy: "popularity",
      searchQuery, // Keep the search query
    });
  }, [searchQuery]);

  const handleProductClick = useCallback((productSlug: string) => {
    router.push(`/product-details/${productSlug}`);
  }, [router]);

  // Back button: go to previous page if available, otherwise go to home
  const handleBack = useCallback(() => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  }, [router]);

  // Get active filter count for UI (excluding search query)
  const activeFilterCount = useMemo(() => {
    return filters.categories.length + 
           filters.colors.length + 
           (filters.priceRange[0] !== 100 || filters.priceRange[1] !== 50000 ? 1 : 0) +
           (filters.discount !== "0% and above" ? 1 : 0);
  }, [filters]);

  return (
    <div className="min-h-screen bg-white">
      {/* Search Header */}
      <div className="bg-gray-50 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-3 text-sm text-gray-600">
              <button
                onClick={handleBack}
                aria-label="Go back"
                className="p-1 rounded-md hover:bg-gray-100"
              >
                <ArrowLeft className="h-5 w-5 text-gray-700" />
              </button>
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4" />
                <span>Search results for:</span>
                <span className="font-semibold text-gray-900">"{searchQuery}"</span>
              </div>
            </div>
          </div>
          {total !== undefined && (
            <div className="text-sm text-gray-500">
              {total} {total === 1 ? 'product' : 'products'} found
            </div>
          )}
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block my-8">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            {/* Filter Sidebar */}
            <div className="w-80 flex-shrink-0">
              <FilterSidebar
                categories={enhancedCategories}
                colors={enhancedColors}
                filters={filters}
                onCategoryChange={handleCategoryChange}
                onColorChange={handleColorChange}
                onPriceRangeChange={handlePriceRangeChange}
                onDiscountChange={handleDiscountChange}
                onClearAllFilters={clearAllFilters}
              />
            </div>

            {/* Products Grid */}
            <div className="flex-1">
              {/* Sort and Results Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="text-sm text-gray-600">
                  Showing {products.length} of {total} products
                </div>
                <div className="relative">
                  <button
                    onClick={() => setShowSort(!showSort)}
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50"
                  >
                    <span className="text-sm">
                      {SORT_OPTIONS.find(opt => opt.value === filters.sortBy)?.label}
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  {showSort && (
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                      {SORT_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => handleSortChange(option.value)}
                          className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                            filters.sortBy === option.value ? 'bg-gray-100 font-medium' : ''
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Products Grid */}
              {productLoading && products.length === 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {Array(12).fill(0).map((_, index) => (
                    <div key={index} className="animate-pulse">
                      <div className="bg-gray-200 aspect-square rounded-md mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  ))}
                </div>
              ) : products.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      onProductClick={handleProductClick}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                  <p className="text-gray-500 mb-4">
                    Try adjusting your search terms or filters to find what you're looking for.
                  </p>
                  <button
                    onClick={clearAllFilters}
                    className="bg-primary1 text-white px-6 py-2 rounded-md hover:bg-primary1/90"
                  >
                    Clear all filters
                  </button>
                </div>
              )}

              {/* Loading more indicator */}
              {productLoading && products.length > 0 && (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary1 mx-auto"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="block lg:hidden">
        {/* Mobile Header with Filters */}
        <div className="sticky top-[var(--navbar-height)] bg-white border-b border-gray-200 px-4 py-3 z-30">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowFilters(true)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md"
            >
              <Filter className="h-4 w-4" />
              <span className="text-sm">Filters</span>
              {activeFilterCount > 0 && (
                <span className="bg-primary1 text-white text-xs px-2 py-1 rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setShowSort(true)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md"
            >
              <span className="text-sm">Sort</span>
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Mobile Products Grid */}
        <div className="px-4 py-6">
          {productLoading && products.length === 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {Array(6).fill(0).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gray-200 aspect-square rounded-md mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onProductClick={handleProductClick}
                  isMobile={true}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500 mb-4 text-sm">
                Try adjusting your search terms or filters.
              </p>
              <button
                onClick={clearAllFilters}
                className="bg-primary1 text-white px-6 py-2 rounded-md hover:bg-primary1/90"
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* Loading more indicator */}
          {productLoading && products.length > 0 && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary1 mx-auto"></div>
            </div>
          )}
        </div>

        {/* Mobile Modals */}
        <MobileFilterModal
          showFilters={showFilters}
          activeFilterTab={activeFilterTab}
          filters={filters}
          categories={enhancedCategories}
          colors={enhancedColors}
          onShowFilters={setShowFilters}
          onActiveFilterTab={setActiveFilterTab}
          onCategoryChange={handleCategoryChange}
          onColorChange={handleColorChange}
          onPriceRangeChange={handlePriceRangeChange}
          onDiscountChange={handleDiscountChange}
          onClearAllFilters={clearAllFilters}
          productsCount={products.length}
        />
        <MobileSortModal
          showSort={showSort}
          currentSort={filters.sortBy}
          onShowSort={setShowSort}
          onSortChange={handleSortChange}
        />
      </div>
    </div>
  );
};

export default SearchPage;
