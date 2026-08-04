import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import * as paymentApi from '../api/payment.api';
import type { InitiatePaymentRequest, Payment, PaymentStatusResponse } from '../api/payment.api';

interface PaymentState {
  // State
  paymentData: {
    paymentUrl: string;
    orderId: string;
    amount: number;
    coupon: string | null;
    payment: Payment | null;
  } | null;
  paymentStatus: PaymentStatusResponse['data'] | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  initiatePayment: (data: InitiatePaymentRequest) => Promise<string | null>;
  checkPaymentStatus: (orderId: string) => Promise<PaymentStatusResponse | null>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resetPayment: () => void;
}

export const usePaymentStore = create<PaymentState>()(
  devtools(
    (set) => ({
      // Initial state
      paymentData: null,
      paymentStatus: null,
      loading: false,
      error: null,

      // Actions
      initiatePayment: async (data: InitiatePaymentRequest) => {
        try {
          set({ loading: true, error: null });
          const response = await paymentApi.initiatePayment(data);
          
          if (!response.success) {
            throw new Error(response.message || 'Failed to initiate payment');
          }
          
          set({ 
            paymentData: response.data.payment,
            loading: false 
          });
          
          return response.data.payment.paymentUrl;
        } catch (error: any) {
          set({ 
            error: error.response?.data?.message || error.message || 'Failed to initiate payment', 
            loading: false 
          });
          return null;
        }
      },
      
      checkPaymentStatus: async (orderId: string) => {
        try {
          set({ loading: true, error: null });
          const response = await paymentApi.checkPaymentStatus(orderId);
          
          if (!response.success) {
            throw new Error(response.message || 'Failed to check payment status');
          }
          
          set({ 
            paymentStatus: response.data,
            loading: false 
          });
          
          return response;
        } catch (error: any) {
          set({ 
            error: error.response?.data?.message || error.message || 'Failed to check payment status', 
            loading: false 
          });
          return null;
        }
      },

      setLoading: (loading: boolean) => {
        set({ loading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      resetPayment: () => {
        set({ paymentData: null, paymentStatus: null, loading: false, error: null });
      },
    }),
    {
      name: 'payment-store',
    }
  )
);

// Selectors for better performance
export const usePaymentData = () => usePaymentStore((state) => state.paymentData);
export const usePaymentStatus = () => usePaymentStore((state) => state.paymentStatus);
export const usePaymentLoading = () => usePaymentStore((state) => state.loading);
export const usePaymentError = () => usePaymentStore((state) => state.error);

// Action selectors
export const usePaymentActions = () => {
  const store = usePaymentStore();
  return {
    initiatePayment: store.initiatePayment,
    checkPaymentStatus: store.checkPaymentStatus,
    resetPayment: store.resetPayment,
  };
};
