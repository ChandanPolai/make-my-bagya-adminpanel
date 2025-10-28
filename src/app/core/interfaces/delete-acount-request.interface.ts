export interface DeleteRequest {
  _id?: string;
  userId?: string;
  reason?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  user?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    mobile_number?: string;
  };
}

export interface DeleteRequestResponse {
  message: string;
  data: DeleteRequest | DeleteRequest[] | null;
  status: number;
}

export interface PaginatedDeleteRequestResponse {
  message: string;
  data: {
    docs: DeleteRequest[];
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

export interface HandleDeleteRequestRequest {
  requestId: string;
  action: 'approve' | 'reject';
}