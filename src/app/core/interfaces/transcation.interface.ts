export interface PricingOption {
  period: "3 months" | "6 months" | "1 year";
  price: number;
  validity_from: string;
  validity_to: string;
}

export interface Service {
  _id: string;
  name: string;
  description: string;
  tax: {
    gst: number;
    sgst: number;
  };
  pricingOptions: PricingOption[];
  dance_type: string;
  batch_time: string;
  createdBy: string;
  createdAt: string;
}

export interface Notification {
  message: string;
  type: 'content' | 'subscription' | 'general';
  createdAt: string;
  read: boolean;
}

export interface Coupon {
  couponId: string;
  redeemed: boolean;
  redeemedAt?: string;
}

export interface PurchaseHistory {
  transactionId: string;
  serviceId: string;
  purchaseDate: string;
  validity_from?: string;
  validity_to?: string;
  paid_amount: number;
  pending_amount: number;
}

export interface User {
  _id: string;
  firstName: string;
  mobile_number: string;
  email: string;
  password: string;
  profilePic: string;
  date_of_birth?: string;
  adminId?: string;
  active: boolean;
  isSubscribed: boolean;
  fcm: string;
  notifications: Notification[];
  coupons: Coupon[];
  purchaseHistory: PurchaseHistory[];
  machineId: string;
  otp: string;
  otpExpires?: string;
  verified: boolean;
  isDeleted: boolean;
  city: string;
  company_name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  _id: string;
  userId: User | string;
  serviceId?: Service | string;
  razorpayTransactionId?: string;
  amount: number;
  pending_amount: number;
  currency: string;
  status: 'pending' | 'success' | 'failed' | 'refunded';
  paymentMethod: string;
  image: string;
  details: string;
  createdAt: string;
}

export interface PaginatedTransactionResponse {
  success: boolean;
  message: string;
  data: {
    docs: Transaction[];
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
}

export interface TransactionResponse {
  success: boolean;
  message: string;
  data: Transaction;
}

export interface UpdatePaymentStatusRequest {
  paymentId: string;
  status: 'pending' | 'success' | 'failed' | 'refunded';
  adminNotes?: string;
}