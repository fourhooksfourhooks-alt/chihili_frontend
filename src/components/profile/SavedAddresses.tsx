import React, { useEffect } from "react";
import { MapPin, Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAddressStore } from "@/store/addressStore";

export default function SavedAddresses() {
  const router = useRouter();
  const { addresses, loading, error, fetchAddresses, deleteAddress } = useAddressStore();

  // Fetch addresses when component mounts
  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const handleAddAddressClick = () => {
    router.push("/address/create");
  };

  const handleEditAddress = (addressId?: string) => {
    router.push(`/address/create?id=${addressId}`);
  };

  

  const handleDeleteAddress = async (addressId: string) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      await deleteAddress(addressId);
    }
  };

  // Format address for display
  const formatAddress = (address: any) => {
    const parts = [
      address.street,
      address.landmark,
      address.city,
      address.state,
      address.country,
      address.postalCode
    ].filter(Boolean);
    return parts.join(', ');
  };

  if (loading) {
    return (
      <div className="py-12 flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary1"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12">
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      {addresses.length > 0 ? (
        <div>
          <div className="flex justify-start items-center mb-6">
          <button
            onClick={handleAddAddressClick}
            className="px-6 py-2 bg-primary1 text-white hover:bg-primary2 transition-colors duration-200 cursor-pointer rounded"
          >
            + Add New Address
          </button>
            
          </div>
          
          <div className="overflow-x-auto pb-2">
            <div className="flex gap-4 lg:grid lg:grid-cols-3 lg:gap-6 min-w-max lg:min-w-0">
              {addresses.map((address) => (
                <div
                  key={address._id}
                  className="bg-white p-4 rounded-lg border border-gray-200 flex-shrink-0 w-72 lg:w-full relative shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="mb-3 flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold  text-gray-800 font-lato pr-8">{address.name} 

                      <span className="text-xs ml-1 bg-gray-100 text-gray-600 px-2 py-1 rounded mt-1 inline-block">
                        {address.label}
                      </span>

                      </h3>

                      {/* {address.isDefault && (
                        <span className="text-xs bg-primary1 text-white px-2 py-1 rounded mt-1 ml-2 inline-block">
                          Default
                        </span>
                      )} */}
                    </div>
                  </div>
                  <div className="flex items-start mb-10">
                    <MapPin size={16} className="text-primary1 mr-2 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-gray-600 leading-relaxed font-lato">
                      <p>{formatAddress(address)}</p>
                      <p className="mt-1 text-gray-500">Phone: {address.phone}</p>
                    </div>
                  </div>
                  <div className="absolute bottom-3 right-3 flex gap-2">
                    <button 
                      onClick={() => handleEditAddress(address._id)}
                      className="text-primary1 hover:text-primary2 text-sm flex items-center gap-1 px-2 py-1 rounded transition-colors cursor-pointer"
                    >
                      <Edit size={12} />
                      <span className="font-lato text-xs">Edit</span>
                    </button>
                    <button 
                      onClick={() => handleDeleteAddress(address._id!)}
                      className="text-primary1 hover:text-primary2  text-sm flex items-center gap-1 px-2 py-1 rounded transition-colors cursor-pointer"
                    >
                      <Trash2 size={12} />
                      <span className="font-lato text-xs">Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No saved addresses
          </h3>
          <p className="text-gray-500 mb-6">
            Add your delivery addresses for faster checkout
          </p>
          <button
            onClick={handleAddAddressClick}
            className="px-6 py-2 bg-primary1 text-white hover:bg-primary2 transition-colors duration-200 cursor-pointer rounded"
          >
            Add Address
          </button>
        </div>
      )}
    </div>
  );
}