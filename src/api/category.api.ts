import axios from './axiosInstance';

// Types for category data
export interface Category {
  _id: string;
  name: string;
  slug: string;
  parent?: string | null;
  isActive: boolean;
  image?: string | null;
  banner?: string | null;
  createdAt: string;
  updatedAt: string;
}

// API Response wrapper
export interface ApiResponse {
  success: boolean;
  message: string;
  status: number;
}

// Types for category API responses
export interface CategoryListResponse extends ApiResponse {
  data: {
    categories: Category[];
    total: number;
  };
}

export interface CategoryResponse extends ApiResponse {
  data: {
    category: Category;
  };
}

// Query parameters for listing categories (public endpoints only)
export interface CategoryQueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  fields?: string;
  search?: string;
  parent?: string;
  isActive?: boolean;
}

class CategoryAPI {
  /**
   * Get all active categories with optional filters (Public)
   */
  async getAllCategories(params?: CategoryQueryParams): Promise<CategoryListResponse> {
    try {
      const searchParams = new URLSearchParams();
      
      // Force isActive to true for public API
      const publicParams = { ...params, isActive: true };
      
      if (publicParams) {
        Object.entries(publicParams).forEach(([key, value]) => {
          // Skip empty parent parameter to avoid 422 errors
          if (key === 'parent' && (value === '' || value === null)) {
            return;
          }
          
          if (value !== undefined && value !== null) {
            searchParams.append(key, value.toString());
          }
        });
      }

      const response = await axios.get<CategoryListResponse>(`/categories?${searchParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  /**
   * Get category by ID (Public)
   */
  async getCategoryById(id: string): Promise<CategoryResponse> {
    try {
      const response = await axios.get<CategoryResponse>(`/categories/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching category by ID:', error);
      throw error;
    }
  }

  /**
   * Get category by slug (Public)
   */
  async getCategoryBySlug(slug: string): Promise<CategoryResponse> {
    try {
      const response = await axios.get<CategoryResponse>(`/categories/slug/${slug}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching category by slug:', error);
      throw error;
    }
  }

  /**
   * Get all active categories (for public use)
   */
  async getActiveCategories(params?: Omit<CategoryQueryParams, 'isActive'>): Promise<CategoryListResponse> {
    return this.getAllCategories({
      ...params,
      isActive: true,
    });
  }

  /**
   * Get root categories (categories without parent)
   */
  async getRootCategories(params?: Omit<CategoryQueryParams, 'parent'>): Promise<CategoryListResponse> {
    try {
      // For root categories, use the standard getAllCategories method
      // but don't specify parent - let the API handle filtering root categories
      return this.getAllCategories({
        ...params,
        isActive: true
      });
    } catch (error) {
      console.error('Error fetching root categories:', error);
      throw error;
    }
  }

  /**
   * Get child categories of a parent category
   */
  async getChildCategories(parentId: string, params?: Omit<CategoryQueryParams, 'parent'>): Promise<CategoryListResponse> {
    return this.getAllCategories({
      ...params,
      parent: parentId,
    });
  }

  /**
   * Get categories for navigation menu (active root categories)
   */
  async getNavigationCategories(): Promise<CategoryListResponse> {
    return this.getRootCategories({
      isActive: true,
      sort: 'name',
    });
  }

  /**
   * Search categories by name
   */
  async searchCategories(searchTerm: string, params?: Omit<CategoryQueryParams, 'search'>): Promise<CategoryListResponse> {
    return this.getAllCategories({
      ...params,
      search: searchTerm,
    });
  }

  /**
   * Get category hierarchy (parent with children)
   */
  async getCategoryHierarchy(parentId?: string): Promise<CategoryListResponse> {
    // If no parentId is provided, get root categories
    const categories = parentId 
      ? await this.getAllCategories({ parent: parentId, isActive: true })
      : await this.getRootCategories({ isActive: true });
    
    // For each category, fetch its children
    const categoriesWithChildren = await Promise.all(
      categories.data.categories.map(async (category) => {
        try {
          const children = await this.getChildCategories(category._id);
          return {
            ...category,
            children: children.data.categories,
          };
        } catch (error) {
          return {
            ...category,
            children: [],
          };
        }
      })
    );

    return {
      ...categories,
      data: {
        ...categories.data,
        categories: categoriesWithChildren,
      },
    };
  }
}

// Create and export a singleton instance
export const categoryAPI = new CategoryAPI();

// Export the class as well for direct instantiation if needed
export default CategoryAPI;