import axios from "./axiosInstance";

export interface Product {
  productId: {
    _id: string;
    name: string;
    images: string[];
    description?: string;
    slug: string;
  };
  quantity: number;
  price: number;
  _id: string;
}

export interface Address {
  _id: string;
  name?: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  zipCode: string;
  country: string;
  phone?: string;
  label?: string;
  landmark?: string;
}

export interface Order {
  _id: string;
  userId: string | {
    _id: string;
    mobile: string;
    firstname?: string;
    lastname?: string;
    role: string;
    loginType: string;
    isEmailVerified: boolean;
    isMobileVerified: boolean;
    lastLogin: string;
    recentlyViewedProducts?: string[];
  };
  address: Address;
  orderId: string;
  transactionId?: string;
  products: Product[];
  amount: number;
  currency: string;
  status: "PENDING" | "SUCCESS" | "FAILED" | "CANCELLED" | "COMPLETED";
  paymentUrl?: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface GetUserOrdersResponse {
  statusCode: number;
  data: {
    orders: Order[];
    pagination?: {
      currentPage: number;
      totalPages: number;
      totalOrders: number;
      limit: number;
    };
  };
  message: string;
  success: boolean;
}

export interface OrderDetailsResponse {
  statusCode: number;
  data: {
    order: Order;
  };
  message: string;
  success: boolean;
}

export interface GetUserOrdersParams {
  page?: number;
  limit?: number;
  status?: string;
}

export const getUserOrders = async (params?: GetUserOrdersParams): Promise<GetUserOrdersResponse> => {
  const response = await axios.get("/payment/getOrders", { params });
  return response.data;
};

export const getOrderDetails = async (orderId: string): Promise<OrderDetailsResponse> => {
  const response = await axios.get(`/payment/orderDetails/${orderId}`);
  return response.data;
};