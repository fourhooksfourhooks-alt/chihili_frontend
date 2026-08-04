import axios from "axios";
import Instance  from "./axiosInstance";

const instance = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.chihili.com/api",
	withCredentials: true,
});

interface LoginPayload {
  identifier: string;
  password: string;
}

interface SignupPayload {
  mobile?: string;
  email?: string;
}

interface ResendOtpPayload {
  mobile?: string;
  email?: string;
}

interface VerifyOtpPayload {
  otp: string;
  mobile?: string;
  email?: string;
}

interface CreatePasswordPayload {
  password: string;
  verificationToken: string;
}

export const login = async (payload: LoginPayload) => {
  return instance.post("/auth/login", payload);
};

export const loginWithFirebaseToken = async (token: string) => {
  // Social login using Firebase ID token in Authorization header
  return instance.post("/auth/login", {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });
};

export const signup = async (payload: SignupPayload) => { 
  return instance.post("/auth/signup", payload);
};

export const resendOtp = async (payload: ResendOtpPayload) => {
  return instance.post("/auth/resend-otp", payload);
};

export const verifyOtp = async (payload: VerifyOtpPayload) => {
  return instance.post("/auth/verify-otp", payload);
};

export const createPassword = async (payload: CreatePasswordPayload) => {
  return instance.post("/auth/create-password", payload);
};

export const refresh = async () => {
  return instance.post("/auth/refresh");
};

export const logout = async () => {
  return instance.post("/auth/logout");
};

export const getCurrentUser = async () => {
  return Instance.get("/auth/me");
};

