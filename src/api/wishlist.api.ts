import axios from "./axiosInstance";

export const addToWishlist = async (productId: string) => {
  try {
    const response = await axios.post('/wishlist/addtowishlist', { productId });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to add to wishlist' };
  }
};

export const removeFromWishlist = async (productId: string) => {
  try {
    const response = await axios.delete(`/wishlist/removeFromWishlist/${productId}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to remove from wishlist' };
  }
};

export const getWishlist = async () => {
  try {
    const response = await axios.get('/wishlist/getWishlist');
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to fetch wishlist' };
  }
};
