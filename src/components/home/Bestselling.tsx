'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useHomeStore } from '@/store/homeStore';
import { useRouter } from 'next/navigation';

// Utility function to format price
const formatPrice = (price: number): string => {
  return `₹${price.toLocaleString('en-IN')}`;
};

const BestSellingCarousel = () => {
  const router = useRouter();
  const { bestSellingProducts, loadingBestSellingProducts, fetchBestSellingProducts } = useHomeStore();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch best selling products
  useEffect(() => {
    const loadBestSellingProducts = async () => {
      setIsLoading(true);
      await fetchBestSellingProducts(1, 10);
      setIsLoading(false);
    };
    
    loadBestSellingProducts();
  }, [fetchBestSellingProducts]);

  // Helper function to get product image
  const getProductImage = (product: any): string => {
    if (product.images && product.images.length > 0) {
      return product.images[0];
    }
    
    // Check if product has variants with images
    if (product.variants && product.variants.length > 0 && 
        product.variants[0].images && product.variants[0].images.length > 0) {
      return product.variants[0].images[0];
    }
    
    return '/best1.jpg'; // Fallback image
  };

  // Helper function to get product price
  // const getProductPrice = (product: any): string => {
  //   if (product.variants && product.variants.length > 0) {
  //     return formatPrice(product.variants[0].price);
  //   }
  //   return 'Price not available';
  // };

  // Navigate to product details page
  const handleProductClick = (productSlug: string) => {
    router.push(`/product-details/${productSlug}`);
  };

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  // Handle responsive items per view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerView(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2);
      } else {
        setItemsPerView(3);
      }
      setCurrentIndex(0); // Reset to first slide when changing view
    };

    handleResize(); // Set initial value
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = bestSellingProducts.length > 0 
    ? Math.max(0, bestSellingProducts.length - itemsPerView) 
    : 0;

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex >= maxIndex ? prevIndex : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? 0 : prevIndex - 1
    );
  };

  // Touch handlers
  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (touchStart === null || touchEnd === null) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
    
    setTouchStart(null);
    setTouchEnd(null);
  };

  const getItemWidth = () => {
    return `${100 / itemsPerView}%`;
  };

  const getTransform = () => {
    return `translateX(-${currentIndex * (100 / itemsPerView)}%)`;
  };

  return (
    <div className="w-full bg-secondary1 py-8 md:py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-xl sm:text-3xl font-light tracking-[0.3rem] sm:tracking-[0.4rem] text-secondary2  mb-10 font-crimson-pro">
            BEST SELLING
          </h1>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Arrows - Hidden on mobile */}
          <button
            onClick={prevSlide}
            disabled={currentIndex === 0}
            className={`hidden md:flex absolute left-2 lg:left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 lg:w-12 lg:h-12 rounded-full items-center justify-center transition-all duration-300 ${
              currentIndex === 0 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-black bg-opacity-70 hover:bg-opacity-90 text-white hover:scale-110'
            }`}
          >
            <ArrowLeft size={20} className="lg:w-6 lg:h-6" />
          </button>

          <button
            onClick={nextSlide}
            disabled={currentIndex >= maxIndex}
            className={`hidden md:flex absolute right-2 lg:right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 lg:w-12 lg:h-12 rounded-full items-center justify-center transition-all duration-300 ${
              currentIndex >= maxIndex 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-black bg-opacity-70 hover:bg-opacity-90 text-white hover:scale-110'
            }`}
          >
            <ArrowRight size={20} className="lg:w-6 lg:h-6" />
          </button>

          {/* Products Container */}
          <div 
            className="overflow-hidden md:mx-8 lg:mx-16"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: getTransform(),
              }}
            >
              {isLoading ? (
                // Show loading placeholders
                Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={`loading-${index}`}
                    className="flex-shrink-0 px-2 md:px-4"
                    style={{ width: getItemWidth() }}
                  >
                    <div className="transition-all duration-300 overflow-hidden group">
                      <div className="aspect-[3/4] relative overflow-hidden bg-gray-200 animate-pulse rounded-lg md:rounded-none">
                        <div className="w-full h-full"></div>
                      </div>
                      <div className="p-3 md:p-6 text-center">
                        <div className="h-4 bg-gray-200 animate-pulse rounded mb-2 w-24 mx-auto"></div>
                        <div className="h-3 bg-gray-200 animate-pulse rounded w-16 mx-auto"></div>
                      </div>
                    </div>
                  </div>
                ))
              ) : bestSellingProducts.length === 0 ? (
                // No products found
                <div className="w-full flex justify-center items-center py-10">
                  <p className="text-gray-500">No best selling products available</p>
                </div>
              ) : (
                // Render actual products
                bestSellingProducts.map((product) => (
                  <div
                    key={product._id}
                    className="flex-shrink-0 px-2 md:px-4 cursor-pointer"
                    style={{ width: getItemWidth() }}
                    onClick={() => handleProductClick(product.slug)}
                  >
                    <div className="transition-all duration-300 overflow-hidden group">
                      {/* Product Image */}
                      <div className="aspect-[3/4] relative overflow-hidden bg-gray-100 rounded-lg md:rounded-none">
                        <Image
                          src={getProductImage(product)}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="p-3 md:p-6 text-center">
                        <h3 className="text-base md:text-lg font-medium tracking-wide md:tracking-wider text-gray-800 mb-1 md:mb-2">
                          {product.name.toUpperCase()}
                        </h3>
                        <p className="text-sm md:text-base text-gray-600 font-light">
                          {/* {getProductPrice(product)} */}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Mobile swipe hint */}
          {!isLoading && bestSellingProducts.length > 0 && (
            <div className="md:hidden text-center mt-4">
              <p className="text-sm text-gray-500">← Swipe left or right →</p>
            </div>
          )}

          {/* Dots Indicator */}
          {!isLoading && bestSellingProducts.length > 0 && (
            <div className="flex justify-center mt-6 md:mt-8 space-x-2">
              {[...Array(maxIndex + 1)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'bg-red-600 scale-110'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Shop Now Button */}
        {!isLoading && bestSellingProducts.length > 0 && (
          <div className="text-center mt-8 md:mt-12">
            <button 
              className="border-2 border-gray-800 text-gray-800 px-6 md:px-8 py-2 md:py-3 text-sm md:text-base font-medium tracking-wider hover:bg-gray-800 hover:text-white transition-all duration-300 flex items-center mx-auto space-x-2 group"
              onClick={() => router.push('/products')}
            >
              <span>Shop Now</span>
              <ArrowRight
                size={16}
                className="md:w-5 md:h-5 group-hover:translate-x-1 transition-transform duration-300"
              />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BestSellingCarousel;