import axios from './axiosInstance';

// ===== TYPES & INTERFACES =====

export interface ProductVariant {
  sku: string;
  title?: string;
  attributes: {
    size?: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
    color?: string;
  };
  price: number;
  mrp?: number;
  images?: string[];
  stock: number;
}

export interface Product {
  _id: string;
  vendorId: string;
  name: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  categories: string[] | Category[];
  tags?: string[];
  status: 'draft' | 'active' | 'inactive' | 'archived';
  images?: string[];
  discountType?: 'percentage' | 'flat';
  discountValue?: number;
  buyXGetY?: {
    x: number;
    y: number;
  };
  variants: ProductVariant[];
  avgRating: number;
  ratingsCount: number;
  totalReviews: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  isFeatured: boolean;
  isDeleted: boolean;
  salesCount: number;
  wishlistCount: number;
  returnPolicy: string;
  createdAt: string;
  updatedAt: string;
  // Computed fields from aggregation
  minPrice?: number;
  maxPrice?: number;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
}

export interface ProductListResponse {
  statusCode: number;
  data: {
    products: Product[];
    total: number;
  };
  message: string;
  success: boolean;
}

export interface SingleProductResponse {
  statusCode: number;
  data: {
    product: Product | null;
  };
  message: string;
  success: boolean;
}

export interface RelatedProductsResponse {
  statusCode: number;
  data: {
    related: Product[];
  };
  message: string;
  success: boolean;
}

export interface PaginatedProductResponse {
  statusCode: number;
  data: {
    products: Product[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  message: string;
  success: boolean;
}

// ===== QUERY PARAMETERS =====

export interface ProductListParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: 'newest' | 'lowToHigh' | 'highToLow' | 'popularity';
  sort?: string; // For basic field sorting
  fields?: string;
  category?: string; // Category ID
  tag?: string;
  status?: 'draft' | 'active' | 'inactive' | 'archived' | 'all';
  isFeatured?: boolean;
  minPrice?: number;
  maxPrice?: number;
  size?: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
  color?: string;
  minDiscount?: number;
  vendorId?: string;
}

export interface BestSellingParams {
  page?: number;
  limit?: number;
  category?: string;
  minRating?: number;
}

export interface FestivalFavoritesParams {
  page?: number;
  limit?: number;
  category?: string;
  festivalTag?: string;
  minRating?: number;
}

// ===== PUBLIC PRODUCT APIs =====

/**
 * Get all products with filtering, sorting, and pagination
 * This is the main product listing API with the new sorting functionality
 */
export const getAllProducts = async (params: ProductListParams = {}): Promise<ProductListResponse> => {
  try {
    const searchParams = new URLSearchParams();
    
    // Add all parameters to the query string
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });

    const response = await axios.get<ProductListResponse>(`/products?${searchParams.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

/**
 * Get a single product by slug (public access)
 */
/**
 * Get product by slug
 * @param slug Product slug
 * @returns Promise with product data
 */
export const getProductBySlug = async (slug: string): Promise<SingleProductResponse> => {
  try {
    const response = await axios.get<SingleProductResponse>(`/products/slug/${slug}`);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    
    // Create a consistent error response format
    return {
      statusCode: error.response?.status || 500,
      data: { product: null },
      message: error.message || 'Failed to fetch product',
      success: false
    };
  }
};

/**
 * Get products that people also bought (related products)
 */
export const getPeopleAlsoBought = async (productId: string): Promise<RelatedProductsResponse> => {
  try {
    const response = await axios.get<RelatedProductsResponse>(`/products/${productId}/also-bought`);
    return response.data;
  } catch (error) {
    console.error('Error fetching related products:', error);
    throw error;
  }
};

/**
 * Get best selling products for homepage
 */
export const getBestSellingProducts = async (params: BestSellingParams = {}): Promise<PaginatedProductResponse> => {
  try {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });

    const response = await axios.get<PaginatedProductResponse>(`/products/best-selling?${searchParams.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching best selling products:', error);
    throw error;
  }
};

/**
 * Get festival favorites for homepage
 */
export const getFestivalFavorites = async (params: FestivalFavoritesParams = {}): Promise<PaginatedProductResponse> => {
  try {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });

    const response = await axios.get<PaginatedProductResponse>(`/products/festival-favorites?${searchParams.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching festival favorites:', error);
    throw error;
  }
};

// ===== CONVENIENCE METHODS =====

/**
 * Search products with specific query
 */
export const searchProducts = async (
  query: string, 
  options: Omit<ProductListParams, 'search'> = {}
): Promise<ProductListResponse> => {
  return getAllProducts({ ...options, search: query });
};

/**
 * Get products by category
 */
export const getProductsByCategory = async (
  categoryId: string, 
  options: Omit<ProductListParams, 'category'> = {}
): Promise<ProductListResponse> => {
  return getAllProducts({ ...options, category: categoryId });
};

/**
 * Get products with specific sorting
 */
export const getProductsSorted = async (
  sortBy: 'newest' | 'lowToHigh' | 'highToLow' | 'popularity',
  options: Omit<ProductListParams, 'sortBy'> = {}
): Promise<ProductListResponse> => {
  return getAllProducts({ ...options, sortBy });
};

/**
 * Get products in price range
 */
export const getProductsByPriceRange = async (
  minPrice: number,
  maxPrice: number,
  options: Omit<ProductListParams, 'minPrice' | 'maxPrice'> = {}
): Promise<ProductListResponse> => {
  return getAllProducts({ ...options, minPrice, maxPrice });
};

/**
 * Get featured products
 */
export const getFeaturedProducts = async (
  options: Omit<ProductListParams, 'isFeatured'> = {}
): Promise<ProductListResponse> => {
  return getAllProducts({ ...options, isFeatured: true });
};

// ===== UTILITY FUNCTIONS =====

/**
 * Get the minimum price from product variants
 */
export const getMinPrice = (product: Product): number => {
  if (product.minPrice !== undefined) return product.minPrice;
  return Math.min(...product.variants.map(v => v.price));
};

/**
 * Get the maximum price from product variants
 */
export const getMaxPrice = (product: Product): number => {
  if (product.maxPrice !== undefined) return product.maxPrice;
  return Math.max(...product.variants.map(v => v.price));
};

/**
 * Check if product has discount
 */
export const hasDiscount = (product: Product): boolean => {
  return !!(product.discountType && product.discountValue && product.discountValue > 0);
};

/**
 * Calculate discounted price
 */
export const getDiscountedPrice = (originalPrice: number, product: Product): number => {
  if (!hasDiscount(product)) return originalPrice;
  
  if (product.discountType === 'percentage') {
    return originalPrice - (originalPrice * (product.discountValue! / 100));
  } else if (product.discountType === 'flat') {
    return Math.max(0, originalPrice - product.discountValue!);
  }
  
  return originalPrice;
};

/**
 * Check if product is in stock
 */
export const isInStock = (product: Product, sku?: string): boolean => {
  if (sku) {
    const variant = product.variants.find(v => v.sku === sku);
    return variant ? variant.stock > 0 : false;
  }
  return product.variants.some(v => v.stock > 0);
};

/**
 * Get available sizes for a product
 */
export const getAvailableSizes = (product: Product): string[] => {
  return Array.from(new Set(
    product.variants
      .filter(v => v.stock > 0 && v.attributes.size)
      .map(v => v.attributes.size!)
  ));
};

/**
 * Get available colors for a product
 */
export const getAvailableColors = (product: Product): string[] => {
  return Array.from(new Set(
    product.variants
      .filter(v => v.stock > 0 && v.attributes.color)
      .map(v => v.attributes.color!)
  ));
};

export default {
  getAllProducts,
  getProductBySlug,
  getPeopleAlsoBought,
  getBestSellingProducts,
  getFestivalFavorites,
  searchProducts,
  getProductsByCategory,
  getProductsSorted,
  getProductsByPriceRange,
  getFeaturedProducts,
  getMinPrice,
  getMaxPrice,
  hasDiscount,
  getDiscountedPrice,
  isInStock,
  getAvailableSizes,
  getAvailableColors,
};
