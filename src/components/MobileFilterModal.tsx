"use client";

import React from "react";
import { X } from "lucide-react";

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

interface MobileFilterModalProps {
  showFilters: boolean;
  activeFilterTab: string;
  filters: ClothingFilters;
  categories: Category[];
  colors: Color[];
  onShowFilters: (show: boolean) => void;
  onActiveFilterTab: (tab: string) => void;
  onCategoryChange: (categoryName: string) => void;
  onColorChange: (colorName: string) => void;
  onPriceRangeChange: (type: "min" | "max", value: string) => void;
  onDiscountChange: (discountValue: string) => void;
  onClearAllFilters: () => void;
  productsCount: number;
}

const MobileFilterModal: React.FC<MobileFilterModalProps> = ({
  showFilters,
  activeFilterTab,
  filters,
  categories,
  colors,
  onShowFilters,
  onActiveFilterTab,
  onCategoryChange,
  onColorChange,
  onPriceRangeChange,
  onDiscountChange,
  onClearAllFilters,
  productsCount,
}) => {
  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-200 ease-out ${
        showFilters ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={() => onShowFilters(false)}
    >
      <div
        className={`fixed inset-y-0 right-0 w-full bg-white flex flex-col transform transition-transform duration-300 ease-out will-change-transform ${
          showFilters ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Filter Header */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-200">
          <div className="flex items-center">
            <button
              onClick={() => onShowFilters(false)}
              className="mr-3 p-1"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
            <h3 className="text-base font-semibold text-gray-900">FILTERS</h3>
          </div>
          <button
            onClick={onClearAllFilters}
            className="text-primary font-medium text-sm"
          >
            CLEAR ALL
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex border-b border-gray-200">
          {["Categories", "Colors", "Price", "Discount"].map((tab) => (
            <button
              key={tab}
              onClick={() => onActiveFilterTab(tab)}
              className={`flex-1 py-3 px-2 text-xs font-medium ${
                activeFilterTab === tab
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Filter Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeFilterTab === "Categories" && (
            <div className="space-y-3">
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
                  <span className="text-xs text-gray-500">({category.count})</span>
                </label>
              ))}
            </div>
          )}

          {activeFilterTab === "Colors" && (
            <div className="space-y-3">
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
                  <span className="text-xs text-gray-500">({color.count})</span>
                </label>
              ))}
            </div>
          )}

          {activeFilterTab === "Price" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range: ₹{filters.priceRange[0]} - ₹{filters.priceRange[1]}
                </label>
                <div className="space-y-3">
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
            </div>
          )}

          {activeFilterTab === "Discount" && (
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
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 flex space-x-3">
          <button
            onClick={() => onShowFilters(false)}
            className="flex-1 py-3 px-4 font-medium text-gray-700 text-sm border border-gray-300 rounded"
          >
            CLOSE
          </button>
          <button
            onClick={() => onShowFilters(false)}
            className="flex-1 py-3 px-4 bg-primary text-white rounded font-medium text-sm"
          >
            APPLY ({productsCount})
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileFilterModal;
