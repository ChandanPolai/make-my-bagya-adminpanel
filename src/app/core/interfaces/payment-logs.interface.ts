// Payment Log Interface
export interface PaymentLog {
  _id?: string;
  
  // Razorpay Details
  razorpayOrderId: string;
  razorpayPaymentId?: string | null;
  razorpaySignature?: string | null;
  
  // Service Info
  serviceId?: PaymentServiceInfo | string;
  serviceTitle: string;
  
  // User Info
  userId?: PaymentUserInfo | string | null;
  fullName: string;
  email: string;
  phone: string;
  
  // Payment Amounts
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  
  // Status
  status: 'created' | 'partial' | 'paid' | 'failed';
  
  // Delivery
  reportGenerated: boolean;
  emailSent: boolean;
  whatsappSent: boolean;
  
  // Timestamps
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

// Service Info (populated in response)
export interface PaymentServiceInfo {
  _id?: string;
  title?: string;
  description?: string;
  price?: number;
  image?: string;
}

// User Info (populated in response)
export interface PaymentUserInfo {
  _id?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: 'Male' | 'Female' | 'Other';
  profession?: string;
}

// Razorpay Details
export interface RazorpayInfo {
  orderId?: string;
  paymentId?: string | null;
  signature?: string | null;
}

// Payment Info
export interface PaymentAmount {
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  status: 'created' | 'partial' | 'paid' | 'failed';
}

// Delivery Info
export interface DeliveryStatus {
  reportGenerated: boolean;
  emailSent: boolean;
  whatsappSent: boolean;
}

// Detailed Payment Log Response (for getPaymentLogById)
export interface PaymentLogDetail {
  paymentLogId?: string;
  razorpay?: RazorpayInfo;
  service?: PaymentServiceInfo | { title: string };
  user?: PaymentUserInfo | {
    fullName: string;
    email: string;
    phone: string;
  };
  payment?: PaymentAmount;
  delivery?: DeliveryStatus;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

// API Response Interfaces
export interface PaymentLogResponse {
  message: string;
  data: PaymentLog | PaymentLogDetail | null;
  status: number;
}

export interface PaginatedPaymentLogResponse {
  message: string;
  data: {
    docs: PaymentLog[];
    totalDocs: number;
    limit: number;
    totalPages: number;
    page: number;
    pagingCounter: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    prevPage: number | null;
    nextPage: number | null;
  };
  status: number;
}

// Request Interfaces
export interface GetAllPaymentLogsRequest {
  page: number;
  limit: number;
  search?: string;
}

export interface GetPaymentLogByIdRequest {
  id: string;
}