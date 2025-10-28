export interface RelatedEntity {
  _id: string;
  email: string;
  avatar?: string;
  mobile: string;
  company: string;
  website?: string;
  address: string;
  contactPerson: string;
  designation: string;
  status: string;
  isNotificationRead: boolean;
  isProfileCompleted: boolean;
  createdAt: string;
  updatedAt: string;
  // Add other properties from relatedId as needed
  bankDetails?: {
    bankAccountHolderName: string;
    bankAccountNumber: string;
    ifscCode: string;
    bankName: string;
    bankBranchName?: string;
  };
}

export interface Notification {
  _id: string;
  eventType: string;
  message: string;
  relatedId: RelatedEntity;
  relatedModel: string;
  createdAt: string;
  updatedAt: string;
  status: 'read' | 'unread';
  __v?: number;
}

export interface NotificationData {
  notifications: Notification[];
  total: number;
  page: number;
  limit: number;
}