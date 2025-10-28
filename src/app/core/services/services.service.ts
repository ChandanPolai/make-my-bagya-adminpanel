import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiManagerService } from '../utilities/api-manager';
import { apiEndpoints } from '../constants/api-endpoint';
import { Service, ServiceResponse, PaginatedServiceResponse } from '../interfaces/services.interface';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {
  constructor(private apiManager: ApiManagerService) {}

  // Get all services (paginated + search)
  getAllServices(paginationData: { page: number; limit: number; search?: string }): Observable<PaginatedServiceResponse> {
    return this.apiManager.post(apiEndpoints.LIST_SERVICES, paginationData);
  }

  // Get service by ID
  getServiceById(id: string): Observable<ServiceResponse> {
    return this.apiManager.post(apiEndpoints.GET_SERVICE_BY_ID, { id });
  }

  // Create new service
  createService(data: Partial<Service>): Observable<ServiceResponse> {
    return this.apiManager.post(apiEndpoints.CREATE_SERVICE, data);
  }

  // Update service
updateService(id: string, data: Partial<Service>): Observable<ServiceResponse> {
  return this.apiManager.post(apiEndpoints.UPDATE_SERVICE, { id, ...data });
}
  // Delete service
  deleteService(id: string): Observable<ServiceResponse> {
    return this.apiManager.post(apiEndpoints.DELETE_SERVICE, { id });
  }
}
