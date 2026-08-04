"use client";

import React from "react";
import { X } from "lucide-react";

const SORT_OPTIONS = [
  { label: "Popularity", value: "popularity" },
  { label: "Price: Low to High", value: "lowToHigh" },
  { label: "Price: High to Low", value: "highToLow" },
  { label: "Newest", value: "newest" },
] as const;

interface MobileSortModalProps {
  showSort: boolean;
  currentSort: string;
  onShowSort: (show: boolean) => void;
  onSortChange: (sortValue: string) => void;
}

const MobileSortModal: React.FC<MobileSortModalProps> = ({
  showSort,
  currentSort,
  onShowSort,
  onSortChange,
}) => {
  return (
    <div
      className={`fixed inset-0 z-50 transition-colors duration-200 ease-out ${
        showSort ? "bg-black/20" : "bg-transparent pointer-events-none"
      }`}
      onClick={() => onShowSort(false)}
    >
      <div
        className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-lg shadow-2xl transform transition-transform duration-300 ease-out will-change-transform ${
          showSort ? "translate-y-0" : "translate-y-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sort Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-center flex-1">Sort By</h3>
          <button
            onClick={() => onShowSort(false)}
            className="p-1"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        
        {/* Sort Options */}
        <div className="p-4">
          <div className="space-y-3">
            {SORT_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => onSortChange(option.value)}
                className={`w-full text-left py-3 px-4 rounded ${
                  currentSort === option.value
                    ? "bg-primary text-white"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileSortModal;
