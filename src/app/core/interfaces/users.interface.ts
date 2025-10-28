export interface User {
  _id?: string;
  firstName?: string;
  lastName?: string;
  mobile_number: string;
  email: string;
  profilePic?: string;
  date_of_birth?: string | null;
  adminId?: string | null;
  active?: boolean;
  isDeleted?: boolean;
  isSubscribed?: boolean;
  fcm?: string;
  notifications?: Notification[];
  coupons?: Coupon[];
  purchaseHistory?: PurchaseHistory[];
  city?: string;
  company_name?: string;
  createdAt?: string;
  updatedAt?: string;
  selected?: boolean; // For bulk notification selection
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
}

export interface UserResponse {
  message: string;
  data: User | User[] | null;
  status: number;
}

export interface PaginatedUserResponse {
  message: string;
  data: {
    docs: User[];
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