import { Injectable } from '@angular/core';
import { ApiManagerService } from '../utilities/api-manager';
import { Observable } from 'rxjs';
import { ResponseModel } from '../utilities/response-model';
import { apiEndpoints } from '../constants/api-endpoint';
import { 
  DeleteRequest, 
  PaginatedDeleteRequestResponse, 
  DeleteRequestResponse,
  HandleDeleteRequestRequest 
} from '../interfaces/delete-acount-request.interface';

@Injectable({
  providedIn: 'root'
})
export class DeleteAccountService {
  constructor(private apiManager: ApiManagerService) {}

  // Get all delete requests with pagination
  getAllDeleteRequests(paginationData: { page: number; limit: number; search?: string }): Observable<PaginatedDeleteRequestResponse> {
    return this.apiManager.post(apiEndpoints.GET_ALL_DELETE_REQUESTS, paginationData);
  }

  // Handle delete request (approve/reject)
  handleDeleteRequest(data: HandleDeleteRequestRequest): Observable<DeleteRequestResponse> {
    return this.apiManager.post(apiEndpoints.HANDLE_DELETE_REQUEST, data);
  }
}