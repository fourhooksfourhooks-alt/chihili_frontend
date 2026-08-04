import { useEffect } from 'react';
import { productStore } from '@/store/ProductStore';

interface UsePageSpecificStoreOptions {
  pageType: 'search' | 'category' | 'general';
  clearConflictingParams?: boolean;
}

/**
 * Hook to manage store state when navigating between different page types
 * Ensures that search and category filters don't conflict with each other
 */
export const usePageSpecificStore = ({ 
  pageType, 
  clearConflictingParams = true 
}: UsePageSpecificStoreOptions) => {
  
  useEffect(() => {
    if (!clearConflictingParams) return;
    
    const currentParams = productStore.getParams();
    
    switch (pageType) {
      case 'search':
        // When entering search page, clear category filters
        if (currentParams.category) {
          productStore.clearCategoryParams();
        }
        break;
        
      case 'category':
        // When entering category page, clear search filters
        if (currentParams.search) {
          productStore.clearSearchParams();
        }
        break;
        
      case 'general':
        // For general pages, we might want to clear all specific filters
        // but for now, let's keep them
        break;
    }
  }, [pageType, clearConflictingParams]);
};
