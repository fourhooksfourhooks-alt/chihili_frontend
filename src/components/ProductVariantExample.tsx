"use client";

import React, { useState } from 'react';
import VariantSelector from './VariantSelector';

// Example usage component
const ProductVariantExample: React.FC = () => {
  const [selectedVariant, setSelectedVariant] = useState<any>(null);

  // Sample data from your API - Updated with your exact structure
  const sampleVariants = [
    {
      "attributes": {
        "size": "L",
        "color": "Golden Red"
      },
      "sku": "D8C86-GOL-L-875",
      "title": "BAN-GOLD-FREE",
      "price": 6499,
      "mrp": 7499,
      "images": [
        "https://chihili-bucket.s3.ap-south-1.amazonaws.com/dev/product-variants/1756992601828-DSC02065.JPG (1).jpg"
      ],
      "stock": 36
    },
    {
      "attributes": {
        "size": "M", 
        "color": "Blue"
      },
      "sku": "D8C86-BLU-M-537",
      "title": "BAN-Blue-FREE",
      "price": 5699,
      "mrp": 6999,
      "images": [
        "https://chihili-bucket.s3.ap-south-1.amazonaws.com/dev/product-variants/1757058633591-DSC02065.JPG (1).jpg",
        "https://chihili-bucket.s3.ap-south-1.amazonaws.com/dev/product-variants/1757058681950-3 (1).png"
      ],
      "stock": 10
    }
  ];

  const handleVariantChange = (variant: any) => {
    setSelectedVariant(variant);
    console.log('Selected variant:', variant);
  };

  const handleAddToCart = () => {
    if (selectedVariant) {
      console.log('Adding to cart:', {
        sku: selectedVariant.sku,
        price: selectedVariant.price,
        quantity: 1
      });
      alert(`Added ${selectedVariant.attributes.color} - ${selectedVariant.attributes.size} to cart!`);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">
        Product Variant Selection Example
      </h2>
      
      <VariantSelector 
        variants={sampleVariants}
        onSelectionChange={handleVariantChange}
      />

      {selectedVariant && (
        <div className="mt-6">
          <button
            onClick={handleAddToCart}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Add to Cart - {selectedVariant.attributes.color} {selectedVariant.attributes.size}
          </button>
        </div>
      )}

      {/* Debug info */}
      <div className="mt-6 p-3 bg-gray-100 rounded text-xs">
        <strong>Debug Info:</strong>
        <pre className="mt-2 text-gray-600">
          {JSON.stringify(selectedVariant, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default ProductVariantExample;
