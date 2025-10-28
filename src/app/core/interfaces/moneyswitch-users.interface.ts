// Money Switch User Interface
export interface MoneySwitchUser {
  _id?: string;
  fullName: string;
  dateOfBirth: string; // DD-MM-YYYY format
  gender?: 'Male' | 'Female' | 'Other';
  profession?: string;
  email: string;
  phone: string;
  
  // Numerology Fields
  dayNumber?: number | null;
  lifePathNumber?: number | null;
  nameNumber?: number | null;
  
  // Money Codes
  moneyCodes?: MoneyCodes;
  
  // Payment Details
  paymentId?: string | null;
  orderId?: string | null;
  paymentStatus?: 'pending' | 'paid' | 'failed';
  amountPaid?: number;
  
  // Report Details
  reportUrl?: string | null;
  reportGeneratedAt?: string | null;
  
  // Delivery Status
  emailSent?: boolean;
  whatsappSent?: boolean;
  
  // Service Reference
  serviceId?: ServiceInfo | string | null;
  
  // Timestamps
  createdAt?: string;
  updatedAt?: string;
}

export interface MoneyCodes {
  daily?: string;
  wealth?: string;
  luxury?: string;
  master?: string;
}

export interface ServiceInfo {
  _id?: string;
  title?: string;
  description?: string;
  price?: number;
  image?: string;
}

export interface Numerology {
  dayNumber?: number | null;
  lifePathNumber?: number | null;
  nameNumber?: number | null;
}

export interface PaymentInfo {
  status?: 'pending' | 'paid' | 'failed';
  amountPaid?: number;
  paymentId?: string | null;
  orderId?: string | null;
}

export interface PaymentLogInfo {
  id?: string;
  totalAmount?: number;
  paidAmount?: number;
  pendingAmount?: number;
  status?: string;
  reportGenerated?: boolean;
  emailSent?: boolean;
  whatsappSent?: boolean;
}

export interface ReportInfo {
  url?: string | null;
  generatedAt?: string | null;
}

export interface DeliveryInfo {
  emailSent?: boolean;
  whatsappSent?: boolean;
}

// Detailed User Response (for getUserById)
export interface MoneySwitchUserDetail {
  userId?: string;
  fullName?: string;
  dateOfBirth?: string;
  gender?: 'Male' | 'Female' | 'Other';
  profession?: string;
  email?: string;
  phone?: string;
  service?: ServiceInfo | null;
  numerology?: Numerology;
  moneyCodes?: MoneyCodes;
  payment?: PaymentInfo;
  paymentLog?: PaymentLogInfo | null;
  report?: ReportInfo;
  delivery?: DeliveryInfo;
  createdAt?: string;
  updatedAt?: string;
}

// API Response Interfaces
export interface MoneySwitchUserResponse {
  message: string;
  data: MoneySwitchUser | MoneySwitchUserDetail | null;
  status: number;
}

export interface PaginatedMoneySwitchUserResponse {
  message: string;
  data: {
    docs: MoneySwitchUser[];
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
export interface GetAllMoneySwitchUsersRequest {
  page: number;
  limit: number;
  search?: string;
}

export interface GetMoneySwitchUserByIdRequest {
  id: string;
}

export interface ResendEmailRequest {
  userId: string;
}

// Resend Email Response
export interface ResendEmailResponse {
  message: string;
  data: null;
  status: number;
}