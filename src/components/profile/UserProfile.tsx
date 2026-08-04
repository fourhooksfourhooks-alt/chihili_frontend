"use client";
import React, { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { getUserProfile, updateUserProfile, UserProfile as UserProfileType } from "@/api/user.api";
import { useAuthStore } from "@/store/authStore";

interface UserProfileProps {
  initialData?: {
    firstName: string;
    lastName: string;
    email: string;
    countryCode: string;
    mobile: string;
  };
}

export default function UserProfile({ initialData }: UserProfileProps) {
  const [formData, setFormData] = useState({
    firstName: initialData?.firstName || "",
    lastName: initialData?.lastName || "",
    email: initialData?.email || "",
    countryCode: initialData?.countryCode || "+91",
    mobile: initialData?.mobile || "",
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuthStore();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      setLoading(true);
      setError(null);
      try {
        const response = await getUserProfile();
        const profile = response.data.user;
        
        setFormData({
          firstName: profile.firstname || "",
          lastName: profile.lastname || "",
          email: profile.email || "",
          countryCode: "+91", // Default, since backend doesn't store country code
          mobile: profile.mobile || "",
        });
      } catch (err) {
        setError("Failed to load profile data");
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const countryCodes = [
    { code: "+91", country: "India" },
    { code: "+1", country: "USA" },
    { code: "+44", country: "UK" },
    { code: "+86", country: "China" },
    { code: "+81", country: "Japan" },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveChanges = async () => {
    setSaving(true);
    setError(null);
    try {
      const updateData = {
        firstname: formData.firstName,
        lastname: formData.lastName,
        email: formData.email,
      };
      
      const response = await updateUserProfile(updateData);
      
      // Update local state with the response
      const updatedUser = response.data.user;
      setFormData(prev => ({
        ...prev,
        firstName: updatedUser.firstname || "",
        lastName: updatedUser.lastname || "",
        email: updatedUser.email || "",
      }));
      
      console.log("Profile updated successfully");
    } catch (err) {
      setError("Failed to update profile");
      console.error("Error updating profile:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary1"></div>
        </div>
      ) : (
        <>
          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your email address"
              />
            </div>

            {/* Mobile Number Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mobile Number
              </label>
              <div className="flex">
                <div className="relative">
                  <select
                    value={formData.countryCode}
                    disabled
                    className="appearance-none px-4 py-3 bg-gray-100 pr-10 border border-gray-300 text-gray-500 cursor-not-allowed"
                  >
                    {countryCodes.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.code}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
                <input
                  type="tel"
                  value={formData.mobile}
                  disabled
                  className="flex-1 px-4 py-3 bg-gray-100 border border-gray-300 text-gray-500 cursor-not-allowed"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Mobile number cannot be changed</p>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4">
            <button
              onClick={handleSaveChanges}
              disabled={saving}
              className="px-8 py-3 bg-primary1 text-white font-medium hover:bg-opacity-90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
