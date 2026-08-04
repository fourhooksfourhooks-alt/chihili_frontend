"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useHomeStore } from '@/store/homeStore';

export default function FashionCategories() {
  const router = useRouter();
  const { categories, loadingCategories, fetchCategories } = useHomeStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      setIsLoading(true);
      await fetchCategories(1, 5); // Get first 5 categories
      setIsLoading(false);
    };
    
    loadCategories();
  }, [fetchCategories]);

  const handleCategoryClick = (slug: string, name: string) => {
    router.push(`/categoryPage?slug=${slug}`);
  };

  return (
    <div className="w-full mx-auto px-4 md:px-20 py-16 md:py-32">
      {/* Mobile View (Horizontal Scroll) */}
      <div className="md:hidden overflow-x-auto pb-4 hide-scrollbar">
        <div className="flex gap-4 w-max">
          {categories.map((category) => (
            <div 
              key={category._id} 
              className="text-center cursor-pointer group w-50 flex-shrink-0"
              onClick={() => handleCategoryClick(category.slug, category.name)}
            >
              <div className="aspect-[3/4] mb-3 group-hover:opacity-90 transition-opacity">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xs tracking-[0.15em] text-gray-800 group-hover:text-gray-600 transition-colors">
                {category.name.toUpperCase()}
              </h3>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop View (Grid) */}
      <div className="hidden md:grid grid-cols-3 lg:grid-cols-5 gap-6 font-crimson-pro">
        {categories.map((category) => (
          <div 
            key={category._id} 
            className="text-center cursor-pointer group"
            onClick={() => handleCategoryClick(category.slug, category.name)}
          >
            <div className="aspect-[4/6] mb-4 group-hover:opacity-90 transition-opacity">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-sm tracking-[0.2em] text-gray-800 group-hover:text-gray-600 transition-colors">
              {category.name.toUpperCase()}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
}