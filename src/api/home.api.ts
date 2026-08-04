import axios from './axiosInstance';

export interface HeroBanner {
  _id: string;
  image: string;
  title: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  order?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface HeroBannerResponse {
  statusCode: number;
  data: {
    heroBanners: HeroBanner[];
    total: number;
  };
  message: string;
  success: boolean;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  parent: string | null;
  isActive: boolean;
  image: string;
  banner: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryResponse {
  statusCode: number;
  data: {
    categories: Category[];
    total: number;
  };
  message: string;
  success: boolean;
}

export interface ProductVariant {
  attributes: {
    size: string;
    color: string;
  };
  sku: string;
  title: string;
  price: number;
  mrp: number;
  images: string[];
  stock: number;
}

export interface Product {
  _id: string;
  vendorId: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  categories: string[];
  tags: string[];
  status: string;
  images: string[];
  discountType: string;
  discountValue: number;
  variants: ProductVariant[];
  avgRating: number;
  ratingsCount: number;
  totalReviews: number;
  isFeatured: boolean;
  isDeleted: boolean;
  salesCount: number;
  wishlistCount: number;
  returnPolicy: string;
  createdAt: string;
  updatedAt: string;
  buyXGetY?: {
    x: number;
    y: number;
  };
  ratingDistribution: {
    [key: string]: number;
  };
}

export interface ProductResponse {
  statusCode: number;
  data: {
    products: Product[];
    total: number;
  };
  message: string;
  success: boolean;
}

export interface RecentlyViewedProduct extends Omit<Product, 'categories'> {
  categories: {
    _id: string;
    name: string;
    slug: string;
  }[];
}

export interface RecentlyViewedResponse {
  statusCode: number;
  data: {
    recentlyViewed: RecentlyViewedProduct[];
    count: number;
  };
  message: string;
  success: boolean;
}

export const getCategories = async (page = 1, limit = 10) => {
  try {
    const response = await axios.get<CategoryResponse>(`/categories?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const getAllProducts = async (page = 1, limit = 10, status = 'active', sortBy = 'createdAt', sortOrder = -1) => {
  try {
    const response = await axios.get<ProductResponse>(
      `/products?page=${page}&limit=${limit}&status=${status}&${sortBy}=${sortOrder}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// Add a product to recently viewed
export const addToRecentlyViewed = async (productId: string) => {
  try {
    const response = await axios.post('/users/recently-viewed', { productId });
    return response.data;
  } catch (error) {
    console.error('Error adding to recently viewed:', error);
    throw error;
  }
};

// Get recently viewed products
export const getRecentlyViewed = async (limit = 8) => {
  try {
    const response = await axios.get<RecentlyViewedResponse>(`/users/recently-viewed?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching recently viewed products:', error);
    throw error;
  }
};

// Get festival products
export const getFestivalProducts = async (page = 1, limit = 10) => {
  try {
    const response = await axios.get<ProductResponse>(
      `/products/festival-favorites?page=${page}&limit=${limit}&festivalTag=festival`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching festival products:', error);
    throw error;
  }
};

// Get best selling products
export const getBestSellingProducts = async (page = 1, limit = 10) => {
  try {
    const response = await axios.get<ProductResponse>(
      `/products/best-selling?page=${page}&limit=${limit}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching best selling products:', error);
    throw error;
  }
};

// Get hero banners for carousel
export const getHeroBanners = async (limit = 5) => {
  try {
    const response = await axios.get<HeroBannerResponse>(
      `/hero-banners?isActive=true&fields=title,image,description`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching hero banners:', error);
    throw error;
  }
};

// Interface for also bought products
export interface AlsoBoughtProduct {
  _id: string;
  name: string;
  slug: string;
  images: string[];
  avgRating: number;
  salesCount: number;
}

export interface AlsoBoughtResponse {
  statusCode: number;
  data: {
    related: AlsoBoughtProduct[];
  };
  message: string;
  success: boolean;
}

// Get also bought products
export const getAlsoBoughtProducts = async (productId: string, page = 1, limit = 10) => {
  try {
    const response = await axios.get<AlsoBoughtResponse>(
      `/products/${productId}/also-bought?page=${page}&limit=${limit}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching also bought products:', error);
    throw error;
  }
};
