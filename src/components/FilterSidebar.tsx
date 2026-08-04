"use client";

import React from "react";

interface ClothingFilters {
  categories: string[];
  colors: string[];
  priceRange: [number, number];
  discount: string;
  sortBy: string;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  count: number;
  selected: boolean;
}

interface Color {
  name: string;
  color: string;
  border?: boolean;
  count: number;
  selected: boolean;
}

const DISCOUNT_OPTIONS = [
  "0% and above",
  "10% and above", 
  "20% and above",
  "30% and above",
  "50% and above",
] as const;

interface FilterSidebarProps {
  filters: ClothingFilters;
  categories: Category[];
  colors: Color[];
  onCategoryChange: (categoryName: string) => void;
  onColorChange: (colorName: string) => void;
  onPriceRangeChange: (type: "min" | "max", value: string) => void;
  onDiscountChange: (discountValue: string) => void;
  onClearAllFilters: () => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  categories,
  colors,
  onCategoryChange,
  onColorChange,
  onPriceRangeChange,
  onDiscountChange,
  onClearAllFilters,
}) => {
  return (
    <div className="w-80 bg-white border border-gray-200 p-6 h-fit sticky top-40">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Filters</h2>
        <button
          onClick={onClearAllFilters}
          className="text-primary text-sm font-medium hover:underline"
        >
          Clear All
        </button>
      </div>

      {/* Categories */}
      <div className="mb-8">
        <h3 className="font-medium mb-4">Categories</h3>
        <div className="space-y-3 max-h-40 overflow-y-auto">
          {categories.map((category) => (
            <label
              key={category._id}
              className="flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={category.selected}
                  onChange={() => onCategoryChange(category.name)}
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <span className="ml-3 text-sm text-gray-700">
                  {category.name}
                </span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div className="mb-8">
        <h3 className="font-medium mb-4">Colors</h3>
        <div className="space-y-3 max-h-40 overflow-y-auto">
          {colors.map((color) => (
            <label
              key={color.name}
              className="flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={color.selected}
                  onChange={() => onColorChange(color.name)}
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <div className="flex items-center ml-3">
                  <div
                    className={`w-4 h-4 rounded-full mr-2 ${
                      color.border ? "border border-gray-300" : ""
                    }`}
                    style={{ backgroundColor: color.color }}
                  />
                  <span className="text-sm text-gray-700">{color.name}</span>
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-8">
        <h3 className="font-medium mb-4">
          Price Range: ₹{filters.priceRange[0]} - ₹{filters.priceRange[1]}
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Min Price</label>
            <input
              type="range"
              min="100"
              max="10000"
              value={filters.priceRange[0]}
              onChange={(e) => onPriceRangeChange("min", e.target.value)}
              className="w-full accent-primary"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Max Price</label>
            <input
              type="range"
              min="1000"
              max="50000"
              value={filters.priceRange[1]}
              onChange={(e) => onPriceRangeChange("max", e.target.value)}
              className="w-full accent-primary"
            />
          </div>
        </div>
      </div>

      {/* Discount */}
      <div className="mb-8">
        <h3 className="font-medium mb-4">Discount</h3>
        <div className="space-y-3">
          {DISCOUNT_OPTIONS.map((option) => (
            <label
              key={option}
              className="flex items-center cursor-pointer"
            >
              <input
                type="radio"
                name="discount"
                checked={filters.discount === option}
                onChange={() => onDiscountChange(option)}
                className="w-4 h-4 accent-primary border-gray-300 focus:ring-primary"
              />
              <span className="ml-3 text-sm text-gray-700">{option}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
