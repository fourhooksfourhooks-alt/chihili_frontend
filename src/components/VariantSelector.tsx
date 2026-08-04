"use client";

import React, { useState, useEffect } from 'react';

// Type definitions
interface ProductVariant {
  attributes: {
    size: string;
    color: string;
  };
  sku: string;
  title?: string;
  price: number;
  mrp?: number;
  images?: string[];
  stock: number;
}

interface ColorGroup {
  color: string;
  variants: ProductVariant[];
}

interface VariantSelectorProps {
  variants: ProductVariant[];
  onSelectionChange?: (selectedVariant: ProductVariant | null) => void;
  className?: string;
}

const VariantSelector: React.FC<VariantSelectorProps> = ({ 
  variants, 
  onSelectionChange,
  className = ""
}) => {
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);

  // Group variants by color
  const colorGroups: ColorGroup[] = React.useMemo(() => {
    const grouped = variants.reduce((acc, variant) => {
      const color = variant.attributes.color;
      if (!acc[color]) {
        acc[color] = [];
      }
      acc[color].push(variant);
      return acc;
    }, {} as Record<string, ProductVariant[]>);

    const result = Object.entries(grouped).map(([color, variants]) => ({
      color,
      variants: variants.sort((a, b) => {
        // Sort sizes in a logical order (XS, S, M, L, XL, XXL)
        const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
        const aIndex = sizeOrder.indexOf(a.attributes.size);
        const bIndex = sizeOrder.indexOf(b.attributes.size);
        
        if (aIndex === -1 && bIndex === -1) return a.attributes.size.localeCompare(b.attributes.size);
        if (aIndex === -1) return 1;
        if (bIndex === -1) return -1;
        return aIndex - bIndex;
      })
    }));

    console.log('Color groups:', result);
    return result;
  }, [variants]);

  // Get available sizes for selected color
  const availableSizes = React.useMemo(() => {
    if (!selectedColor) return [];
    const colorGroup = colorGroups.find(group => group.color === selectedColor);
    console.log(`Available sizes for ${selectedColor}:`, colorGroup?.variants);
    return colorGroup?.variants || [];
  }, [selectedColor, colorGroups]);

  // Handle color selection
  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    setSelectedSize(""); // Reset size selection when color changes
    setSelectedVariant(null);
    
    // Auto-select the first available size for the new color
    const colorGroup = colorGroups.find(group => group.color === color);
    if (colorGroup && colorGroup.variants.length > 0) {
      // Find the first available (in stock) variant
      const firstAvailableVariant = colorGroup.variants.find(v => v.stock > 0);
      if (firstAvailableVariant) {
        setSelectedSize(firstAvailableVariant.attributes.size);
        setSelectedVariant(firstAvailableVariant);
      }
    }
  };

  // Handle size selection
  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
    
    // Find the selected variant
    const variant = availableSizes.find(v => v.attributes.size === size);
    setSelectedVariant(variant || null);
  };

  // Notify parent component of selection changes
  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(selectedVariant);
    }
  }, [selectedVariant, onSelectionChange]);

  // Format price for display
  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  if (!variants || variants.length === 0) {
    return <div className="text-gray-500">No variants available</div>;
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Debug Info */}
      <div className="bg-gray-100 p-3 rounded text-xs">
        <strong>Debug:</strong>
        <div>Total variants: {variants.length}</div>
        <div>Color groups: {colorGroups.map(g => `${g.color} (${g.variants.length})`).join(', ')}</div>
        <div>Selected color: {selectedColor || 'None'}</div>
        <div>Available sizes for selected color: {availableSizes.length}</div>
      </div>

      {/* Color Selection */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">
          Color {selectedColor && `(${selectedColor})`}
        </h3>
        <div className="flex flex-wrap gap-2">
          {colorGroups.map(({ color }) => (
            <button
              key={color}
              onClick={() => handleColorSelect(color)}
              className={`px-4 py-2 rounded-lg border transition-all duration-200 ${
                selectedColor === color
                  ? 'border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-500 ring-opacity-50'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'
              }`}
            >
              {color}
            </button>
          ))}
        </div>
      </div>

      {/* Size Selection */}
      {selectedColor && availableSizes.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">
            Size {selectedSize && `(${selectedSize})`}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {availableSizes.map((variant) => {
              const { size } = variant.attributes;
              const isSelected = selectedSize === size;
              const isOutOfStock = variant.stock === 0;
              
              return (
                <button
                  key={variant.sku}
                  onClick={() => !isOutOfStock && handleSizeSelect(size)}
                  disabled={isOutOfStock}
                  className={`p-3 rounded-lg border text-sm transition-all duration-200 ${
                    isOutOfStock
                      ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                      : isSelected
                      ? 'border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-500 ring-opacity-50'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                  }`}
                >
                  <div className="font-medium">{size}</div>
                  <div className={`text-xs mt-1 ${isOutOfStock ? 'text-gray-400' : 'text-gray-600'}`}>
                    {isOutOfStock ? 'Out of Stock' : formatPrice(variant.price)}
                  </div>
                  {!isOutOfStock && variant.stock <= 5 && (
                    <div className="text-xs text-orange-600 mt-1">
                      Only {variant.stock} left
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Selected Variant Info */}
      {selectedVariant && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-800">
                Selected: {selectedVariant.attributes.color} - {selectedVariant.attributes.size}
              </p>
              <p className="text-lg font-bold text-green-900">
                {formatPrice(selectedVariant.price)}
              </p>
              <p className="text-xs text-green-700">
                SKU: {selectedVariant.sku} | Stock: {selectedVariant.stock}
              </p>
            </div>
            <div className="text-green-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Reset Selection */}
      {(selectedColor || selectedSize) && (
        <button
          onClick={() => {
            setSelectedColor("");
            setSelectedSize("");
            setSelectedVariant(null);
          }}
          className="text-sm text-gray-500 hover:text-gray-700 underline"
        >
          Clear Selection
        </button>
      )}
    </div>
  );
};

export default VariantSelector;
