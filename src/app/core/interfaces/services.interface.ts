// core/interfaces/services.interface.ts

export interface PricingOption {
  period: 'monthly' | 'annually' | 'lifetime access' | '3 months plan' | '6 months plan' | 'annual plan' | 'trial class' | 'masterclass';
  price: number;
  description?: string;  // NAYA - har period ka description
  active?: boolean;  // NEW - for hide/show pricing options
  validity_from?: string | Date;
  validity_to?: string | Date;
}

export interface ServiceTax {
  gst?: number;
  sgst?: number;
}

export interface Service {
  _id?: string;
  name: string;
  description?: string;
  tax?: ServiceTax;
  pricingOptions: PricingOption[];
  batch_time?: string;
  accessType: 'recorded_tutorials' | 'live_session' | 'choreography';
  dance_type?: string;
  createdBy?: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt?: string | Date;
  updatedAt?: string | Date;
  isDeleted?: boolean;
}

export interface ServiceResponse {
  success: boolean;
  message: string;
  data?: Service;
  error?: string;
}

export interface PaginatedServiceResponse {
  success: boolean;
  message: string;
  data?: {
    docs: Service[];
    totalDocs: number;
    limit: number;
    page: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    nextPage: number | null;
    prevPage: number | null;
  };
  error?: string;
}

export interface ServiceCreateRequest {
  name: string;
  description?: string;
  tax?: ServiceTax;
  pricingOptions: PricingOption[];
  batch_time?: string;
  accessType: 'recorded_tutorials' | 'live_session' | 'choreography';
}

export interface ServiceUpdateRequest extends Partial<ServiceCreateRequest> {
  id: string;
}