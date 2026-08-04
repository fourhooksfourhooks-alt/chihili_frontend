"use client";
import React, { useState } from "react";
import {
  User,
  MapPin,
  ShoppingCart,
  Heart,
  Clock,
  HelpCircle,
} from "lucide-react";
import UserProfile from "./profile/UserProfile";
import SavedAddresses from "./profile/SavedAddresses";
import Cart from "./profile/Cart";
import Wishlist from "./profile/Wishlist";
import OrderHistory from "./profile/OrderHistory";
import HelpCenter from "./profile/HelpCenter";

export default function ProfileTabs() {
  const [activeTab, setActiveTab] = useState("Profile");
  const initialData = {
    firstName: "Eleanor",
    lastName: "Pena",
    email: "elanorpena@gmail.com",
    countryCode: "+91",
    mobile: "9182939202",
  };

  const tabs = [
    { name: "Profile", icon: User },
    { name: "Saved Addresses", icon: MapPin },
    { name: "Cart", icon: ShoppingCart },
    { name: "Wishlist", icon: Heart },
    { name: "Order History", icon: Clock },
    { name: "Help Center", icon: HelpCircle },
  ];

  const countryCodes = [
    { code: "+91", country: "India" },
    { code: "+1", country: "USA" },
    { code: "+44", country: "UK" },
    { code: "+86", country: "China" },
    { code: "+81", country: "Japan" },
  ];

  // const handleInputChange = (field, value) => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     [field]: value,
  //   }));
  // };

  const handleSaveChanges = () => {
    console.log("Saving changes:");
    // Add your save logic here
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "Profile":
        return <UserProfile initialData={initialData} />;
      case "Saved Addresses":
        return <SavedAddresses />;
      case "Cart":
        return <Cart />;
      case "Wishlist":
        return <Wishlist />;
      case "Order History":
        return <OrderHistory />;
      case "Help Center":
        return <HelpCenter />;
      default:
        return null;
    }
  };

  return (
    <div className=" bg-secondary w-full">
      <div className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-0 px-4 md:px-24 py-8 md:py-12">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-secondary rounded-none shadow-none border-none overflow-hidden space-y-3">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.name;

                return (
                  <button
                    key={tab.name}
                    onClick={() => setActiveTab(tab.name)}
                    className={`w-full px-6 py-4 text-left flex items-center gap-3 transition-all duration-200 border-b border-gray-200 last:border-b-0 ${
                      isActive
                        ? "bg-secondary1 text-gray-900"
                        : "bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${
                        isActive ? "text-yellow-600" : "text-gray-400"
                      }`}
                    />
                    <span className="font-medium">{tab.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-secondary rounded-none shadow-none border-none p-6 sm:p-8">
              {/* Tab Header */}
              <div className="mb-8">
                <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                  {activeTab}
                </h1>
                <div className="w-12 h-1 bg-yellow-500 rounded-full"></div>
              </div>

              {/* Tab Content with Smooth Transition */}
              <div className="transition-all duration-300 ease-in-out">
                {renderTabContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
