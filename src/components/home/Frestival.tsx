"use client";
import React, { useRef, useState, useEffect, useCallback } from "react";
import { useHomeStore } from "@/store/homeStore";
import { useRouter } from "next/navigation";

// Utility function to format price
const formatPrice = (price: number): string => {
  return `₹${price.toLocaleString('en-IN')}`;
};

export default function FeaturedProducts() {
  const router = useRouter();
  const { festivalProducts, loadingFestivalProducts, fetchFestivalProducts } = useHomeStore();
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch festival products when component mounts
  useEffect(() => {
    const loadFestivalProducts = async () => {
      setIsLoading(true);
      await fetchFestivalProducts(1, 10);
      setIsLoading(false);
    };
    
    loadFestivalProducts();
  }, [fetchFestivalProducts]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startData, setStartData] = useState({ x: 0, scrollLeft: 0, time: 0 });
  const [windowWidth, setWindowWidth] = useState(0);
  const animationRef = useRef<number>(0);
  const velocityTracker = useRef<
    Array<{ x: number; time: number; scrollLeft: number }>
  >([]);
  const isScrolling = useRef(false);
  
  // Handle product click to navigate to product details
  const handleProductClick = (productId: string, productSlug: string) => {
    router.push(`/product-details/${productSlug}?id=${productId}`);
  };

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

  // Track window size for responsive calculations
  useEffect(() => {
    const updateWindowSize = () => {
      setWindowWidth(window.innerWidth);
    };

    updateWindowSize();
    window.addEventListener("resize", updateWindowSize);
    return () => window.removeEventListener("resize", updateWindowSize);
  }, []);

  // Get responsive item width based on screen size
  const getItemWidth = useCallback(() => {
    if (windowWidth < 640) return 280 + 16; // mobile: 280px + gap
    if (windowWidth < 768) return 320 + 20; // sm: 320px + gap
    if (windowWidth < 1024) return 350 + 24; // md: 350px + gap
    return 400 + 32; // lg+: 400px + gap
  }, [windowWidth]);

  // Enhanced scroll snap - smooth snapping to nearest item
  const snapToNearestItem = useCallback(() => {
    if (!scrollRef.current) return;

    const container = scrollRef.current;
    const itemWidth = getItemWidth();
    const currentScroll = container.scrollLeft;
    const snapIndex = Math.round(currentScroll / itemWidth);
    const snapPosition = snapIndex * itemWidth;

    container.scrollTo({
      left: snapPosition,
      behavior: "smooth",
    });
  }, [getItemWidth]);

  // Start interaction (enhanced for touch)
  const handleStart = useCallback((clientX: number) => {
    if (!scrollRef.current) return;

    const container = scrollRef.current;
    const time = performance.now();

    setIsDragging(true);
    setStartData({
      x: clientX,
      scrollLeft: container.scrollLeft,
      time,
    });

    // Clear velocity tracking
    velocityTracker.current = [
      {
        x: clientX,
        time,
        scrollLeft: container.scrollLeft,
      },
    ];

    // Stop any ongoing animations
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    // Disable smooth scrolling during drag
    container.style.scrollSnapType = "none";
    container.style.scrollBehavior = "auto";
    isScrolling.current = false;
  }, []);

  // Handle movement with enhanced tracking
  const handleMove = useCallback(
    (clientX: number) => {
      if (!isDragging || !scrollRef.current) return;

      const container = scrollRef.current;
      const currentTime = performance.now();
      const deltaX = clientX - startData.x;
      const newScrollLeft = startData.scrollLeft - deltaX;

      // Smooth scroll update
      container.scrollLeft = newScrollLeft;

      // Track velocity with multiple data points
      velocityTracker.current.push({
        x: clientX,
        time: currentTime,
        scrollLeft: newScrollLeft,
      });

      // Keep only recent tracking data (last 150ms for better accuracy)
      velocityTracker.current = velocityTracker.current.filter(
        (point) => currentTime - point.time < 150
      );

      // Limit tracking points for performance
      if (velocityTracker.current.length > 10) {
        velocityTracker.current = velocityTracker.current.slice(-10);
      }
    },
    [isDragging, startData]
  );

  // Enhanced momentum scrolling with better physics
  const handleEnd = useCallback(() => {
    if (!isDragging || !scrollRef.current) return;

    setIsDragging(false);
    const container = scrollRef.current;

    // Calculate velocity from tracked points
    const now = performance.now();
    const recentPoints = velocityTracker.current.filter(
      (point) => now - point.time < 100
    );

    if (recentPoints.length >= 2) {
      const firstPoint = recentPoints[0];
      const lastPoint = recentPoints[recentPoints.length - 1];
      const timeDelta = lastPoint.time - firstPoint.time;

      if (timeDelta > 0) {
        // Calculate velocity in pixels per millisecond
        const velocity =
          (lastPoint.scrollLeft - firstPoint.scrollLeft) / timeDelta;

        // Apply momentum if velocity is significant (enhanced for mobile)
        const minVelocityThreshold = windowWidth < 768 ? 0.1 : 0.2;
        if (Math.abs(velocity) > minVelocityThreshold) {
          let currentVelocity = velocity * (windowWidth < 768 ? 12 : 16); // Less aggressive on mobile
          const friction = windowWidth < 768 ? 0.92 : 0.94; // More friction on mobile
          const minVelocity = 0.5;

          const momentumScroll = () => {
            if (Math.abs(currentVelocity) < minVelocity || !scrollRef.current) {
              // Snap to nearest item when momentum ends
              setTimeout(() => {
                if (scrollRef.current) {
                  scrollRef.current.style.scrollSnapType = "x mandatory";
                  scrollRef.current.style.scrollBehavior = "smooth";
                  snapToNearestItem();
                }
              }, 50);
              return;
            }

            scrollRef.current.scrollLeft += currentVelocity;
            currentVelocity *= friction;

            animationRef.current = requestAnimationFrame(momentumScroll);
          };

          momentumScroll();
        } else {
          // No significant momentum, snap immediately
          container.style.scrollSnapType = "x mandatory";
          container.style.scrollBehavior = "smooth";
          setTimeout(() => snapToNearestItem(), 100);
        }
      }
    } else {
      // No velocity data, just snap
      container.style.scrollSnapType = "x mandatory";
      container.style.scrollBehavior = "smooth";
      setTimeout(() => snapToNearestItem(), 100);
    }

    velocityTracker.current = [];
  }, [isDragging, snapToNearestItem, windowWidth]);

  // Mouse events with enhanced handling
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      handleStart(e.clientX);

      // Prevent text selection during drag
      document.body.style.userSelect = "none";
    },
    [handleStart]
  );

  // Enhanced touch events for mobile
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      // Don't prevent default to allow native scrolling behavior
      handleStart(e.touches[0].clientX);
    },
    [handleStart]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      // Only prevent default if actively dragging
      if (isDragging) {
        e.preventDefault();
      }
      handleMove(e.touches[0].clientX);
    },
    [handleMove, isDragging]
  );

  const handleTouchEnd = useCallback(() => {
    handleEnd();
  }, [handleEnd]);

  // Global mouse event listeners
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        e.preventDefault();
        handleMove(e.clientX);
      }
    };

    const handleMouseUp = () => {
      if (isDragging) {
        handleEnd();
        document.body.style.userSelect = ""; // Restore text selection
      }
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove, {
        passive: false,
      });
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("mouseleave", handleMouseUp);

      // Prevent default drag behavior on images
      document.addEventListener("dragstart", (e) => e.preventDefault());
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseUp);
      document.removeEventListener("dragstart", (e) => e.preventDefault());
      document.body.style.userSelect = "";
    };
  }, [isDragging, handleMove, handleEnd]);

  // Enhanced scroll listener for better snap behavior
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      if (isDragging) return;

      // Clear previous timeout
      clearTimeout(scrollTimeout);

      // Set new timeout to snap when scrolling stops (longer delay on mobile)
      const snapDelay = windowWidth < 768 ? 200 : 150;
      scrollTimeout = setTimeout(() => {
        if (!isDragging && container) {
          snapToNearestItem();
        }
      }, snapDelay);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      container.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [isDragging, snapToNearestItem, windowWidth]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Prevent context menu during drag
  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      if (isDragging) {
        e.preventDefault();
      }
    },
    [isDragging]
  );

  return (
    <section className="min-h-screen flex justify-around items-center bg-secondary py-12 sm:py-16 lg:py-24 relative overflow-hidden">
      {/* Flower Decoration - Responsive positioning */}
      <div className="absolute bottom-0 left-0 z-0 pointer-events-none">
        <img
          src="/flower.png"
          alt="Flower"
          className="w-auto h-[25vh] sm:h-[35vh] lg:h-[45vh] opacity-90 drop-shadow-2xl"
        />
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-16">
        <div className="flex flex-col items-center gap-6 sm:gap-8 lg:gap-12">
          {/* Top - Heading (Mobile first, then side by side on desktop) */}
          <div className="text-center lg:text-left relative z-10 lg:absolute lg:left-16 lg:top-1/2 lg:-translate-y-1/2 lg:w-1/4">
            {/* Festival Title Image - Responsive sizing */}
            <img
              src="/FestvalfavImg.png"
              alt="Festival Title"
              className="w-48 sm:w-56 lg:w-64 mx-auto lg:mx-0 mb-4 lg:mb-6 drop-shadow-lg"
            />
          </div>

          {/* Carousel - Full width on mobile, 3/4 width on desktop */}
          <div className="w-full lg:w-3/4 lg:ml-auto relative z-10">
            <div
              ref={scrollRef}
              className={` flex gap-4 sm:gap-5 md:gap-6 lg:gap-8 overflow-x-auto pb-4 sm:pb-5 lg:pb-6 transition-all duration-200 ease-out scroll-smooth touch-pan-x ${
                isDragging ? "cursor-grabbing" : "cursor-grab"
              }`}
              style={{
                scrollSnapType: "x mandatory",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                WebkitOverflowScrolling: "touch",
                scrollBehavior: "smooth",
                WebkitScrollSnapType: "x mandatory",
              }}
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onContextMenu={handleContextMenu}
            >
              {isLoading ? (
                // Loading placeholders
                Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={`loading-${index}`}
                    className="min-w-[280px] sm:min-w-[320px] md:min-w-[350px] lg:min-w-[400px] flex-shrink-0 select-none"
                    style={{
                      scrollSnapAlign: "start",
                      scrollSnapStop: "always",
                    }}
                  >
                    <div className="relative overflow-hidden rounded-lg sm:rounded-xl shadow-lg bg-gray-200 animate-pulse">
                      <div className="w-full h-64 sm:h-80 md:h-88 lg:h-96"></div>
                    </div>
                    <div className="py-4 sm:py-5 lg:py-6 px-2 sm:px-3">
                      <div className="h-6 bg-gray-200 animate-pulse rounded mb-2 sm:mb-3"></div>
                      <div className="h-4 w-20 bg-gray-200 animate-pulse rounded"></div>
                    </div>
                  </div>
                ))
              ) : festivalProducts.length === 0 ? (
                // No products found
                <div className="min-w-full flex justify-center items-center py-20">
                  <p className="text-gray-500">No festival products available</p>
                </div>
              ) : (
                // Render actual products
                festivalProducts.map((product, index) => (
                  <div
                    key={product._id}
                    className="min-w-[280px] sm:min-w-[320px] md:min-w-[350px] lg:min-w-[400px] flex-shrink-0 select-none"
                    style={{
                      scrollSnapAlign: "start",
                      scrollSnapStop: "always", // Force snapping to each item
                    }}
                  >
                    {/* Product Image - Responsive height */}
                    <div 
                      className="relative overflow-hidden rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl sm:hover:shadow-2xl transition-all duration-500 group cursor-pointer"
                      onClick={() => handleProductClick(product._id, product.slug)}
                    >
                      <img
                        src={getProductImage(product)}
                        alt={product.name}
                        className="w-full h-64 sm:h-80 md:h-88 lg:h-96 object-cover transition-all duration-700 group-hover:scale-105 sm:group-hover:scale-110"
                        draggable={false}
                        style={{
                          userSelect: "none",
                          WebkitUserSelect: "none",
                          MozUserSelect: "none",
                        }}
                      />

                    </div>

                    {/* Product Info - Responsive spacing and typography */}
                    <div className="py-4 sm:py-5 lg:py-6 px-2 sm:px-3">
                      <h3 className="text-base sm:text-lg lg:text-xl text-gray-900 mb-2 sm:mb-3 font-medium tracking-wide transition-colors duration-300 hover:text-gray-700 font-crimson-pro leading-tight">
                        {product.name.toUpperCase()}
                      </h3>
                      <span className="text-lg sm:text-xl text-gray-900 font-light tracking-wider font-lato">
                        {/* {getProductPrice(product)} */}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Enhanced gradient overlays - Responsive width */}
            <div className=" hidden sm:block absolute top-0 left-0 w-8 sm:w-4 lg:w-5 h-full bg-gradient-to-r from-secondary via-secondary/80 to-transparent pointer-events-none z-20 "></div>
            <div className=" hidden sm:block absolute top-0 right-0 w-8 sm:w-4 lg:w-5 h-full bg-gradient-to-l from-secondary via-secondary/80 to-transparent pointer-events-none z-20"></div>
          </div>
        </div>
      </div>

      {/* Scroll indicator for mobile */}
      {!isLoading && festivalProducts.length > 0 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30 sm:hidden">
          <div className="flex space-x-1">
            {festivalProducts.map((_, index) => (
              <div
                key={index}
                className="w-2 h-2 rounded-full bg-gray-400 opacity-60"
              ></div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
