"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface CategoryHeaderProps {
  categorySlug: string | null;
  categories: Category[];
  total: number;
  productsCount: number;
  onBack: () => void;
  isMobile?: boolean;
}

const CategoryHeader: React.FC<CategoryHeaderProps> = ({
  categorySlug,
  categories,
  total,
  productsCount,
  onBack,
  isMobile = false,
}) => {
  if (!categorySlug || !categories.length) {
    return null;
  }

  const currentCategory = categories.find(cat => cat.slug === categorySlug);
  const categoryName = currentCategory?.name || categorySlug;

  if (isMobile) {
    return (
      <div className="mb-4">
        <button
          onClick={onBack}
          className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-3 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </button>
        <div className="flex items-center text-xs text-gray-600 mb-2">
          <span>Home</span>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">{categoryName}</span>
        </div>
        <h1 className="text-xl font-bold text-gray-900">{categoryName}</h1>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <button
        onClick={onBack}
        className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-3 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back
      </button>
      <div className="flex items-center text-sm text-gray-600 mb-2">
        <span>Home</span>
        <span className="mx-2">/</span>
        <span className="text-gray-900 font-medium">{categoryName}</span>
      </div>
    </div>
  );
};

export default CategoryHeader;
