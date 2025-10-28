// Service Interface
export interface Service {
  _id?: string;
  title: string;
  description: string;
  price: number;
  image?: string;
  isActive?: boolean;
  createdBy?: AdminInfo | string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

// Admin Info (populated in response)
export interface AdminInfo {
  _id?: string;
  name?: string;
  email?: string;
}

// API Response Interfaces
export interface ServiceResponse {
  message: string;
  data: Service | null;
  status: number;
}

export interface PaginatedServiceResponse {
  message: string;
  data: {
    docs: Service[];
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
export interface CreateServiceRequest {
  title: string;
  description: string;
  price: number;
  image?: string;
  isActive?: boolean;
}

export interface GetAllServicesRequest {
  page: number;
  limit: number;
  search?: string;
  isActive?: boolean;
}

export interface GetServiceByIdRequest {
  id: string;
}

export interface UpdateServiceRequest {
  id: string;
  title?: string;
  description?: string;
  price?: number;
  image?: string;
  isActive?: boolean;
}

export interface DeleteServiceRequest {
  id: string;
}

// Delete Response with message
export interface DeleteServiceResponse {
  message: string;
  data: null;
  status: number;
}