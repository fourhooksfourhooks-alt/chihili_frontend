"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Mail,
  Phone,
} from "lucide-react";
import { categoryAPI, type Category } from "@/api/category.api";

export default function NewsletterFooter() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const response = await categoryAPI.getAllCategories({
          limit: 5, // Only fetch 5 categories
          isActive: true,
          sort: 'name'
        });
        setCategories(response.data.categories);
      } catch (error) {
        console.error('Error fetching categories for footer:', error);
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Handle category click navigation
  const handleCategoryClick = (category: Category) => {
    router.push(`/categoryPage?slug=${category.slug}`);
  };
  return (
    <footer className="bg-secondary w-full">
      {/* Footer */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 text-sm text-gray-700">
          {/* Brand */}
          <div className="flex flex-col items-start justify-start">
            <Image
              src={"/Logo.png"}
              alt="Chihili Logo"
              width={120}
              height={120}
              className="h-20 w-auto mb-4"
            />
            <p className="text-gray-600 text-sm ml-3">
              Join the Odia Fashion Heritage
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold mb-2">Product</h4>
            <ul className="space-y-1">
              {loadingCategories ? (
                // Loading skeleton
                Array.from({ length: 5 }).map((_, index) => (
                  <li key={index}>
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  </li>
                ))
              ) : categories.length > 0 ? (
                // Display fetched categories
                categories.map((category) => (
                  <li key={category._id}>
                    <button
                      onClick={() => handleCategoryClick(category)}
                      className="hover:text-gray-900 transition-colors text-left w-full cursor-pointer"
                    >
                      {category.name}
                    </button>
                  </li>
                ))
              ) : (
                // Fallback to hardcoded items if API fails
                <>
                  <li>
                    <a href="#" className="hover:text-gray-900 transition-colors">
                      Gown
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-gray-900 transition-colors">
                      Fabric
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-gray-900 transition-colors">
                      Co-Ord Sets
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-gray-900 transition-colors">
                      Sarees
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-gray-900 transition-colors">
                      Kurti Sets
                    </a>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-2">Company</h4>
            <ul className="space-y-1">
              <li>
                <Link href="/about-us" className="hover:text-gray-900 transition-colors">
                  About us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-gray-900 transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/talk-to-designers" className="hover:text-gray-900 transition-colors">
                  Talk to Designers
                </Link>
              </li>
              <li>
                <Link href="/contact-us" className="hover:text-gray-900 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Order Tracking */}
          <div>
            <h4 className="font-semibold mb-2">Order Tracking</h4>
            <ul className="space-y-1">
              <li>
                <a href="#" className="hover:text-gray-900 transition-colors">
                  Order History
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-900 transition-colors">
                  Track Order
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-900 transition-colors">
                  Shipping Policies
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-900 transition-colors">
                  Return Policies
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-900 transition-colors">
                  Refund Policies
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-900 transition-colors">
                  Support
                </a>
              </li>
            </ul>
          </div>

          {/* Connect With Us */}
          <div>
            <h4 className="font-semibold mb-2">Connect With Us</h4>

            {/* Social Media Links */}
            <div className="flex space-x-3 mb-4">
              <a
                href="https://www.facebook.com/share/1EXxr6vwz8/?mibextid=wwXIfr"
                className="text-gray-600 hover:text-blue-600 transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://www.instagram.com/chihili_online/"
                className="text-gray-600 hover:text-pink-600 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://x.com/chihili_store"
                className="text-gray-600 hover:text-blue-400 transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a
                href="https://www.youtube.com/@chihili"
                className="text-gray-600 hover:text-red-600 transition-colors"
                aria-label="YouTube"
              >
                <Youtube size={20} />
              </a>
            </div>

            {/* Contact Info */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Mail size={16} className="text-gray-500" />
                <a
                  href="mailto:hello@chihili.com"
                  className="hover:text-gray-900 transition-colors"
                >
                  hello@chihili.com
                </a>
              </div>
                <div className="flex items-center space-x-2">
                <Phone size={16} className="text-gray-500" />
                <a
                  href="tel:+919876543210"
                  className="hover:text-gray-900 transition-colors"
                >
                  +91 98765 43210 / 
                </a>
                </div>
                <div className="flex items-center space-x-2">
                 <a
                  href="tel:+919124725574"
                  className="hover:text-gray-900 transition-colors"
                >
                  +91 91247 25574
                </a>
                </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-4 flex flex-col sm:flex-row justify-between items-center text-gray-500 text-xs">
          <p>© 2024 Chihili. All rights reserved.</p>
          <Link href="/team-conditions" className="hover:underline">
            Team & Conditions
          </Link>
        </div>
      </div>
    </footer>
  );
}
