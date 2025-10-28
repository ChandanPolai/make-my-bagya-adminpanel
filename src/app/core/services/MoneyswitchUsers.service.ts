import { Injectable } from '@angular/core';
import { ApiManagerService } from '../utilities/api-manager';
import { Observable } from 'rxjs';
import { apiEndpoints } from '../constants/api-endpoint';
import {
  PaginatedMoneySwitchUserResponse,
  MoneySwitchUserResponse,
  GetAllMoneySwitchUsersRequest,
  GetMoneySwitchUserByIdRequest,
  ResendEmailRequest,
  ResendEmailResponse
} from '../interfaces/moneyswitch-users.interface';

@Injectable({
  providedIn: 'root'
})
export class MoneyswitchUsersService {
  constructor(private apiManager: ApiManagerService) {}

  /**
   * Get all Money Switch users with pagination and search
   * @param paginationData - Contains page, limit, and optional search term
   * @returns Observable of paginated users
   */
  getAllMoneySwitchUsers(paginationData: GetAllMoneySwitchUsersRequest): Observable<PaginatedMoneySwitchUserResponse> {
    return this.apiManager.post(apiEndpoints.LIST_MONEY_SWITCH_USERS, paginationData);
  }

  /**
   * Get Money Switch user by ID with complete details
   * @param id - User ID
   * @returns Observable of user details
   */
  getMoneySwitchUserById(id: string): Observable<MoneySwitchUserResponse> {
    const requestData: GetMoneySwitchUserByIdRequest = { id };
    return this.apiManager.post(apiEndpoints.GET_MONEY_SWITCH_USER_BY_ID, requestData);
  }

  /**
   * Resend email to Money Switch user
   * @param userId - User ID
   * @returns Observable of resend email response
   */
  resendEmail(userId: string): Observable<ResendEmailResponse> {
    const requestData: ResendEmailRequest = { userId };
    return this.apiManager.post(apiEndpoints.RESEND_EMAIL, requestData);
  }
}