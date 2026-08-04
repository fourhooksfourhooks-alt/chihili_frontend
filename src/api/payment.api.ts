import axios from "./axiosInstance";

export interface InitiatePaymentRequest {
  cartId: string;
  addressId: string;
  couponCode?: string;
}

export interface Product {
  productId: string;
  quantity: number;
  price: number;
  _id: string;
}

export interface Payment {
  userId: string;
  address: string;
  orderId: string;
  transactionId: string;
  products: Product[];
  amount: number;
  currency: string;
  status: string;
  paymentUrl: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface InitiatePaymentResponse {
  statusCode: number;
  data: {
    payment: {
      paymentUrl: string;
      orderId: string;
      amount: number;
      coupon: string | null;
      payment: Payment;
    }
  };
  message: string;
  success: boolean;
}

export const initiatePayment = async (data: InitiatePaymentRequest): Promise<InitiatePaymentResponse> => {
  const response = await axios.post("/payment/initiatePayment", data);
  return response.data;
};

export const verifyPayment = async (params: { 
  orderId: string; 
  transactionId: string;
}): Promise<any> => {
  const response = await axios.get("/payment/verifyPayment", { params });
  return response.data;
};

export const getPaymentById = async (paymentId: string): Promise<any> => {
  const response = await axios.get(`/payment/${paymentId}`);
  return response.data;
};

export const getPaymentsByUser = async (params: {
  page?: number;
  limit?: number;
}): Promise<any> => {
  const response = await axios.get("/payment/user", { params });
  return response.data;
};

// Payment status response interface
export interface PaymentStatusResponse {
  statusCode: number;
  data: {
    status: string; // This is a string like "COMPLETED", not an object
    data: {
      orderId: string;
      state: string;
      amount: number;
      expireAt: number;
      paymentDetails: Array<{
        paymentMode: string;
        transactionId: string;
        timestamp: number;
        amount: number;
        state: string;
        splitInstruments: Array<{
          amount: number;
          rail: {
            type: string;
            utr: string;
            upiTransactionId: string;
            vpa: string;
          };
          instrument: {
            type: string;
            maskedAccountNumber: string;
            accountType: string;
            accountHolderName: string;
            ifsc: string;
          };
        }>;
      }>;
    };
    payment: Payment & {
      userId: {
        _id: string;
        email?: string;
        firstname?: string;
        lastname?: string;
        mobile?: string;
        role: string;
        loginType: string;
        isEmailVerified: boolean;
        isMobileVerified: boolean;
        lastLogin: string;
        loginAttempts: number;
        isDeleted: boolean;
        deletedAt: null | string;
        createdAt: string;
        updatedAt: string;
        __v: number;
        recentlyViewedProducts: string[];
      };
      paidAt?: string;
    };
  };
  message: string;
  success: boolean;
}

export const checkPaymentStatus = async (orderId: string): Promise<PaymentStatusResponse> => {
  const response = await axios.get(`/payment/checkPaymentStatus/${orderId}`);
  return response.data;
};
