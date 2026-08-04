"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import saree1 from "../../../../public/saree_mix.jpg";
import logo from "../../../../public/Logo.svg";
import ratha from "../../../../public/image.png";
import flower from "../../../../public/flower.png";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

export default function Login() {
  const router = useRouter();
  const buttonText = "Log In";

  
  const [indentifier, setIndentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const login = useAuthStore((s) => s.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!indentifier || !password) {
      setError("Please enter both email/mobile and password");
      return;
    }

    try {
      await login(indentifier, password);
      console.log("Login successful");
      router.push("/");
    } catch (error: any) {
      const errorMessage = error.response?.data?.message;
      
      // Handle specific error cases
      if (errorMessage?.toLowerCase().includes("password")) {
        setError("Incorrect password. Please try again.");
      } else if (errorMessage?.toLowerCase().includes("not found") || errorMessage?.toLowerCase().includes("no user")) {
        setError("Account not found. Please check your email/mobile number.");
      } else if (errorMessage?.toLowerCase().includes("invalid")) {
        setError("Invalid credentials. Please check your details and try again.");
      } else if (error.code === "auth/too-many-requests") {
        setError("Too many failed attempts. Please try again later.");
      } else {
        setError(errorMessage || "Login failed. Please try again.");
      }
      
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-row text-lato bg-[#FAF8F0]">
      {/* Left Side - Form */}
      <div className="w-full lg:flex-grow flex items-center justify-center relative overflow-hidden min-h-screen">
        {/* Background decorative images - shown only on large screens */}
        <div className="absolute top-14 right-0 z-0 opacity-90 hidden lg:block">
          <Image src={ratha} alt="Ratha" priority />
        </div>
        <div className="absolute bottom-0 left-0 z-0 opacity-90 hidden lg:block">
          <Image
            src={flower}
            alt="Flower"
            className="h-[30vh] w-auto"
            priority
          />
        </div>
        <div className="relative z-10 w-full max-w-md lg:max-w-2xl space-y-6 lg:space-y-8 p-4 sm:p-6 lg:p-10">
          {/* Logo */}
          <div className="mb-8 lg:mb-24 xl:mb-32 w-full flex justify-center lg:justify-start">
            <Image src={logo} alt="Chihili Logo" className="w-28 sm:w-32 lg:w-36" />
          </div>

          {/* Heading */}
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 text-center lg:text-left">
            Log in to Chihili Account
          </h2>

          {/* Login Fields */}
          <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6 w-full">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
            {/* Email */}
            <div>
              <input
                type="text"
                placeholder="Email or Mobile Number"
                value={indentifier}
                onChange={(e) => setIndentifier(e.target.value)}
                className="w-full h-12 sm:h-14 px-4 border border-gray-300 rounded-lg text-base sm:text-lg bg-white focus:border-red-800 focus:ring-red-800 outline-none transition-colors"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 sm:h-14 px-4 pr-12 border border-gray-300 rounded-lg text-base sm:text-lg bg-white focus:border-red-800 focus:ring-red-800 outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-4 flex items-center text-gray-500 hover:text-gray-700 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="flex justify-center lg:justify-end items-center mt-2">
              <Link
                href="/auth/forgot-password"
                className="text-sm text-primary1 hover:text-primary2 font-medium transition-colors"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-red-800 text-white rounded-lg py-3 sm:py-4 px-4 font-medium hover:bg-red-900 transition-colors duration-200 text-base sm:text-lg"
            >
              {buttonText}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-4 lg:my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#FAF8F0] text-gray-500">or</span>
            </div>
          </div>

          {/* Signup link */}
          <p className="text-center text-gray-600 text-sm sm:text-base">
            Don't have a Chihili Account?{" "}
            <Link
              href="/auth/signup"
              className="text-red-800 font-semibold hover:text-red-900 inline-flex items-center transition-colors"
            >
              Sign up
              <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </p>

          {/* Terms */}
          <p className="text-center text-xs sm:text-sm text-gray-500 mt-4 lg:mt-6 leading-relaxed">
            By proceeding, you agree to the{" "}
            <a href="#" className="text-blue-600 hover:text-blue-800 transition-colors">
              Terms and Conditions
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-600 hover:text-blue-800 transition-colors">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>

      {/* Right Side - Main Image - Hidden on tablet and below */}
      <div className="hidden lg:block flex-shrink-0 relative h-screen w-auto">
        <Image
          src={saree1}
          alt="Saree Model"
          width={400}
          height={600}
          className="h-full w-auto object-contain"
          priority
        />
      </div>
    </div>
  );
}
