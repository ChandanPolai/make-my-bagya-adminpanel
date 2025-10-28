import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiManagerService } from '../utilities/api-manager';
import { apiEndpoints } from '../constants/api-endpoint';
import {
  Service,
  ServiceResponse,
  PaginatedServiceResponse,
  CreateServiceRequest,
  GetAllServicesRequest,
  UpdateServiceRequest,
  DeleteServiceResponse
} from '../interfaces/services.interface';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {
  constructor(private apiManager: ApiManagerService) {}

  /**
   * Create a new service
   * @param data - Service data (can be FormData for image upload)
   * @returns Observable of service response
   */
  createService(data: CreateServiceRequest | FormData): Observable<ServiceResponse> {
    return this.apiManager.post(apiEndpoints.CREATE_SERVICE, data);
  }

  /**
   * Get all services with pagination and search
   * @param paginationData - Contains page, limit, search, and isActive filter
   * @returns Observable of paginated services
   */
  getAllServices(paginationData: GetAllServicesRequest): Observable<PaginatedServiceResponse> {
    return this.apiManager.post(apiEndpoints.LIST_SERVICES, paginationData);
  }

  /**
   * Get service by ID
   * @param id - Service ID
   * @returns Observable of service details
   */
  getServiceById(id: string): Observable<ServiceResponse> {
    return this.apiManager.post(apiEndpoints.GET_SERVICE_BY_ID, { id });
  }

  /**
   * Update service
   * @param id - Service ID
   * @param data - Updated service data (can be FormData for image upload)
   * @returns Observable of updated service
   */
  updateService(id: string, data: Partial<Service> | FormData): Observable<ServiceResponse> {
    if (data instanceof FormData) {
      data.append('id', id);
      return this.apiManager.post(apiEndpoints.UPDATE_SERVICE, data);
    } else {
      return this.apiManager.post(apiEndpoints.UPDATE_SERVICE, { id, ...data });
    }
  }

  /**
   * Delete service
   * @param id - Service ID
   * @returns Observable of delete response
   */
  deleteService(id: string): Observable<DeleteServiceResponse> {
    return this.apiManager.post(apiEndpoints.DELETE_SERVICE, { id });
  }
}