"use client";
import { create } from "zustand";
import { login, refresh, logout as apiLogout, getCurrentUser } from "@/api/auth.api";

export type AuthUser = {
  _id: string;
  mobile?: string;
  email?: string;
  firstname?: string;
  lastname?: string;
  name?: string;
  recentlyViewedProducts?: string[];
  role: string;
  loginType?: string;
  isEmailVerified?: boolean;
  isMobileVerified?: boolean;
  lastLogin?: string;
  loginAttempts?: number;
  isDeleted?: boolean;
  deletedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

type AuthState = {
  user: AuthUser | null;
  token: string | null; // short-lived access token
  isAuthenticated: boolean;
  loading: boolean;

  // actions
  setAuth: (user: AuthUser, token: string) => void;
  clearAuth: () => void;
  login: (identifier: string, password: string) => Promise<void>;
  refreshToken: () => Promise<void>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<void>;
  setLoading: (loading: boolean) => void;
};

export const useAuthStore = create<AuthState>()((set,get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,

  setAuth: (user, token) =>
    set({ user, token, isAuthenticated: Boolean(token) }),

  clearAuth: () =>
    set({ user: null, token: null, isAuthenticated: false }),

  setLoading: (loading) => set({ loading }),

  login: async (identifier, password) => {
    set({ loading: true });
    try {
      const payload = {
        identifier: identifier.includes("@") ? identifier : "91" + identifier,
        password,
      };

      // backend should return accessToken + set refreshToken in HttpOnly cookie
      const response = await login(payload);
      const { user, accessToken } = response.data.data;

      set({ user, token: accessToken, isAuthenticated: true });
    } finally {
      set({ loading: false });
    }
  },

  refreshToken: async () => {
    set({ loading: true });
    try {
      const response = await refresh(); // backend reads refresh cookie
      const { user, accessToken } = response.data.data;
      set({ user, token: accessToken, isAuthenticated: true });
      console.log('Token refreshed successfully');

      // Optionally fetch fresh user data from /me endpoint
      // This ensures we have the most up-to-date user information
        await get().getCurrentUser();
    } catch (error: any) {
      console.error('Token refresh failed:', error);
      set({ user: null, token: null, isAuthenticated: false });
      throw new Error('Token refresh failed');
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    await apiLogout(); // clears refresh cookie server-side
    set({ user: null, token: null, isAuthenticated: false });
  },

  getCurrentUser: async () => {
    set({ loading: true });
    try {
      console.log('Fetching current user from /auth/me...');
      const response = await getCurrentUser();
      console.log('Current user response:', response);
      const { user, cart, wishlist } = response.data.data;
      set({ user });

      // Set cart data
      const cartStore = require('./cartStore').useCartStore.getState();
      cartStore.setCart(cart);

      // Set wishlist IDs (since /me returns only IDs, not full items)
      const wishlistStore = require('./wishlistStore').useWishlistStore.getState();
      await wishlistStore.setWishlistIds(wishlist);
    } catch (error) {
      // If getting current user fails, clear auth state
      set({ user: null, token: null, isAuthenticated: false });
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));
