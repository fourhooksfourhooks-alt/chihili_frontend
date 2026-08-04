"use client";
import React, { useState, useEffect } from "react";
import { Search, Heart, ShoppingCart, User, Menu, X } from "lucide-react";
import Image from "next/image";
import logo from "../../public/Logo.svg";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  useRootCategories,
  useRootCategoryLoading,
  categoryStore,
} from "@/store/CategoryStore";
import { useAuthStore } from "@/store/authStore";
import { useCartItemCount } from "@/store/cartStore";

const NavIconButton = ({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) => {
  return (
    <Link href={href}>
      <button
        className={`p-2 transition-colors ${
          active
            ? "bg-[#FAE6EC] text-primary1 rounded-full"
            : "text-gray-600 hover:text-primary1"
        }`}
      >
        {children}
      </button>
    </Link>
  );
};

const CartIconWithBadge = ({
  href,
  active,
  count,
  size = "h-6 w-6",
}: {
  href: string;
  active: boolean;
  count: number;
  size?: string;
}) => {
  return (
    <Link href={href}>
      <button
        className={`relative p-2 transition-colors ${
          active
            ? "bg-[#FAE6EC] text-primary1 rounded-full"
            : "text-gray-600 hover:text-primary1"
        }`}
      >
        <ShoppingCart className={size} />
        {count > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center min-w-[20px]">
            {count > 99 ? '99+' : count}
          </span>
        )}
      </button>
    </Link>
  );
};

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();
  const router = useRouter();

  // Get auth state
  const { isAuthenticated, user, getCurrentUser } = useAuthStore();
  
  // Get cart count
  const cartItemCount = useCartItemCount();

  // Update CSS custom property for navbar height
  useEffect(() => {
    const updateNavbarHeight = () => {
      const navbar = document.querySelector("nav");
      if (navbar) {
        const height = navbar.offsetHeight;
        document.documentElement.style.setProperty(
          "--navbar-height",
          `${height}px`
        );
      }
    };

    // Update on mount and resize
    updateNavbarHeight();
    window.addEventListener("resize", updateNavbarHeight);

    return () => window.removeEventListener("resize", updateNavbarHeight);
  }, [isMobileMenuOpen, isSearchOpen]); // Re-run when menu states change

  // Get categories from store
  const rootCategories = useRootCategories();
  const isLoadingCategories = useRootCategoryLoading();

  // Limit the number of categories to display in the navbar
  const displayedCategories = rootCategories.slice(0, 8); // Show max 8 categories

  // Initialize categories when component mounts
  useEffect(() => {
    const initializeCategories = async () => {
      await categoryStore.fetchRoots();
    };

    initializeCategories();
  }, []);

  // Fetch current user when component mounts
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        await getCurrentUser();
      } catch (error) {
        console.log('Failed to fetch current user:', error);
      }
    };

    // Only fetch if we think we're authenticated but don't have user data
    if (isAuthenticated && !user) {
      fetchCurrentUser();
    }
  }, [isAuthenticated, user, getCurrentUser]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery(""); // Clear the search after navigation
    }
  };

  const handleMobileSearchSubmit = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter" && e.currentTarget.value.trim()) {
      router.push(
        `/search?q=${encodeURIComponent(e.currentTarget.value.trim())}`
      );
      setIsSearchOpen(false); // Close mobile search
    }
  };

  return (
    <nav className="w-full bg-secondary sticky top-0 z-50 font-crimson-pro shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        {/* Main Header */}
        <div className="flex items-center justify-between md:justify-evenly h-[4.5rem] lg:h-[5.5rem]">
          {/* Logo */}
          <Link href={"/"} className="flex-shrink-0">
            <Image
              src={logo}
              alt="Chihili Logo"
              className="h-11 sm:h-12 lg:h-14 w-auto"
              height={44}
              width={132}
              priority
            />
          </Link>

          {/* Desktop Search Bar - Center */}
          <div className="hidden lg:flex">
            <div className="relative w-96 xl:w-[650px]">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-6 w-6 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchSubmit}
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-800 rounded-none leading-5 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-pink-500 focus:border-pink-500 text-sm"
              />
            </div>
          </div>

          {/* Wishlist Icon */}
          <div className="hidden lg:block">
            <NavIconButton
              href="/wishlist"
              active={!!pathname?.startsWith("/wishlist")}
            >
              <Heart className="h-6 w-6" />
            </NavIconButton>
          </div>

          {/* Cart Icon */}
          <div className="hidden lg:block">
            <CartIconWithBadge
              href="/cart-details"
              active={
                !!(
                  pathname?.startsWith("/cart") ||
                  pathname?.startsWith("/cart-details")
                )
              }
              count={cartItemCount}
            />
          </div>

          {/* Profile Icon with Auth Status */}
          <Link 
            href={isAuthenticated ? "/profile" : "/auth/login"}
            className="hidden lg:flex items-center space-x-2 hover:bg-gray-50 rounded-lg p-2 transition-colors cursor-pointer"
          >
            <div className={`p-2 transition-colors ${
              pathname?.startsWith("/profile")
                ? "bg-[#FAE6EC] text-primary1 rounded-full"
                : "text-gray-600 hover:text-primary1"
            }`}>
              <User className="h-6 w-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-600">
                {isAuthenticated ? "Hey," : "Login"}
              </span>
              {isAuthenticated && user && (
                <span className="text-sm font-medium text-gray-800 truncate max-w-20">
                  {user.firstname || user.name || user.email?.split('@')[0] || user.mobile || "User"}
                </span>
              )}
            </div>
          </Link>

          {/* Talk to Designers Button */}
          <button className="hidden lg:block bg-red-900 text-white px-5 lg:px-6 py-2 lg:py-3 text-sm lg:text-base font-semibold tracking-wider hover:bg-red-800 transition-colors whitespace-nowrap">
            TALK TO DESIGNERS
          </button>

          {/* Mobile Icons and Menu */}
          <div className="lg:hidden flex items-center space-x-2 sm:space-x-3">
            {/* Mobile Search Toggle */}
            <button
              onClick={toggleSearch}
              className="p-2 text-gray-700 hover:text-pink-600"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Cart Icon - Always visible on mobile */}
            <CartIconWithBadge
              href="/cart-details"
              active={
                !!(
                  pathname?.startsWith("/cart") ||
                  pathname?.startsWith("/cart-details")
                )
              }
              count={cartItemCount}
              size="h-5 sm:h-6 w-5 sm:w-6"
            />

            <div className="hidden sm:block">
              <NavIconButton
                href="/wishlist"
                active={!!pathname?.startsWith("/wishlist")}
              >
                <Heart className="h-5 sm:h-6 w-5 sm:w-6" />
              </NavIconButton>
            </div>
            <div className="hidden sm:block">
              <NavIconButton
                href={isAuthenticated ? "/profile" : "/auth/login"}
                active={!!pathname?.startsWith("/profile")}
              >
                <User className="h-5 sm:h-6 w-5 sm:w-6" />
              </NavIconButton>
            </div>

            {/* Mobile Talk to Designers Button */}
            <button className="hidden sm:block bg-red-900 text-white px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 text-xs sm:text-sm md:text-sm font-semibold tracking-wider hover:bg-red-800 transition-colors whitespace-nowrap">
              TALK TO DESIGNERS
            </button>

            <button
              onClick={toggleMobileMenu}
              className="p-2 text-gray-600 hover:text-pink-600 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div
          className={`lg:hidden border-gray-200 overflow-hidden transition-all duration-300 ease-in-out ${
            isSearchOpen ? "max-h-28 py-4 border-t" : "max-h-0 py-0"
          }`}
        >
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search"
              onKeyDown={handleMobileSearchSubmit}
              className="block w-full pl-10 pr-3 py-2 border border-gray-800 rounded-none leading-5 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-pink-500 focus:border-pink-500 text-sm"
              autoFocus={isSearchOpen}
            />
          </div>
        </div>

        {/* Desktop Navigation Menu */}
        <div className="hidden sm:block bg-secondary">
          <div className="flex justify-evenly items-center space-x-7 lg:space-x-10 py-3 lg:py-4 lg:pb-8">
            {isLoadingCategories ? (
              // Show loading placeholders
              Array(6)
                .fill(0)
                .map((_, index) => (
                  <div
                    key={index}
                    className="h-4 w-20 bg-gray-200 animate-pulse rounded"
                  ></div>
                ))
            ) : displayedCategories.length > 0 ? (
              // Show actual categories
              displayedCategories.map((category) => (
                <Link
                  key={category._id}
                  href={`/categoryPage?slug=${category.slug}`}
                  className="text-gray-700 hover:text-pink-600 font-medium text-sm lg:text-base tracking-wider transition-colors whitespace-nowrap"
                >
                  {category.name.toUpperCase()}
                </Link>
              ))
            ) : (
              // Fallback if no categories found
              <div className="text-gray-500 text-sm">
                No categories available
              </div>
            )}
            <a
              href="#"
              className="bg-secondary1 text-gray-700 px-5 py-2 font-medium text-sm lg:text-base tracking-wider hover:bg-[#E8DFC5] transition-colors whitespace-nowrap rounded"
            >
              DESIGN YOURSELF
            </a>
          </div>
        </div>

        {/* Mobile Navigation Menu Overlay */}
        {isMobileMenuOpen && (
          <div
            className="sm:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Mobile Navigation Menu Sheet */}
        <div
          className={`sm:hidden fixed top-0 right-0 h-full w-80 bg-secondary shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Header with Close Button */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 text-gray-600 hover:text-pink-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Menu Content */}
          <div className="overflow-y-auto h-full pb-20">
            {/* User Actions - Top Priority */}
            <div className="p-4 border-b border-gray-200 space-y-3">
              <Link
                href={isAuthenticated ? "/profile" : "/auth/login"}
                className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:text-pink-600 hover:bg-gray-50 transition-colors rounded-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <User className="h-5 w-5" />
                <span className="font-medium">
                  {isAuthenticated ? "My Account" : "Login"}
                </span>
              </Link>
              <Link
                href="/cart-details"
                className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:text-pink-600 hover:bg-gray-50 transition-colors rounded-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center min-w-[16px]">
                      {cartItemCount > 99 ? '99+' : cartItemCount}
                    </span>
                  )}
                </div>
                <span className="font-medium">
                  Shopping Cart {cartItemCount > 0 && `(${cartItemCount})`}
                </span>
              </Link>
              <Link
                href="/wishlist"
                className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:text-pink-600 hover:bg-gray-50 transition-colors rounded-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Heart className="h-5 w-5" />
                <span className="font-medium">Wishlist</span>
              </Link>
            </div>

            {/* Categories Section */}
            <div className="py-4">
              <h3 className="px-4 text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Categories
              </h3>
              {isLoadingCategories ? (
                // Show loading placeholders
                Array(6)
                  .fill(0)
                  .map((_, index) => (
                    <div key={index} className="px-4 py-1.5">
                      <div className="h-4 w-28 bg-gray-200 animate-pulse rounded"></div>
                    </div>
                  ))
              ) : displayedCategories.length > 0 ? (
                // Show actual categories
                displayedCategories.map((category) => (
                  <Link
                    key={category._id}
                    href={`/categoryPage?slug=${category.slug}`}
                    className="block px-4 py-3 text-gray-700 hover:text-pink-600 hover:bg-gray-50 font-medium text-sm tracking-wider transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {category.name.toUpperCase()}
                  </Link>
                ))
              ) : (
                // Fallback if no categories found
                <div className="px-4 py-1.5 text-gray-500 text-sm">
                  No categories available
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="px-4 pt-4 border-t border-gray-200 space-y-3">
              <a
                href="#"
                className="block bg-[#F0EAD2] text-gray-700 px-4 py-3 font-medium text-sm tracking-wider hover:bg-[#E8DFC5] transition-colors text-center rounded-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                DESIGN YOURSELF
              </a>

              {/* Mobile Talk to Designers Button */}
              <a
                href="#"
                className="block bg-red-900 text-white px-5 py-3 font-semibold text-sm tracking-wider hover:bg-red-800 transition-colors text-center rounded-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                TALK TO DESIGNERS
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
