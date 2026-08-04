import { create } from 'zustand';
import { addToWishlist, removeFromWishlist, getWishlist } from '@/api/wishlist.api';

interface WishlistItem {
  _id: string;
  name: string;
  slug: string;
  shortDescription: string;
  images: string[];
  variants: Array<{
    sku: string;
    title: string;
    price: number;
    mrp: number;
    images: string[];
    stock: number;
  }>;
}

interface WishlistStore {
  items: WishlistItem[];
  itemIds: string[]; // Array of product IDs from /auth/me
  error: string | null;
  fetchWishlist: () => Promise<void>;
  addItem: (productId: string) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  setWishlistItems: (items: WishlistItem[]) => void;
  setWishlistIds: (ids: string[]) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistStore>((set, get) => ({
  items: [],
  itemIds: [],
  error: null,

  fetchWishlist: async () => {
    try {
      set({ error: null });
      const response = await getWishlist();
      if (response.success) {
        const wishlistItems = response.data.items || [];
        set({ 
          items: wishlistItems,
          itemIds: wishlistItems.map((item: WishlistItem) => item._id) || []
        });
      }
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch wishlist' });
    }
  },

  addItem: async (productId: string) => {
    // Optimistic update - immediately add to UI
    const previousItemIds = get().itemIds || []; // Ensure previousItemIds is always an array
    const isAlreadyInWishlist = previousItemIds.includes(productId);
    
    if (isAlreadyInWishlist) {
      return; // Already in wishlist, no need to add
    }

    // Optimistically update UI
    set((state) => ({ 
      itemIds: [...state.itemIds, productId],
      error: null 
    }));

    try {
      const response = await addToWishlist(productId);
      
      if (response.success) {
        // Sync with server response - server returns array of product IDs
        const wishlistItemIds = response.data.items || [];
        set({ 
          itemIds: wishlistItemIds
        });
      } else {
        // Rollback optimistic update
        set({ 
          itemIds: previousItemIds,
          error: response.message || 'Failed to add item to wishlist'
        });
        throw new Error(response.message || 'Failed to add item to wishlist');
      }
    } catch (error: any) {
      // Rollback optimistic update
      set({ 
        itemIds: previousItemIds,
        error: error.message || 'Failed to add item to wishlist' 
      });
      throw error; // Re-throw so component can handle
    }
  },

  removeItem: async (productId: string) => {
    // Optimistic update - immediately remove from UI
    const previousItemIds = get().itemIds || []; // Ensure previousItemIds is always an array
    const isInWishlist = previousItemIds.includes(productId);
    
    if (!isInWishlist) {
      return; // Not in wishlist, no need to remove
    }

    // Optimistically update UI
    set((state) => ({ 
      itemIds: state.itemIds.filter(id => id !== productId),
      error: null 
    }));

    try {
      const response = await removeFromWishlist(productId);
      
      if (response.success) {
        // Sync with server response - server returns array of product IDs
        const wishlistItemIds = response.data.items || [];
        set({ 
          itemIds: wishlistItemIds
        });
      } else {
        // Rollback optimistic update
        set({ 
          itemIds: previousItemIds,
          error: response.message || 'Failed to remove item from wishlist'
        });
        throw new Error(response.message || 'Failed to remove item from wishlist');
      }
    } catch (error: any) {
      // Rollback optimistic update
      set({ 
        itemIds: previousItemIds,
        error: error.message || 'Failed to remove item from wishlist' 
      });
      throw error; // Re-throw so component can handle
    }
  },

  setWishlistItems: (items: WishlistItem[]) => {
    set({ 
      items,
      itemIds: items.map(item => item._id) || [] // Ensure itemIds is always an array
    });
  },

  setWishlistIds: async (ids: string[]) => {
    set({ itemIds: ids || [] }); // Ensure itemIds is always an array
    // If we only have IDs and need full items, we should fetch them
    if ((ids || []).length > 0 && get().items.length === 0) {
      try {
        await get().fetchWishlist();
      } catch (error) {
        // Silent error handling for background fetch
      }
    }
  },

  isInWishlist: (productId: string) => {
    const itemIds = get().itemIds || []; // Ensure itemIds is always an array
    return itemIds.includes(productId);
  },
}));
