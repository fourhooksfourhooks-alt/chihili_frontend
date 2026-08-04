"use client";

import React, { useState, useEffect } from "react";
import { getAddressById } from "@/api/address.api";
import { useAddressStore } from "@/store/addressStore";
import { useAuthStore } from "@/store/authStore";
import { Edit, MapPin, Trash2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export const AddressConent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cartId = searchParams.get('cartId');
  
  const {
    addresses,
    loading,
    error,
    fetchAddresses,
    addAddress,
    deleteAddress,
  } = useAddressStore();
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
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (user?._id) fetchAddresses();
  }, [user?._id, fetchAddresses]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    let newValue: string | boolean = value;
    if (type === "checkbox" && "checked" in e.target) {
      newValue = (e.target as HTMLInputElement).checked;
    }
    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const indianStates = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Orissa",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
  ];

  const countries = [
    "India",
    "United States",
    "United Kingdom",
    "Canada",
    "Australia",
  ];

  const RequiredLabel = ({
    children,
    required = false,
  }: {
    children: React.ReactNode;
    required?: boolean;
  }) => (
    <label className="block text-sm font-medium text-gray-700 mb-1 font-lato">
      {children}
      {required && <span className="text-secondary2 ml-1">*</span>}
    </label>
  );

  return (
    <div className="max-w-[90rem] mx-auto p-6 py-4 my-8 min-h-screen font-lato">
      {/* Header: title (left) and Create Address button (right) */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-800 font-lato">Addresses</h1>
        <button
          className="bg-primary1 text-white px-6 py-2 rounded font-medium hover:bg-primary2 transition-colors"
          onClick={() => router.push("/address/create")}
        >
          + Create Address
        </button>
      </div>
      {/* Previously Added Addresses */}
      <div className="mb-8">
        <h2 className="text-lg font-medium text-gray-800 mb-10 font-lato">
          Previously Added
        </h2>
        {loading && <p className="text-gray-500">Loading addresses...</p>}
        {error && <p className="text-red-500">{error}</p>}
        <div className="overflow-x-auto pb-2">
          <div className="flex gap-4 lg:grid lg:grid-cols-5 lg:gap-4 min-w-max lg:min-w-0">
            {addresses.map((address) => (
              <div
                key={address._id ?? ""}
                className={`bg-secondary p-4 rounded-lg border border-gray-200 flex-shrink-0 w-64 lg:w-auto relative text-left ${
                  selectedAddressId === (address._id ?? "")
                    ? "border-primary1"
                    : ""
                }`}
              >
                <div className="mb-2 flex justify-between items-center">
                  <h3 className="font-semibold text-gray-800 font-lato">
                    {address.name}
                  </h3>
                </div>
                <div className="flex items-start mb-8">
                  <MapPin
                    size={16}
                    className="text-primary1 mr-2 mt-0.5 flex-shrink-0"
                  />
                  <p className="text-xs text-gray-600 leading-relaxed font-lato">
                    {address.street},{" "}
                    {address.landmark && `${address.landmark}, `}
                    {address.city}, {address.state}, {address.country}.{" "}
                    {address.postalCode}
                  </p>
                </div>

                <div className="flex justify-between items-center absolute bottom-3 w-[calc(100%-2rem)]">
                  <div className="flex gap-2">
                  <button
                    className="text-primary1 hover:text-primary2 cursor-pointer"
                    title="Edit"
                    onClick={() => {
                    const id = address._id ?? "";
                    router.push(`/address/create?id=${id}`);
                    }}
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    className="text-primary1 hover:text-primary2 cursor-pointer"
                    title="Delete" 
                    onClick={async () => {
                    if (
                      window.confirm(
                      "Are you sure you want to delete this address?"
                      )
                    ) {
                      await deleteAddress(address._id ?? "");
                      if (selectedAddressId === address._id) {
                      setSelectedAddressId("");
                      }
                    }
                    }}
                  >
                    <Trash2 size={18} />
                  </button>
                  </div>
                  {selectedAddressId === (address._id ?? "") ? (
                  <button
                    className="text-primary1 text-xs font-lato px-2 py-1 border border-primary1 rounded hover:bg-primary1 hover:text-white cursor-pointer"
                    onClick={() => {
                    setSelectedAddressId("");
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
                    }}
                  >
                    Deselect
                  </button>
                  ) : (
                  <button
                    className="text-primary1 text-xs font-lato px-2 py-1 border border-primary1 rounded hover:bg-primary1 hover:text-white cursor-pointer"
                    onClick={async () => {
                    const id = address._id ?? "";
                    setSelectedAddressId(id);
                    try {
                      const res = await getAddressById(id);
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
                        isDefault:
                        typeof addr.isDefault === "boolean"
                          ? addr.isDefault
                          : true,
                        _id: addr._id ?? "",
                      });
                      setEditMode(false);
                      }
                    } catch (err) {}
                    }}
                  >
                    Select
                  </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Address Form */}
      {/* Enter Contact Details */}
      <div className="my-10">
        <h3 className="text-lg font-medium mb-4 text-gray-800 font-lato">
          Contact Name
        </h3>
        <div className="mb-4">
          <RequiredLabel required>Name</RequiredLabel>
          {selectedAddressId ? (
            <p className="w-full p-3 border border-gray-300 text-gray-900 font-lato rounded">
              {formData.name}
            </p>
          ) : (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full p-3 border border-gray-300 focus:ring-2 focus:ring-secondary1 focus:border-transparent outline-none font-lato"
            />
          )}
        </div>
      </div>

      {/* Shipping Information */}
      <div className="my-10">
        <h3 className="text-lg font-medium mb-4 text-gray-800 font-lato">
          Shipping Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <RequiredLabel required>Street</RequiredLabel>
            {selectedAddressId ? (
              <p className="w-full p-3 border border-gray-300 text-gray-900 font-lato rounded">
                {formData.street}
              </p>
            ) : (
              <input
                type="text"
                name="street"
                placeholder="Street Address"
                value={formData.street}
                onChange={handleInputChange}
                required
                className="w-full p-3 border border-gray-300 focus:ring-2 focus:ring-secondary1 focus:border-transparent outline-none font-lato"
              />
            )}
          </div>
          <div>
            <RequiredLabel>Landmark</RequiredLabel>
            {selectedAddressId ? (
              <p className="w-full p-3 border border-gray-300 text-gray-900 font-lato rounded">
                {formData.landmark || "N/A"}
              </p>
            ) : (
              <input
                type="text"
                name="landmark"
                placeholder="Landmark (optional)"
                value={formData.landmark}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 focus:ring-2 focus:ring-secondary1 focus:border-transparent outline-none font-lato"
              />
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <RequiredLabel required>City</RequiredLabel>
            {selectedAddressId ? (
              <p className="w-full p-3 border border-gray-300 text-gray-900 font-lato rounded">
                {formData.city}
              </p>
            ) : (
              <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleInputChange}
                required
                className="w-full p-3 border border-gray-300 focus:ring-2 focus:ring-secondary1 focus:border-transparent outline-none font-lato"
              />
            )}
          </div>
          <div>
            <RequiredLabel required>State</RequiredLabel>
            {selectedAddressId ? (
              <p className="w-full p-3 border border-gray-300 text-gray-900 font-lato rounded">
                {formData.state}
              </p>
            ) : (
              <select
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                required
                className="w-full p-3 border border-gray-300 focus:ring-2 focus:ring-secondary1 focus:border-transparent outline-none bg-white font-lato"
              >
                <option value="">Select State</option>
                {indianStates.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <RequiredLabel required>Country</RequiredLabel>
            {selectedAddressId ? (
              <p className="w-full p-3 border border-gray-300 text-gray-900 font-lato rounded">
                {formData.country}
              </p>
            ) : (
              <select
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                required
                className="w-full p-3 border border-gray-300 focus:ring-2 focus:ring-secondary1 focus:border-transparent outline-none bg-white font-lato"
              >
                <option value="">Select Country</option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div>
            <RequiredLabel required>Postal Code</RequiredLabel>
            {selectedAddressId ? (
              <p className="w-full p-3 border border-gray-300 text-gray-900 font-lato rounded">
                {formData.postalCode}
              </p>
            ) : (
              <input
                type="text"
                name="postalCode"
                placeholder="Postal Code"
                value={formData.postalCode}
                onChange={handleInputChange}
                required
                className="w-full p-3 border border-gray-300 focus:ring-2 focus:ring-secondary1 focus:border-transparent outline-none font-lato"
              />
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <RequiredLabel required>Phone</RequiredLabel>
            {selectedAddressId ? (
              <p className="w-full p-3 border border-gray-300 text-gray-900 font-lato rounded">
                {formData.phone}
              </p>
            ) : (
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="w-full p-3 border border-gray-300 focus:ring-2 focus:ring-secondary1 focus:border-transparent outline-none font-lato"
              />
            )}
          </div>
          <div>
            <RequiredLabel required>Label</RequiredLabel>
            {selectedAddressId ? (
              <p className="w-full p-3 border border-gray-300 text-gray-900 font-lato rounded">
                {formData.label}
              </p>
            ) : (
              <select
                name="label"
                value={formData.label}
                onChange={handleInputChange}
                required
                className="w-full p-3 border border-gray-300 focus:ring-2 focus:ring-secondary1 focus:border-transparent outline-none bg-white font-lato"
              >
                <option value="Home">Home</option>
                <option value="Work">Work</option>
                <option value="Other">Other</option>
              </select>
            )}
          </div>
        </div>
      </div>

      {/* Billing Information */}
      {/* Billing fields removed for API compatibility */}

      {/* Proceed to Pay Button */}
      <button
        type="button"
        onClick={() => {
          if (!selectedAddressId) {
            setSubmitError("Please select an address");
            return;
          }
          // Pass both cartId and addressId to payment page
          const paymentUrl = cartId 
            ? `/payment?addressId=${selectedAddressId}&cartId=${cartId}` 
            : `/payment?addressId=${selectedAddressId}`;
          router.push(paymentUrl);
        }}
        disabled={submitLoading}
        className="w-full mt-6 bg-primary1 hover:bg-primary2 text-white font-medium py-3 px-6 transition-colors cursor-pointer disabled:opacity-50"
      >
        {submitLoading ? "Saving..." : "Proceed to Pay"}
      </button>
      {submitError && (
        <p className="text-red-500 text-sm mt-2">{submitError}</p>
      )}
    </div>
  );
};


