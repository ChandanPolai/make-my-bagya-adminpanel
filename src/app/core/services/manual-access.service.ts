import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiManagerService } from '../utilities/api-manager';
import { apiEndpoints } from '../constants/api-endpoint';
import { 
  ManualAccessGrant, 
  ManualAccessResponse, 
  PaginatedManualAccessResponse,
  ManualAccessUpdateRequest,
  ManualAccessRevokeRequest,
  UserManualAccessesRequest,
  UserManualAccessesResponse
} from '../interfaces/manual-access.interface';

@Injectable({
  providedIn: 'root'
})
export class ManualAccessService {
  constructor(private apiManager: ApiManagerService) {}

  // Grant manual access to user
  grantManualAccess(data: ManualAccessGrant): Observable<ManualAccessResponse> {
    return this.apiManager.post(apiEndpoints.GRANT_MANUAL_ACCESS, data);
  }

  // Get all manual accesses (paginated)
  getAllManualAccesses(paginationData: { 
    page: number; 
    limit: number; 
    search?: string 
  }): Observable<PaginatedManualAccessResponse> {
    return this.apiManager.post(apiEndpoints.LIST_MANUAL_ACCESSES, paginationData);
  }

  // Update manual access validity
  updateManualAccess(data: ManualAccessUpdateRequest): Observable<ManualAccessResponse> {
    return this.apiManager.post(apiEndpoints.UPDATE_MANUAL_ACCESS, data);
  }

  // Revoke manual access
  revokeManualAccess(data: ManualAccessRevokeRequest): Observable<ManualAccessResponse> {
    return this.apiManager.post(apiEndpoints.REVOKE_MANUAL_ACCESS, data);
  }

  // Get user's manual accesses
  getUserManualAccesses(data: UserManualAccessesRequest): Observable<UserManualAccessesResponse> {
    return this.apiManager.post(apiEndpoints.GET_USER_MANUAL_ACCESSES, data);
  }
}