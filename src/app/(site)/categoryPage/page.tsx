"use client";

import React, { useState, useMemo, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Filter,
  X,
} from "lucide-react";

// Components
import ProductCard from "@/components/ProductCard";
import FilterSidebar from "@/components/FilterSidebar";
import MobileFilterModal from "@/components/MobileFilterModal";
import MobileSortModal from "@/components/MobileSortModal";
import ChihiliLoader from "@/components/ChihiliLoader";

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

import type { ProductListParams } from "@/api/Product.api";
import { useProductFilters, type FilterOptions } from "@/hooks/useProductFilters";
import { usePageSpecificStore } from "@/hooks/usePageSpecificStore";

// Types for clothing-specific filters
interface ClothingFilters {
  categories: string[];
  colors: string[];
  priceRange: [number, number];
  discount: string;
  sortBy: string;
}

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

const CategoryPage = () => {
  return (
    <Suspense fallback={<CategoryPageSkeleton />}>
      <CategoryPageContent />
    </Suspense>
  );
};

// Loading skeleton component
const CategoryPageSkeleton = () => {
  return <ChihiliLoader message="Loading products..." />;
};

const CategoryPageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Filter states
  const [filters, setFilters] = useState<ClothingFilters>({
    categories: [],
    colors: [],
    priceRange: [1, 50000],
    discount: "0% and above",
    sortBy: "popularity",
  });

  // UI states
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [activeFilterTab, setActiveFilterTab] = useState("Categories");
  
  // Get slug from URL query params
  const categorySlug = searchParams.get('slug');

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
    clearSearchOnCategory: true // Clear search when filtering by category
  });

  // Page-specific store management
  usePageSpecificStore({ pageType: 'category' });

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
  
  // Apply filter when category slug changes
  useEffect(() => {
    if (categorySlug && categories.length > 0) {
      const selectedCategory = categories.find(cat => cat.slug === categorySlug);
      if (selectedCategory) {
        setFilters(prev => ({
          ...prev,
          categories: [selectedCategory.name],
        }));
        
        // Optionally switch to Categories tab
        setActiveFilterTab("Categories");
        
        // Show a visual indication that filters are active (for mobile)
        if (window.innerWidth < 1024) {
          // Show filters on mobile (commented out to prevent automatic opening which might be disruptive)
          // setShowFilters(true);
        }
      }
    } else if (!categorySlug) {
      // Clear category filter when no slug is provided
      setFilters(prev => ({
        ...prev,
        categories: [],
      }));
    }
  }, [categorySlug, categories]);

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
        const categoryName = typeof category === 'string' ? category : category.name;
        categoryCounts[categoryName] = (categoryCounts[categoryName] || 0) + 1;
      });

      // Color and size counts from variants
      product.variants.forEach((variant) => {
        if (variant.attributes.color && variant.stock > 0) {
          const color = variant.attributes.color;
          colorCounts[color] = (colorCounts[color] || 0) + 1;
        }
        if (variant.attributes.size && variant.stock > 0) {
          const size = variant.attributes.size;
          sizeCounts[size] = (sizeCounts[size] || 0) + 1;
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
      priceRange: [1, 50000],
      discount: "0% and above",
      sortBy: "popularity",
    });
  }, []);

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

  // Get active filter count for UI
  const activeFilterCount = useMemo(() => {
    return filters.categories.length + 
           filters.colors.length + 
           (filters.priceRange[0] !== 1 || filters.priceRange[1] !== 50000 ? 1 : 0) +
           (filters.discount !== "0% and above" ? 1 : 0);
  }, [filters]);

  return (
    <div className="min-h-screen bg-white">
      {/* Desktop Layout */}
      <div className="hidden lg:block my-8">
        <div className="px-12 mx-auto flex gap-6">
          {/* Desktop Sidebar */}
          <FilterSidebar
            filters={filters}
            categories={enhancedCategories}
            colors={enhancedColors}
            onCategoryChange={handleCategoryChange}
            onColorChange={handleColorChange}
            onPriceRangeChange={handlePriceRangeChange}
            onDiscountChange={handleDiscountChange}
            onClearAllFilters={clearAllFilters}
          />

          {/* Products Grid */}
          <div className="flex-1">
            {/* Category Header */}
            {categorySlug && categories.length > 0 && (
              <div className="mb-6">
                <button
                  onClick={handleBack}
                  className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-3 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back
                </button>
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <span>Home</span>
                  <span className="mx-2">/</span>
                  <span className="text-gray-900 font-medium">
                    {categories.find(cat => cat.slug === categorySlug)?.name || categorySlug}
                  </span>
                </div>
              </div>
            )}
            
            <div className="flex justify-between items-center mb-6">
              <div className="text-sm text-gray-600">
                Showing {products.length} of {total} products
                {categorySlug && (
                  <span className="ml-2 text-primary">
                    in {categories.find(cat => cat.slug === categorySlug)?.name || categorySlug}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-4">
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 text-sm"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onProductClick={handleProductClick}
                  isMobile={false}
                />
              ))}
            </div>

            {productLoading && (
              <div className="flex justify-center py-8">
                <ChihiliLoader size="sm" message="Loading more products..." />
              </div>
            )}

            {products.length === 0 && !productLoading && (
              <div className="text-center py-12">
                <p className="text-gray-500">No products found matching your filters.</p>
                <button
                  onClick={clearAllFilters}
                  className="mt-4 text-primary hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="block lg:hidden">
        <div className="p-4">
          {/* Mobile Category Header */}
          {categorySlug && categories.length > 0 && (
            <div className="mb-4">
              <button
                onClick={handleBack}
                className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-3 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back
              </button>
              <div className="flex items-center text-xs text-gray-600 mb-2">
                <span>Home</span>
                <span className="mx-2">/</span>
                <span className="text-gray-900 font-medium">
                  {categories.find(cat => cat.slug === categorySlug)?.name || categorySlug}
                </span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">
                {categories.find(cat => cat.slug === categorySlug)?.name || categorySlug}
              </h1>
            </div>
          )}
          
          <div className="mb-4 text-sm text-gray-600">
            Showing {products.length} of {total} products
            {categorySlug && (
              <span className="block text-primary text-xs mt-1">
                in {categories.find(cat => cat.slug === categorySlug)?.name || categorySlug}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-20">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onProductClick={handleProductClick}
                isMobile={true}
              />
            ))}
          </div>

          {products.length === 0 && !productLoading && (
            <div className="text-center py-12">
              <p className="text-gray-500">No products found.</p>
              <button
                onClick={clearAllFilters}
                className="mt-4 text-primary hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}

          {productLoading && (
            <div className="flex justify-center py-8">
              <ChihiliLoader size="sm" message="Loading more products..." />
            </div>
          )}
        </div>

        {/* Mobile Bottom Actions */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex space-x-3 z-40">
          <button
            onClick={() => setShowSort(true)}
            className="flex-1 text-sm flex items-center justify-center py-3 border border-gray-300 rounded font-medium text-gray-700"
          >
            <Filter className="w-4 h-4 mr-2" />
            SORT
          </button>
          <button
            onClick={() => setShowFilters(true)}
            className={`flex-1 text-sm flex items-center justify-center py-3 ${
              activeFilterCount > 0 ? "border border-primary text-primary" : "border border-gray-300 text-gray-700"
            } rounded font-medium`}
          >
            <Filter className="w-4 h-4 mr-2" />
            FILTER {activeFilterCount > 0 && `(${activeFilterCount})`}
          </button>
        </div>

        {/* Modals */}
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

export default CategoryPage;
