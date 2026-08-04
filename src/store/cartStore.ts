import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import * as cartApi from '../api/cart.api';
import type { Cart, CartItem, CartSummary, AddToCartRequest, UpdateCartItemRequest } from '../api/cart.api';

// Helper function to compute cart summary
const computeCartSummary = (cart: Cart | null): CartSummary | null => {
  if (!cart) return null;
  const itemCount = cart.items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = cart.items.reduce((sum, i) => sum + i.priceAtAdd * i.quantity, 0);
  const discount = 0;
  const total = cart.totalPrice || subtotal - discount;
  return {
    itemCount,
    subtotal: +subtotal.toFixed(2),
    discount: +discount.toFixed(2),
    total: +total.toFixed(2),
    items: cart.items.length,
  };
};

interface CartState {
  // State
  cart: Cart | null;
  summary: CartSummary | null;
  saveForLater: any[];
  saveForLaterSummary: CartSummary | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchCart: () => Promise<void>;
  fetchUserCarts: (userId: string, page?: number, limit?: number) => Promise<void>;
  addToCart: (data: AddToCartRequest) => Promise<void>;
  updateCartItem: (productId: string, variantSku: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string, variantSku: string) => Promise<void>;
  clearCart: () => Promise<void>;
  fetchSaveForLater: () => Promise<void>;
  moveToSaveForLater: (productId: string, variantSku?: string) => Promise<void>;
  moveToCart: (productId: string, variantSku?: string) => Promise<void>;
  removeFromSaveForLater: (productId: string, variantSku?: string) => Promise<void>;
  clearSaveForLater: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resetCart: () => void;
  setCart: (cart: Cart | null) => void;
}

export const useCartStore = create<CartState>()(
  devtools(
    (set, get) => ({
      // Initial state
  cart: null,
  summary: null,
  saveForLater: [],
  saveForLaterSummary: null,
  loading: false,
  error: null,

      // Actions
      fetchCart: async () => {
          try {
            set({ loading: true, error: null });
            const user = require('./authStore').useAuthStore.getState().user;
            const userId = user?._id || '';
            const response = await cartApi.getAllCarts({ userId, page: 1, limit: 1 });
            if (!response.success) {
              throw new Error(response.message || 'Failed to fetch cart');
            }
            const firstCart = response.data.carts[0] || null;
            set({ 
              cart: firstCart,
              summary: computeCartSummary(firstCart),
              loading: false 
            });
          } catch (error: any) {
            set({ 
              error: error.response?.data?.message || 'Failed to fetch cart', 
              loading: false 
            });
          }
      },

        // Fetch save for later items
        fetchSaveForLater: async () => {
          try {
            set({ loading: true, error: null });
            const response = await cartApi.getSaveForLater();
            console.log('Fetched save for later items:', response);
            set({
              saveForLater: response.saveForLater || [],
              saveForLaterSummary: response.summary || null,
              loading: false
            });
          } catch (error: any) {
            set({
              error: error.response?.data?.message || 'Failed to fetch save for later items',
              loading: false
            });
          }
        },

        // Move item from cart to save for later
        moveToSaveForLater: async (productId: string, variantSku?: string) => {
          try {
            set({ loading: true, error: null });
            await cartApi.moveToSaveForLater(productId, variantSku);
            await get().fetchCart();
            await get().fetchSaveForLater();
            set({ loading: false });
          } catch (error: any) {
            set({
              error: error.response?.data?.message || 'Failed to move item to save for later',
              loading: false
            });
          }
        },

        // Move item from save for later to cart
        moveToCart: async (productId: string, variantSku?: string) => {
          try {
            set({ loading: true, error: null });
            await cartApi.moveToCart(productId, variantSku);
            await get().fetchCart();
            await get().fetchSaveForLater();
            set({ loading: false });
          } catch (error: any) {
            set({
              error: error.response?.data?.message || 'Failed to move item to cart',
              loading: false
            });
          }
        },

        // Remove item from save for later
        removeFromSaveForLater: async (productId: string, variantSku?: string) => {
          try {
            set({ loading: true, error: null });
            await cartApi.removeFromSaveForLater(productId, variantSku);
            await get().fetchSaveForLater();
            set({ loading: false });
          } catch (error: any) {
            set({
              error: error.response?.data?.message || 'Failed to remove item from save for later',
              loading: false
            });
          }
        },

        // Clear all save for later items
        clearSaveForLater: async () => {
          try {
            set({ loading: true, error: null });
            await cartApi.clearSaveForLater();
            await get().fetchSaveForLater();
            set({ loading: false });
          } catch (error: any) {
            set({
              error: error.response?.data?.message || 'Failed to clear save for later',
              loading: false
            });
          }
        },

      // Fetch carts by user via getAllCarts and select the first cart
      fetchUserCarts: async (userId: string, page = 1, limit = 10) => {
        try {
          set({ loading: true, error: null });
          const response = await cartApi.getAllCarts({ userId, page, limit });
          
          if (!response.success) {
            throw new Error(response.message || 'Failed to fetch carts');
          }
          
          const firstCart = response.data.carts[0] || null;

          // Derive summary if not provided
          const computeSummary = (cart: Cart | null): CartSummary | null => {
            if (!cart) return null;
            const itemCount = cart.items.reduce((sum, i) => sum + i.quantity, 0);
            const subtotal = cart.items.reduce((sum, i) => sum + i.priceAtAdd * i.quantity, 0);
            const discount = 0; // unknown here on this endpoint
            const total = cart.totalPrice || subtotal - discount;
            return {
              itemCount,
              subtotal: +subtotal.toFixed(2),
              discount: +discount.toFixed(2),
              total: +total.toFixed(2),
              items: cart.items.length,
            };
          };

          set({
            cart: firstCart,
            summary: computeSummary(firstCart),
            loading: false,
          });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Failed to fetch carts',
            loading: false,
          });
        }
      },

      addToCart: async (data: AddToCartRequest) => {
        try {
          set({ loading: true, error: null });
          await cartApi.addToCart(data);
          const user = require('./authStore').useAuthStore.getState().user;
          const userId = user?._id || '';
          const response = await cartApi.getAllCarts({ userId, page: 1, limit: 1 });
          if (!response.success) {
            throw new Error(response.message || 'Failed to fetch updated cart');
          }
          const firstCart = response.data.carts[0] || null;
          set({
            cart: firstCart,
            summary: computeCartSummary(firstCart),
            loading: false
          });
        } catch (error: any) {
          set({ 
            error: error.response?.data?.message || 'Failed to add item to cart', 
            loading: false 
          });
        }
      },

      updateCartItem: async (productId: string, variantSku: string, quantity: number) => {
        try {
          set({ loading: true, error: null });
          await cartApi.updateCartItem(productId, variantSku, { quantity });
          const user = require('./authStore').useAuthStore.getState().user;
          const userId = user?._id || '';
          const response = await cartApi.getAllCarts({ userId, page: 1, limit: 1 });
          if (!response.success) {
            throw new Error(response.message || 'Failed to fetch updated cart');
          }
          const firstCart = response.data.carts[0] || null;
          set({
            cart: firstCart,
            summary: computeCartSummary(firstCart),
            loading: false
          });
        } catch (error: any) {
          set({ 
            error: error.response?.data?.message || 'Failed to update cart item', 
            loading: false 
          });
        }
      },

      removeFromCart: async (productId: string, variantSku: string) => {
        try {
          set({ loading: true, error: null });
          await cartApi.removeFromCart(productId, variantSku);
          const user = require('./authStore').useAuthStore.getState().user;
          const userId = user?._id || '';
          const response = await cartApi.getAllCarts({ userId, page: 1, limit: 1 });
          if (!response.success) {
            throw new Error(response.message || 'Failed to fetch updated cart');
          }
          const firstCart = response.data.carts[0] || null;
          set({
            cart: firstCart,
            summary: computeCartSummary(firstCart),
            loading: false
          });
        } catch (error: any) {
          set({ 
            error: error.response?.data?.message || 'Failed to remove item from cart', 
            loading: false 
          });
        }
      },

      clearCart: async () => {
        try {
          set({ loading: true, error: null });
          await cartApi.clearCart();
          const user = require('./authStore').useAuthStore.getState().user;
          const userId = user?._id || '';
          const response = await cartApi.getAllCarts({ userId, page: 1, limit: 1 });
          if (!response.success) {
            throw new Error(response.message || 'Failed to fetch updated cart');
          }
          const firstCart = response.data.carts[0] || null;
          set({
            cart: firstCart,
            summary: computeCartSummary(firstCart),
            loading: false
          });
        } catch (error: any) {
          set({ 
            error: error.response?.data?.message || 'Failed to clear cart', 
            loading: false 
          });
        }
      },

      setLoading: (loading: boolean) => {
        set({ loading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      resetCart: () => {
        set({ cart: null, summary: null, loading: false, error: null });
      },

      setCart: (cart: Cart | null) => {
        set({ 
          cart, 
          summary: computeCartSummary(cart), 
          saveForLater: cart?.saveForLater || [] 
        });
      },
    }),
    {
      name: 'cart-store',
    }
  )
);

// Selectors for better performance
// Avoid creating a new array instance on every selector run to prevent SSR snapshot loops
const EMPTY_CART_ITEMS: ReadonlyArray<CartItem> = Object.freeze([] as CartItem[]);
// State selectors
export const useCartItems = () => useCartStore((state) => state.cart?.items ?? EMPTY_CART_ITEMS);
export const useSaveForLaterItems = () => useCartStore((state) => state.saveForLater ?? EMPTY_CART_ITEMS);
export const useSaveForLaterSummary = () => useCartStore((state) => state.saveForLaterSummary);
export const useCartSummary = () => useCartStore((state) => state.summary);
export const useCartLoading = () => useCartStore((state) => state.loading);
export const useCartError = () => useCartStore((state) => state.error);
export const useCartItemCount = () => useCartStore((state) => state.summary?.itemCount || 0);
export const useCartTotal = () => useCartStore((state) => state.summary?.total || 0);

// Action selectors
export const useCartActions = () => {
  const store = useCartStore();
  return {
    updateCartItem: store.updateCartItem,
    removeFromCart: store.removeFromCart,
    clearCart: store.clearCart,
    fetchUserCarts: store.fetchUserCarts,
  fetchSaveForLater: store.fetchSaveForLater,
  moveToSaveForLater: store.moveToSaveForLater,
  moveToCart: store.moveToCart,
  removeFromSaveForLater: store.removeFromSaveForLater,
  clearSaveForLater: store.clearSaveForLater,
  };
};

// Utility functions
export const useCartUtils = () => {
  const cart = useCartStore((state) => state.cart);
  
  const getItemQuantity = (productId: string, variantSku?: string) => {
    if (!cart?.items) return 0;
    
    const item = cart.items.find(item => {
      // Handle both string and object productId
      const itemProductId = typeof item.productId === 'string' 
        ? item.productId 
        : item.productId._id;
      
      const matches = itemProductId === productId && item.variantSku === variantSku;
      
      // Debug logging
      if (productId && variantSku) {
        console.log('Cart item check:', {
          itemProductId,
          targetProductId: productId,
          itemVariantSku: item.variantSku,
          targetVariantSku: variantSku,
          matches
        });
      }
      
      return matches;
    });
    return item?.quantity || 0;
  };

  const isItemInCart = (productId: string, variantSku?: string) => {
    return getItemQuantity(productId, variantSku) > 0;
  };

  return {
    getItemQuantity,
    isItemInCart,
  };
};
