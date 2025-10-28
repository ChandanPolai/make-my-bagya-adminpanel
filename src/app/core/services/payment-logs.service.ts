import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiManagerService } from '../utilities/api-manager';
import { apiEndpoints } from '../constants/api-endpoint';
import {
  PaymentLog,
  PaymentLogResponse,
  PaginatedPaymentLogResponse,
  GetAllPaymentLogsRequest,
  GetPaymentLogByIdRequest
} from '../interfaces/payment-logs.interface';

@Injectable({
  providedIn: 'root'
})
export class PaymentLogsService {
  constructor(private apiManager: ApiManagerService) {}

  /**
   * Get all payment logs with pagination and search
   * @param paginationData - Contains page, limit, and optional search term
   * @returns Observable of paginated payment logs
   */
  getAllPaymentLogs(paginationData: GetAllPaymentLogsRequest): Observable<PaginatedPaymentLogResponse> {
    return this.apiManager.post(apiEndpoints.LIST_PAYMENT_LOGS, paginationData);
  }

  /**
   * Get payment log by ID with complete details
   * @param id - Payment Log ID
   * @returns Observable of payment log details
   */
  getPaymentLogById(id: string): Observable<PaymentLogResponse> {
    const requestData: GetPaymentLogByIdRequest = { id };
    return this.apiManager.post(apiEndpoints.GET_PAYMENT_LOG_BY_ID, requestData);
  }
}