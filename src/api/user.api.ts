import axios from "./axiosInstance";

// Types for user API
export interface UserProfile {
  _id: string;
  mobile?: string;
  email?: string;
  firstname?: string;
  lastname?: string;
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
}

export interface UpdateProfileRequest {
  firstname?: string;
  lastname?: string;
  email?: string;
}

// Get user profile
export const getUserProfile = async (): Promise<{
  statusCode: number;
  data: { user: UserProfile };
  message: string;
  success: boolean;
}> => {
  const response = await axios.get("users/profile");
  return response.data;
};

// Update user profile
export const updateUserProfile = async (data: UpdateProfileRequest): Promise<{
  statusCode: number;
  data: { user: UserProfile };
  message: string;
  success: boolean;
}> => {
  const response = await axios.put("users/profile", data);
  return response.data;
};
