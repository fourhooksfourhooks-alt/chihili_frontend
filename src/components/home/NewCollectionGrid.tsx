"use client";
import React, { useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useHomeStore } from '@/store/homeStore';
import { Product } from '@/api/home.api';

export default function NewCollectionGrid() {
  const router = useRouter();
  const { products, loadingProducts, fetchProducts } = useHomeStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      await fetchProducts(1, 8); // Get 8 products for the grid
      setIsLoading(false);
    };
    
    loadProducts();
  }, [fetchProducts]);

  const handleItemClick = (productId: string, productSlug: string) => {
    router.push(`/product-details/${productSlug}?id=${productId}`);
  };

  const handleViewCollection = () => {
    router.push(`/categoryPage`);
  };

  // Function to get a product image or fallback
  const getProductImage = (product: Product, index: number) => {
    if (product.images && product.images.length > 0) {
      return product.images[0];
    }
    // Fallback images
    const fallbackImages = ['/best1.jpg', '/best2.jpg', '/best3.jpg', '/best4.jpg', '/best5.jpg'];
    return fallbackImages[index % fallbackImages.length];
  };

  // If no products found
  if (products.length === 0) {
    return (
      <div className="min-h-screen bg-secondary1 p-4 sm:p-6 lg:p-8 w-full">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6 sm:mb-8 md:mb-12">
            <h1 className="text-xl sm:text-3xl font-light tracking-[0.3rem] sm:tracking-[0.4rem] text-secondary2 mb-10 font-crimson-pro">
              NEW COLLECTION
            </h1>
          </div>
          <div className="flex justify-center items-center h-40">
            <p>No products available at the moment.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary1 p-4 sm:p-6 lg:p-8 w-full">
      <div className="px-6 md:px-12">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 md:mb-12">
          <h1 className="text-xl sm:text-3xl font-light tracking-[0.3rem] sm:tracking-[0.4rem] text-secondary2  mb-10 font-crimson-pro">
            NEW COLLECTION
          </h1>
        </div>

        {/* Grid Layout */}
        <div className="mb-6 sm:mb-8 md:mb-12">
          {/* Top Section: Featured + 4 small items */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-3 sm:mb-4 md:mb-6">
            {/* Large featured item */}
            <div 
              className="group cursor-pointer"
              onClick={() => products[0] && handleItemClick(products[0]._id, products[0].slug)}
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-lg shadow-md sm:shadow-lg bg-white">
                <img
                  src={products[0] ? getProductImage(products[0], 0) : '/best1.jpg'}
                  alt={products[0]?.name || 'Product image'}
                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>

            {/* Right side - 4 small items */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6">
              {[1, 2, 3, 4].map((index) => (
                products[index] && (
                  <div 
                    key={products[index]._id} 
                    className="group cursor-pointer"
                    onClick={() => handleItemClick(products[index]._id, products[index].slug)}
                  >
                    <div className="relative aspect-[3/4] overflow-hidden rounded-lg shadow-md sm:shadow-lg bg-white">
                      <img
                        src={getProductImage(products[index], index)}
                        alt={products[index].name}
                        className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>

          {/* Bottom Section: 3 images */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {[5, 6, 7].map((index) => (
              products[index] && (
                <div 
                  key={products[index]._id} 
                  className={`group cursor-pointer ${index === 7 ? 'sm:col-span-2 lg:col-span-1' : ''}`}
                  onClick={() => handleItemClick(products[index]._id, products[index].slug)}
                >
                  <div className="relative aspect-[3/4] overflow-hidden rounded-lg shadow-md sm:shadow-lg bg-white">
                    <img
                      src={getProductImage(products[index], index)}
                      alt={products[index].name}
                      className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </div>
              )
            ))}
          </div>
        </div>

        {/* View Collection Button */}
        <div className="text-center">
          <button 
            onClick={handleViewCollection}
            className="group inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 border border-gray-800 sm:border-2 text-gray-800 font-medium tracking-wider hover:bg-gray-800 hover:text-white transition-all duration-300 transform hover:scale-105 cursor-pointer text-sm sm:text-base"
          >
            <span>View Collection</span>
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
}
