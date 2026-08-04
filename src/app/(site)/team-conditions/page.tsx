"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-secondary py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Terms and Conditions</h1>
            <p className="mt-2 text-gray-600">Last updated: September 20, 2025</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p className="text-gray-600 mb-4">
              Welcome to Chihili. By accessing and using our website and services, you agree to be bound by these Terms and Conditions. Please read them carefully before proceeding to use our platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Definitions</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>"Website" refers to Chihili, accessible at www.chihili.com</li>
              <li>"User," "You," and "Your" refers to you, the person accessing this website</li>
              <li>"Company," "We," "Our," and "Us" refers to Chihili</li>
              <li>"Party" refers to both you and us</li>
              <li>"Content" refers to all materials, information, products, and services available on our website</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. User Account</h2>
            <p className="text-gray-600 mb-4">
              When you create an account with us, you must provide accurate, complete, and current information. You are responsible for maintaining the confidentiality of your account and password.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Products and Services</h2>
            <p className="text-gray-600 mb-4">
              We strive to display our products and their features as accurately as possible. However, the displayed colors and images depend on your computer system and we cannot guarantee that your computer will accurately display such colors.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Pricing and Payment</h2>
            <p className="text-gray-600 mb-4">
              All prices are subject to change without notice. We reserve the right to modify or discontinue any product or service without notice. We shall not be liable to you or any third party for any modification, price change, suspension, or discontinuance of the service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Shipping and Delivery</h2>
            <p className="text-gray-600 mb-4">
              Delivery times are estimates only and commence from the date of shipping. We are not responsible for any delays caused by destination customs clearance processes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Returns and Refunds</h2>
            <p className="text-gray-600 mb-4">
              Our return and refund policies are subject to certain terms and conditions. Please refer to our dedicated Returns & Refunds page for detailed information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Privacy Policy</h2>
            <p className="text-gray-600 mb-4">
              Your use of our website is also governed by our Privacy Policy. Please review our Privacy Policy to understand our practices.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Contact Information</h2>
            <p className="text-gray-600 mb-4">
              If you have any questions about these Terms and Conditions, please contact us at:
            </p>
            <ul className="list-none pl-6 text-gray-600 space-y-2">
              <li>Email: support@chihili.com</li>
              <li>Phone: +91 XXXXXXXXXX</li>
              <li>Address: [Your Company Address]</li>
            </ul>
          </section>
        </div>

        {/* Back to Home Button */}
        <div className="mt-12 text-center">
          <Link href="/" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-800 hover:bg-red-900">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}