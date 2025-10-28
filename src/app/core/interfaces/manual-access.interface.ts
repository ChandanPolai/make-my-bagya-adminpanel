// Manual Access Interfaces

export interface ManualAccessGrant {
  userId: string;
  serviceId: string;
  validity_from: string | Date;
  validity_to: string | Date | null; // null = lifetime
}

export interface ManualAccess {
  _id: string;
  transactionId: string;
  user: {
    _id: string;
    name: string;
    email: string;
    mobile_number: string;
    profilePic: string;
    active: boolean;
  };
  service: {
    _id: string;
    name: string;
    accessType: string;
    description: string;
  } | null;
  validity_from: string | Date | null;
  validity_to: string | Date | null;
  isLifetime: boolean;
  isActive: boolean;
  grantedAt: string | Date;
  details: string;
}

export interface ManualAccessResponse {
  message: string;
  data: ManualAccess | null;
  status: number;
}

export interface PaginatedManualAccessResponse {
  message: string;
  data: {
    docs: ManualAccess[];
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

export interface ManualAccessUpdateRequest {
  transactionId: string;
  validity_from?: string | Date;
  validity_to?: string | Date | null;
}

export interface ManualAccessRevokeRequest {
  transactionId: string;
}

export interface UserManualAccessesRequest {
  userId: string;
}

export interface UserManualAccessesResponse {
  message: string;
  data: {
    userId: string;
    userName: string;
    manualAccesses: {
      transactionId: string;
      service: {
        _id: string;
        name: string;
        accessType: string;
        description: string;
      };
      validity_from: string | Date | null;
      validity_to: string | Date | null;
      isLifetime: boolean;
      isActive: boolean;
      grantedAt: string | Date;
    }[];
  };
  status: number;
}