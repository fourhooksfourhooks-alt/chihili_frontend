"use client";
import BestSellingCarousel from "@/components/home/Bestselling";
import Carousel from "@/components/home/Carousel";
import FashionCategories from "@/components/home/Categories";
import NewsletterFooter from "@/components/Footer";
import DraggableCarousel from "@/components/home/Frestival";
import NewCollectionGrid from "@/components/home/NewCollectionGrid";
import Poster from "@/components/home/Poster";
import RecentlyViewed from "@/components/home/RecentlyViewed";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import { auth } from "@/lib/FirebaseClient";
import { useAuthStore } from "@/store/authStore";
import { useEffect, useState, useRef } from "react";
import { useWishlistStore } from "@/store/wishlistStore";
import ChihiliLoader from "@/components/ChihiliLoader";
import { useHomeStore } from "@/store/homeStore";

export default function Home() {
  const [isPageReady, setIsPageReady] = useState(false);
  const loadingCheckInterval = useRef<NodeJS.Timeout | null>(null);
  
  const { 
    loadingHeroBanners, 
    loadingCategories, 
    loadingRecentlyViewed,
    loadingProducts,
    loadingBestSellingProducts,
    loadingFestivalProducts
  } = useHomeStore();

  useEffect(() => {
    // Check if all components have finished loading
    const checkAllLoaded = () => {
      const allLoaded = !loadingHeroBanners && 
                        !loadingCategories && 
                        !loadingRecentlyViewed && 
                        !loadingProducts && 
                        !loadingBestSellingProducts && 
                        !loadingFestivalProducts;
      
      if (allLoaded) {
        // Add a small delay to ensure smooth transition
        setTimeout(() => {
          setIsPageReady(true);
          if (loadingCheckInterval.current) {
            clearInterval(loadingCheckInterval.current);
          }
        }, 300);
      }
    };

    // Check immediately and then periodically
    checkAllLoaded();
    loadingCheckInterval.current = setInterval(checkAllLoaded, 100);

    // Fallback timeout to show page after 10 seconds even if something is still loading
    const fallbackTimer = setTimeout(() => {
      setIsPageReady(true);
      if (loadingCheckInterval.current) {
        clearInterval(loadingCheckInterval.current);
      }
    }, 10000);

    return () => {
      if (loadingCheckInterval.current) {
        clearInterval(loadingCheckInterval.current);
      }
      clearTimeout(fallbackTimer);
    };
  }, [loadingHeroBanners, loadingCategories, loadingRecentlyViewed, loadingProducts, loadingBestSellingProducts, loadingFestivalProducts]);

  if (!isPageReady) {
    return <ChihiliLoader message="Welcome to Chihili..." />;
  }

  return (
    <div className="">
      <Carousel />
      <FashionCategories />
      <RecentlyViewed />
      <NewCollectionGrid />
      <BestSellingCarousel />
      <DraggableCarousel />
      {/* <Poster /> */}
    </div>
  );
}
