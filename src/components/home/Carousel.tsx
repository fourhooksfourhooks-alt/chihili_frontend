"use client";
import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { useHomeStore } from "@/store/homeStore";
import { useRouter } from "next/navigation";

const Carousel = () => {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  
  const { 
    heroBanners, 
    loadingHeroBanners, 
    fetchHeroBanners 
  } = useHomeStore();

  // Fetch hero banners on component mount
  useEffect(() => {
    fetchHeroBanners();
  }, [fetchHeroBanners]);

  // Fallback slides if API fails or while loading
  const fallbackSlides = [
    {
      _id: "1",
      image: "/carouselimg.jpg",
      title: "Wedding Collection",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Scelerisque duis ultrices sollicitudin aliquam sem.",
      buttonText: "Shop Now",
      buttonLink: "/categoryPage?category=wedding",
    },
    {
      _id: "2",
      image: "/carouselimg.jpg",
      title: "Festive Collection",
      description: "Discover our stunning range of festive wear designed for special occasions.",
      buttonText: "Explore Now",
      buttonLink: "/categoryPage?category=festive",
    },
    {
      _id: "3",
      image: "/carouselimg.jpg",
      title: "Bridal Elegance",
      description: "Step into elegance with our exclusive bridal collection. Traditional designs meet contemporary style.",
      buttonText: "View Collection",
      buttonLink: "/categoryPage?category=bridal",
    },
    {
      _id: "4",
      image: "/carouselimg.jpg",
      title: "Designer Sarees",
      description: "Handpicked designer sarees that celebrate the beauty of Indian craftsmanship.",
      buttonText: "Shop Sarees",
      buttonLink: "/categoryPage?category=sarees",
    },
  ];

  // Use API data if available, otherwise use fallback
  const slides = heroBanners && heroBanners.length > 0 
    ? heroBanners.map(banner => ({
        ...banner,
        description: banner.description || `Explore our exclusive ${banner.title} collection.`,
        buttonText: banner.buttonText || "Shop Now",
        buttonLink: banner.buttonLink || "/categoryPage"
      }))
    : fallbackSlides;

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  const handleMouseEnter = () => {
    setIsAutoPlaying(false);
  };

  const handleMouseLeave = () => {
    setIsAutoPlaying(true);
  };

  return (
    <div
      className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] xl:h-[800px] overflow-hidden bg-black"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Slides Container */}
      <div
        className="flex transition-transform duration-700 ease-in-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide) => (
          <div key={slide._id} className="min-w-full h-full relative">
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${slide.image})` }}
            />

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/10 bg-opacity-40 z-0" />

            {/* Content Overlay */}
            <div className="relative h-full flex items-center sm:items-end justify-center sm:justify-end px-4 sm:px-6 md:px-10 lg:px-16 xl:px-32 py-8 sm:py-12 md:py-16 lg:py-20 xl:py-24 z-10">
              <div className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-3 sm:mb-4 md:mb-5 lg:mb-6 leading-tight font-dancing-script">
                  {slide.title}
                </h1>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-200 mb-6 sm:mb-7 md:mb-8 lg:mb-9 xl:mb-10 leading-relaxed font-lato whitespace-pre-line">
                  {slide.description?.trim()}
                </p>
                <button 
                  onClick={() => slide.buttonLink && router.push(slide.buttonLink)}
                  className="group inline-flex items-center px-4 sm:px-5 md:px-6 lg:px-7 xl:px-8 py-2.5 sm:py-3 md:py-3.5 lg:py-4 bg-transparent border-2 border-white text-white font-medium text-sm sm:text-base md:text-lg hover:bg-white hover:text-black transition-all duration-300 transform hover:scale-105 font-lato"
                >
                  {slide.buttonText}
                  <ArrowRight className="ml-1.5 sm:ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-2 sm:left-3 md:left-4 lg:left-6 xl:left-8 top-1/2 transform -translate-y-1/2 hover:bg-black/50 bg-black bg-opacity-20 hover:bg-opacity-30 text-white p-2 sm:p-2.5 md:p-3 lg:p-3.5 xl:p-4 rounded-full transition-all duration-300 hover:scale-110"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 lg:h-7 lg:w-7 xl:h-8 xl:w-8" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-2 sm:right-3 md:right-4 lg:right-6 xl:right-8 top-1/2 transform -translate-y-1/2 hover:bg-black/50 bg-black bg-opacity-20 hover:bg-opacity-30 text-white p-2 sm:p-2.5 md:p-3 lg:p-3.5 xl:p-4 rounded-full transition-all duration-300 hover:scale-110"
        aria-label="Next slide"
      >
        <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 lg:h-7 lg:w-7 xl:h-8 xl:w-8" />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-4 sm:bottom-5 md:bottom-6 lg:bottom-7 xl:bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex space-x-2 sm:space-x-2.5 md:space-x-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "bg-white scale-125"
                  : "bg-white bg-opacity-50 hover:bg-opacity-75"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-0.5 sm:h-1 bg-white bg-opacity-20">
        <div
          className="h-full bg-white transition-all duration-300 ease-out"
          style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default Carousel;