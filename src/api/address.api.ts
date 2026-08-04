import axios from "./axiosInstance";

export interface Address {
  _id?: string;
  userId?: string;
  label: string;
  name: string;
  street: string;
  landmark?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault?: boolean;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AddressResponse {
  statusCode: number;
  data: {
    address: Address;
  };
  message: string;
  success: boolean;
}

export interface AddressListResponse {
  statusCode: number;
  data: {
    addresses: {
      addresses: Address[];
      pagination: {
        totalAddresses: number;
        totalPages: number | null;
      };
    };
  };
  message: string;
  success: boolean;
}

export const addAddress = async (data: Address): Promise<AddressResponse> => {
  const response = await axios.post("/address/add", data);
  return response.data;
};

export const getAllAddresses = async (): Promise<AddressListResponse> => {
  const response = await axios.get("/address/getAllAddess");
  return response.data;
};

export const getAddressById = async (addressId: string): Promise<AddressResponse> => {
  const response = await axios.get(`/address/${addressId}`);
  return response.data;
};

export const updateAddress = async (addressId: string, data: Partial<Address>): Promise<AddressResponse> => {
  const response = await axios.put(`/address/update/${addressId}`, data);
  return response.data;
};

export const deleteAddress = async (addressId: string): Promise<AddressResponse> => {
  const response = await axios.delete(`/address/delete/${addressId}`);
  return response.data;
};
