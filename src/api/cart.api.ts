import axios from "./axiosInstance";

// Types for cart API
export interface ProductRef {
  _id: string;
  name?: string;
  slug?: string;
  images?: string[];
  price?: number;
  variants?: any;
}

export interface CartItem {
  productId: string | ProductRef;
  variantSku?: string;
  quantity: number;
  priceAtAdd: number;
  vendorId: string;
}

export interface CartSummary {
  itemCount: number;
  subtotal: number;
  discount: number;
  total: number;
  items: number;
}

export interface Cart {
  _id: string;
  userId: string;
  items: CartItem[];
  saveForLater?: any[];
  createdAt: string;
  updatedAt: string;
  totalPrice?: number;
}

export interface CartResponse {
  cart: Cart;
  summary: CartSummary;
}

export interface AddToCartRequest {
  productId: string;
  variantSku?: string;
  quantity?: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

// Get user's cart
export const getUserCart = async (): Promise<CartResponse> => {
  const response = await axios.get("/cart/getCart");
  return response.data;
};

// Add item to cart
export const addToCart = async (data: AddToCartRequest): Promise<Cart> => {
  const response = await axios.post("/cart/addToCart", data);
  return response.data;
};

// Update cart item quantity
export const updateCartItem = async (
  productId: string,
  variantSku: string,
  data: UpdateCartItemRequest
): Promise<CartResponse> => {
  const response = await axios.put(`/cart/update/${productId}/${variantSku}`, data);
  return response.data;
};

// Remove item from cart
export const removeFromCart = async (
  productId: string,
  variantSku: string
): Promise<CartResponse> => {
  const response = await axios.delete(`/cart/remove/${productId}/${variantSku}`);
  return response.data;
};

// Clear entire cart
export const clearCart = async (): Promise<CartResponse> => {
  const response = await axios.delete(`/cart/clear`);
  return response.data;
};

// Get carts with filters (supports filtering by userId)
export const getAllCarts = async (params: {
  userId: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}): Promise<{
  statusCode: number;
  data: {
    carts: Cart[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
  message: string;
  success: boolean;
}> => {
  const response = await axios.get("/cart/getAllCarts", { params });
  return response.data;
};

// Get cart by ID (admin functionality)
export const getCartById = async (cartId: string): Promise<{
  statusCode: number;
  data: {
    cart: Cart;
    summary: CartSummary;
  };
  message: string;
  success: boolean;
}> => {
  const response = await axios.get(`/cart/getCart/${cartId}`);
  return response.data;
};

// --- Save For Later APIs ---

// Move item from cart to save for later
export const moveToSaveForLater = async (
  productId: string,
  variantSku?: string
): Promise<CartResponse> => {
  const response = await axios.post(`/cart/saveForLater/${productId}${variantSku ? `/${variantSku}` : ''}`);
  return response.data;
};

// Move item from save for later to cart
export const moveToCart = async (
  productId: string,
  variantSku?: string
): Promise<CartResponse> => {
  const response = await axios.post(`/cart/moveToCart/${productId}${variantSku ? `/${variantSku}` : ''}`);
  return response.data;
};

// Get save for later items
export const getSaveForLater = async (): Promise<{
  saveForLater: any[];
  summary: CartSummary;
}> => {
  const response = await axios.get('/cart/saveForLater');
  return response.data.data;
};

// Remove item from save for later
export const removeFromSaveForLater = async (
  productId: string,
  variantSku?: string
): Promise<CartResponse> => {
  const response = await axios.delete(`/cart/saveForLater/${productId}${variantSku ? `/${variantSku}` : ''}`);
  return response.data;
};

// Clear all save for later items
export const clearSaveForLater = async (): Promise<CartResponse> => {
  const response = await axios.delete('/cart/saveForLater/clear');
  return response.data;
};
