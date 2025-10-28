import { Injectable } from '@angular/core';
import { ApiManagerService } from '../utilities/api-manager';
import { Observable } from 'rxjs';
import { ResponseModel } from '../utilities/response-model';
import { apiEndpoints } from '../constants/api-endpoint';
import { Transaction, PaginatedTransactionResponse, TransactionResponse } from '../interfaces/transcation.interface';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private apiManager: ApiManagerService) { }

  // Get all payments with pagination and filters
  getAllPayments(requestData: {
    page?: number;
    limit?: number;
    status?: 'pending' | 'success' | 'failed' | 'refunded';
    userId?: string;
  }): Observable<PaginatedTransactionResponse> {
    const payload = {
      page: requestData.page || 1,
      limit: requestData.limit || 10,
      ...(requestData.status && { status: requestData.status }),
      ...(requestData.userId && { userId: requestData.userId })
    };
    return this.apiManager.post(apiEndpoints.LIST_PAYMENTS, payload);
  }

  // Get payments that need approval (non-Razorpay only)
  getPaymentsForApproval(requestData: {
    page?: number;
    limit?: number;
    status?: 'pending' | 'success' | 'failed' | 'refunded';
  }): Observable<PaginatedTransactionResponse> {
    const payload = {
      page: requestData.page || 1,
      limit: requestData.limit || 10,
      ...(requestData.status && { status: requestData.status })
    };
    return this.apiManager.post(apiEndpoints.GET_PAYMENTS_FOR_APPROVAL, payload);
  }

  // Get payment by ID
  getPaymentById(paymentId: string): Observable<TransactionResponse> {
    return this.apiManager.post(apiEndpoints.GET_PAYMENT_BY_ID, { paymentId });
  }

  // Update payment status with admin notes
  updatePaymentStatus(requestData: {
    paymentId: string;
    status: 'pending' | 'success' | 'failed' | 'refunded';
    adminNotes?: string;
  }): Observable<TransactionResponse> {
    return this.apiManager.post(apiEndpoints.UPDATE_PAYMENT_STATUS, requestData);
  }

  // Delete payment
  deletePayment(paymentId: string): Observable<ResponseModel> {
    return this.apiManager.post(apiEndpoints.DELETE_PAYMENT, { paymentId });
  }

  // Helper method to get payment status options
  getPaymentStatusOptions(): Array<{label: string, value: string}> {
    return [
      { label: 'All Status', value: '' },
      { label: 'Pending', value: 'pending' },
      { label: 'Success', value: 'success' },
      { label: 'Failed', value: 'failed' },
      { label: 'Refunded', value: 'refunded' }
    ];
  }

  // Helper method to get payment method display names
  getPaymentMethodDisplay(method: string): string {
    const methodMap: { [key: string]: string } = {
      'razorpay': 'Razorpay',
      'imported': 'Manual Import',
      'bank_transfer': 'Bank Transfer',
      'cash': 'Cash',
      'cheque': 'Cheque',
      'upi': 'UPI'
    };
    return methodMap[method] || method;
  }

  // Helper method to get status badge class
  getStatusBadgeClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      'pending': 'badge-warning',
      'success': 'badge-success', 
      'failed': 'badge-danger',
      'refunded': 'badge-info'
    };
    return statusClasses[status] || 'badge-secondary';
  }
}