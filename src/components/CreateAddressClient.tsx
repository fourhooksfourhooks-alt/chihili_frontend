"use client";

import React, { useEffect, useState } from "react";
import { useAddressStore } from "@/store/addressStore";
import { getAddressById } from "@/api/address.api";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

interface CreateAddressClientProps {
  addressId?: string | null;
  onSuccess?: () => void;
}

const CreateAddressClient: React.FC<CreateAddressClientProps> = ({ addressId, onSuccess }) => {
  const { addAddress, updateAddress, loading, error } = useAddressStore();
  const user = useAuthStore((s) => s.user);
  const [formData, setFormData] = useState({
    label: "Home",
    name: "",
    street: "",
    landmark: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    phone: "",
    isDefault: true,
    _id: "",
  });
  const [submitError, setSubmitError] = useState("");
  const [editMode, setEditMode] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    let newValue: string | boolean = value;
    if (type === "checkbox" && "checked" in e.target) {
      newValue = (e.target as HTMLInputElement).checked;
    }
    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const router = useRouter();

  useEffect(() => {
    if (addressId) {
      setEditMode(true);
      getAddressById(addressId).then((res) => {
        if (res.success && res.data.address) {
          const addr = res.data.address;
          setFormData({
            label: addr.label ?? "Home",
            name: addr.name ?? "",
            street: addr.street ?? "",
            landmark: addr.landmark ?? "",
            city: addr.city ?? "",
            state: addr.state ?? "",
            postalCode: addr.postalCode ?? "",
            country: addr.country ?? "India",
            phone: addr.phone ?? "",
            isDefault: typeof addr.isDefault === "boolean" ? addr.isDefault : true,
            _id: addr._id ?? "",
          });
        }
      });
    }
  }, [addressId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError("");
    if (!user?._id) {
      setSubmitError("User not logged in");
      return;
    }
    if (!formData.name || !formData.street || !formData.city || !formData.state || !formData.postalCode || !formData.country || !formData.phone) {
      setSubmitError("Please fill all required fields");
      return;
    }
    try {
      if (editMode && formData._id) {
        await updateAddress(formData._id, { ...formData, userId: user._id });
      } else {
        // Exclude _id from payload when adding
        const { _id, ...addPayload } = formData;
        await addAddress({ ...addPayload, userId: user._id });
      }
      setFormData({
        label: "Home",
        name: "",
        street: "",
        landmark: "",
        city: "",
        state: "",
        postalCode: "",
        country: "India",
        phone: "",
        isDefault: true,
        _id: "",
      });
      if (onSuccess) onSuccess();
      router.push("/profile");
    } catch (err: any) {
      setSubmitError(err?.message || "Failed to save address");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 my-12">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {editMode ? "Update Address" : "Add New Address"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Full Name *</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary1 focus:border-transparent"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Phone Number *</label>
            <input
              type="tel"
              name="phone"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleInputChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary1 focus:border-transparent"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Street Address *</label>
          <input
            type="text"
            name="street"
            placeholder="Enter your street address"
            value={formData.street}
            onChange={handleInputChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary1 focus:border-transparent"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Landmark (optional)</label>
          <input
            type="text"
            name="landmark"
            placeholder="Nearby landmark"
            value={formData.landmark}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary1 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">City *</label>
            <input
              type="text"
              name="city"
              placeholder="Enter your city"
              value={formData.city}
              onChange={handleInputChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary1 focus:border-transparent"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">State *</label>
            <input
              type="text"
              name="state"
              placeholder="Enter your state"
              value={formData.state}
              onChange={handleInputChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary1 focus:border-transparent"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Postal Code *</label>
            <input
              type="text"
              name="postalCode"
              placeholder="Enter postal code"
              value={formData.postalCode}
              onChange={handleInputChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary1 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Country *</label>
            <input
              type="text"
              name="country"
              placeholder="Enter your country"
              value={formData.country}
              onChange={handleInputChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary1 focus:border-transparent"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Address Label</label>
            <select
              name="label"
              value={formData.label}
              onChange={handleInputChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary1 focus:border-transparent"
            >
              <option value="Home">Home</option>
              <option value="Work">Work</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="flex items-center space-x-2 pt-2">
          <input
            type="checkbox"
            id="isDefault"
            name="isDefault"
            checked={formData.isDefault}
            onChange={handleInputChange}
            className="h-4 w-4 text-primary1 border-gray-300 rounded focus:ring-primary1"
          />
          <label htmlFor="isDefault" className="text-sm font-medium text-gray-700">
            Set as default address
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary1 hover:bg-primary2 text-white py-3 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-primary1 focus:ring-opacity-50 disabled:opacity-70"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </span>
          ) : (
            editMode ? "Update Address" : "Add Address"
          )}
        </button>

        {submitError && (
          <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">
            {submitError}
          </div>
        )}
      </form>
    </div>
  );
};

export default CreateAddressClient;
