import axios from "./axiosInstance";

export interface ScanDetail {
  ScanDateTime: string;
  ScanType: string;
  Scan: string;
  StatusDateTime: string;
  ScannedLocation: string;
  StatusCode: string;
  Instructions: string;
}

export interface StatusHistoryItem {
  ScanDetail: ScanDetail;
}

export interface ShipmentProduct {
  productId: string;
  quantity: number;
  price: number;
  _id: string;
}

export interface Shipment {
  _id: string;
  userId: string;
  orderId: string;
  paymentId: string;
  waybill: string;
  status: string;
  statusHistory: StatusHistoryItem[];
  consigneeName: string;
  consigneePhone: string;
  city: string;
  state: string;
  country: string;
  products: ShipmentProduct[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  deliveredAt?: string;
  canceledAt?: string;
}

export interface TrackShipmentResponse {
  statusCode: number;
  data: {
    tracking: Shipment;
  };
  message: string;
  success: boolean;
}

export interface CreateShipmentRequest {
  orderId: string;
  addressId: string;
}

export interface CreateShipmentResponse {
  statusCode: number;
  data: {
    shipment: Shipment;
  };
  message: string;
  success: boolean;
}

export interface CancelShipmentResponse {
  statusCode: number;
  data: {
    cancelled: Shipment;
  };
  message: string;
  success: boolean;
}

// Track shipment by order ID
export const trackShipment = async (orderId: string): Promise<TrackShipmentResponse> => {
  
  try {
    const response = await axios.get(`/shipment/track/${orderId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create a new shipment
export const createShipment = async (data: CreateShipmentRequest): Promise<CreateShipmentResponse> => {
  const response = await axios.post("/shipment/create", data);
  return response.data;
};

// Cancel shipment by order ID
export const cancelShipment = async (orderId: string): Promise<CancelShipmentResponse> => {
  const response = await axios.delete(`/shipment/cancel/${orderId}`);
  return response.data;
};
