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

export interface SendNotificationRequest {
  userId?: string;
  userIds?: string[];
  message: string;
  type: 'content' | 'subscription' | 'general';
}

export interface NotificationResponse {
  message: string;
  data: any;
  status: number;
}