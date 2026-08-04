import { create } from "zustand";
import * as addressApi from "../api/address.api";
import type { Address } from "../api/address.api";

interface AddressState {
  addresses: Address[];
  loading: boolean;
  error: string | null;
  fetchAddresses: () => Promise<void>;
  addAddress: (data: Address) => Promise<void>;
  updateAddress: (addressId: string, data: Partial<Address>) => Promise<void>;
  deleteAddress: (addressId: string) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useAddressStore = create<AddressState>((set, get) => ({
  addresses: [],
  loading: false,
  error: null,

  fetchAddresses: async () => {
    set({ loading: true, error: null });
    try {
      const res = await addressApi.getAllAddresses();
      set({ addresses: res.data.addresses.addresses, loading: false });
    } catch (err: any) {
      set({ error: err?.response?.data?.message || "Failed to fetch addresses", loading: false });
    }
  },

  addAddress: async (data: Address) => {
    set({ loading: true, error: null });
    try {
      await addressApi.addAddress(data);
      await get().fetchAddresses();
    } catch (err: any) {
      set({ error: err?.response?.data?.message || "Failed to add address", loading: false });
    }
  },

  updateAddress: async (addressId: string, data: Partial<Address>) => {
    set({ loading: true, error: null });
    try {
      await addressApi.updateAddress(addressId, data);
      await get().fetchAddresses();
    } catch (err: any) {
      set({ error: err?.response?.data?.message || "Failed to update address", loading: false });
    }
  },

  deleteAddress: async (addressId: string) => {
    set({ loading: true, error: null });
    try {
      await addressApi.deleteAddress(addressId);
      await get().fetchAddresses();
    } catch (err: any) {
      set({ error: err?.response?.data?.message || "Failed to delete address", loading: false });
    }
  },

  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: string | null) => set({ error }),
}));
