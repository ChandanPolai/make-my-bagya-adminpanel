import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { PaymentLogsService } from '../../../core/services/payment-logs.service';
import { PaymentLog, PaymentLogDetail, PaginatedPaymentLogResponse } from '../../../core/interfaces/payment-logs.interface';
import { swalHelper } from '../../../core/constants/swal-helper';
import { SidebarService } from '../../../core/services/sidebar.service';
import { environment } from '../../../../env/env.local';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-payment-logs',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    NgxPaginationModule
  ],
  templateUrl: './transcation.component.html',
  styleUrl: './transcation.component.scss'
})
export class TranscationComponent implements OnInit {
  mode: 'list' | 'preview' = 'list';
  paymentLogs: PaymentLog[] = [];
  currentPaymentLog: PaymentLogDetail | null = null;
  isLoading: boolean = false;
  isSidebarCollapsed: boolean = false;
  environment = environment;

  payload = {
    page: 1,
    limit: 10,
    search: ''
  };

  totalPaymentLogs = 0;
  searchTerm: string = '';

  paginationConfig = {
    id: 'payment-logs-pagination',
    itemsPerPage: this.payload.limit,
    currentPage: this.payload.page,
    totalItems: 0
  };

  statusOptions = [
    { label: 'All Status', value: '' },
    { label: 'Created', value: 'created' },
    { label: 'Partial', value: 'partial' },
    { label: 'Paid', value: 'paid' },
    { label: 'Failed', value: 'failed' }
  ];

  constructor(
    private paymentLogsService: PaymentLogsService,
    private sidebarService: SidebarService
  ) {}

  ngOnInit(): void {
    this.loadPaymentLogs();
    this.sidebarService.isCollapsed$.subscribe((isCollapsed) => {
      this.isSidebarCollapsed = isCollapsed;
    });
  }

  /**
   * Load all payment logs
   */
  loadPaymentLogs(): void {
    this.isLoading = true;
    this.paymentLogsService.getAllPaymentLogs(this.payload).subscribe({
      next: (response: PaginatedPaymentLogResponse) => {
        this.paymentLogs = response.data?.docs || [];
        this.totalPaymentLogs = response.data?.totalDocs || 0;
        this.paginationConfig.totalItems = this.totalPaymentLogs;
        this.paginationConfig.currentPage = this.payload.page;
        this.paginationConfig.itemsPerPage = this.payload.limit;
        this.isLoading = false;
      },
      error: (err) => {
        swalHelper.messageToast(err?.error?.message ?? 'Failed to load payment logs.', 'error');
        this.isLoading = false;
      }
    });
  }

  /**
   * Preview payment log details
   */
  previewPaymentLog(paymentLog: PaymentLog): void {
    if (!paymentLog._id) return;

    this.isLoading = true;
    this.paymentLogsService.getPaymentLogById(paymentLog._id).subscribe({
      next: (response) => {
        this.currentPaymentLog = response.data as PaymentLogDetail;
        this.mode = 'preview';
        this.isLoading = false;
      },
      error: (err) => {
        swalHelper.messageToast(err?.error?.message ?? 'Failed to load payment log details.', 'error');
        this.isLoading = false;
      }
    });
  }

  /**
   * Back to list
   */
  cancelPreview(): void {
    this.currentPaymentLog = null;
    this.mode = 'list';
  }

  /**
   * Search payment logs
   */
  onSearch(): void {
    this.payload.search = this.searchTerm;
    this.payload.page = 1;
    this.paginationConfig.currentPage = 1;
    this.loadPaymentLogs();
  }

  /**
   * Page change handler
   */
  onPageChange(page: number): void {
    this.payload.page = page;
    this.paginationConfig.currentPage = page;
    this.loadPaymentLogs();
  }

  /**
   * Page size change handler
   */
  onPageSizeChange(): void {
    this.payload.limit = this.paginationConfig.itemsPerPage;
    this.payload.page = 1;
    this.paginationConfig.currentPage = 1;
    this.loadPaymentLogs();
  }

  /**
   * Refresh data
   */
  refreshData(): void {
    this.loadPaymentLogs();
  }

  /**
   * Export to Excel
   */
  exportToExcel(): void {
    Swal.fire({
      title: 'Preparing export...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.paymentLogsService.getAllPaymentLogs({ page: 1, limit: 10000, search: this.searchTerm }).subscribe({
      next: (response: PaginatedPaymentLogResponse) => {
        const allPaymentLogs = response.data?.docs || [];

        if (allPaymentLogs.length === 0) {
          Swal.close();
          swalHelper.error('No payment logs to export');
          return;
        }

        try {
          const excelData = allPaymentLogs.map((log, index) => ({
            'S.No': index + 1,
            'Full Name': log.fullName,
            'Email': log.email,
            'Phone': log.phone,
            'Service': log.serviceTitle,
            'Razorpay Order ID': log.razorpayOrderId,
            'Razorpay Payment ID': log.razorpayPaymentId || 'N/A',
            'Total Amount': `₹${(log.totalAmount)}`,
            'Paid Amount': `₹${(log.paidAmount)}`,
            'Pending Amount': `₹${(log.pendingAmount)}`,
            'Status': this.getStatusText(log.status),
            'Report Generated': log.reportGenerated ? 'Yes' : 'No',
            'Email Sent': log.emailSent ? 'Yes' : 'No',
            'WhatsApp Sent': log.whatsappSent ? 'Yes' : 'No',
            'Created Date': this.formatDate(log.createdAt)
          }));

          const worksheet = XLSX.utils.json_to_sheet(excelData);
          const workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, 'Payment Logs');

          const fileName = `Payment_Logs_Export_${new Date().toISOString().split('T')[0]}.xlsx`;
          XLSX.writeFile(workbook, fileName);

          Swal.close();
          swalHelper.showToast(`Successfully exported ${allPaymentLogs.length} payment logs to Excel`, 'success');
        } catch (error) {
          Swal.close();
          swalHelper.messageToast('Failed to export payment logs to Excel', 'error');
        }
      },
      error: (err) => {
        Swal.close();
        swalHelper.messageToast(err?.error?.message ?? 'Failed to load payment logs for export', 'error');
      }
    });
  }

  /**
   * Format date
   */
  formatDate(date: string | Date | null | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Format currency (convert paise to rupees)
   */
  formatCurrency(amount: number | undefined): string {
    if (!amount && amount !== 0) return '₹0.00';
    return `₹${(amount)}`;
  }

  /**
   * Get status class
   */
  getStatusClass(status: string | undefined): string {
    const statusClasses: { [key: string]: string } = {
      'created': 'tw-bg-blue-100 tw-text-blue-800',
      'partial': 'tw-bg-yellow-100 tw-text-yellow-800',
      'paid': 'tw-bg-green-100 tw-text-green-800',
      'failed': 'tw-bg-red-100 tw-text-red-800'
    };
    return statusClasses[status || ''] || 'tw-bg-gray-100 tw-text-gray-800';
  }

  /**
   * Get status text
   */
  getStatusText(status: string | undefined): string {
    if (!status) return 'Unknown';
    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  /**
   * Get delivery icon
   */
  getDeliveryIcon(sent: boolean | undefined): string {
    return sent ? 'ph-check-circle tw-text-green-600' : 'ph-x-circle tw-text-red-600';
  }

  /**
   * Get delivery text
   */
  getDeliveryText(sent: boolean | undefined): string {
    return sent ? 'Sent' : 'Not Sent';
  }

  /**
   * Get service image
   */
  getServiceImage(image: string | undefined): string {
    if (!image || image === 'default-service.jpg') {
      return '/images/default-service.jpg';
    }
    return environment.imageUrl + image;
  }

  /**
   * Get user name from populated or direct field
   */
  getUserName(log: PaymentLog): string {
    if (typeof log.userId === 'object' && log.userId?.fullName) {
      return log.userId.fullName;
    }
    return log.fullName || 'Unknown User';
  }

  /**
   * Get user email from populated or direct field
   */
  getUserEmail(log: PaymentLog): string {
    if (typeof log.userId === 'object' && log.userId?.email) {
      return log.userId.email;
    }
    return log.email || '';
  }

  /**
   * Get user phone from populated or direct field
   */
  getUserPhone(log: PaymentLog): string {
    if (typeof log.userId === 'object' && log.userId?.phone) {
      return log.userId.phone;
    }
    return log.phone || '';
  }

  /**
   * Get service title from populated or direct field
   */
  getServiceTitle(log: PaymentLog): string {
    if (typeof log.serviceId === 'object' && log.serviceId?.title) {
      return log.serviceId.title;
    }
    return log.serviceTitle || 'Unknown Service';
  }

  /**
   * Check if profession field is available
   */
  isProfessionAvailable(user: any): boolean {
    return user && typeof user === 'object' && 'profession' in user;
  }

  /**
   * Get profession from user
   */
  getProfession(user: any): string {
    if (user && typeof user === 'object' && 'profession' in user) {
      return user.profession || 'N/A';
    }
    return 'N/A';
  }

  /**
   * Check if date of birth is available
   */
  isDateOfBirthAvailable(user: any): boolean {
    return user && typeof user === 'object' && 'dateOfBirth' in user;
  }

  /**
   * Get date of birth from user
   */
  getDateOfBirth(user: any): string {
    if (user && typeof user === 'object' && 'dateOfBirth' in user) {
      return user.dateOfBirth || 'N/A';
    }
    return 'N/A';
  }

  /**
   * Check if gender is available
   */
  isGenderAvailable(user: any): boolean {
    return user && typeof user === 'object' && 'gender' in user;
  }

  /**
   * Get gender from user
   */
  getGender(user: any): string {
    if (user && typeof user === 'object' && 'gender' in user) {
      return user.gender || 'N/A';
    }
    return 'N/A';
  }

  /**
   * Check if service is an object type (not a string)
   */
  isServiceObjectType(service: any): boolean {
    return service && typeof service === 'object' && 'title' in service;
  }

  /**
   * Get service title from object
   */
  getServiceTitleFromObject(service: any): string {
    if (service && typeof service === 'object' && 'title' in service) {
      return service.title || 'Unknown Service';
    }
    return 'Unknown Service';
  }

  /**
   * Get service description from object
   */
  getServiceDescriptionFromObject(service: any): string {
    if (service && typeof service === 'object' && 'description' in service) {
      return service.description || '';
    }
    return '';
  }

  /**
   * Get service price from object
   */
  getServicePriceFromObject(service: any): number {
    if (service && typeof service === 'object' && 'price' in service) {
      return service.price || 0;
    }
    return 0;
  }

  /**
   * Get service image from object
   */
  getServiceImageFromObject(service: any): string {
    if (service && typeof service === 'object' && 'image' in service) {
      return this.getServiceImage(service.image);
    }
    return '/images/default-service.jpg';
  }

  /**
   * Get simple service title (when service is just { title: string })
   */
  getSimpleServiceTitle(service: any): string {
    if (service && typeof service === 'object' && 'title' in service) {
      return service.title || 'Unknown Service';
    }
    return 'Unknown Service';
  }
}