import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { MoneyswitchUsersService } from '../../../core/services/MoneyswitchUsers.service';
import { MoneySwitchUser, MoneySwitchUserDetail } from '../../../core/interfaces/moneyswitch-users.interface';
import { swalHelper } from '../../../core/constants/swal-helper';
import { SidebarService } from '../../../core/services/sidebar.service';
import { environment } from '../../../../env/env.local';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-moneyswitch-users',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    NgxPaginationModule
  ],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  mode: 'list' | 'preview' = 'list';
  users: MoneySwitchUser[] = [];
  currentUser: MoneySwitchUserDetail | null = null;
  isLoading: boolean = false;
  isSidebarCollapsed: boolean = false;
  isResendingEmail: boolean = false;

  payload = {
    page: 1,
    limit: 10,
    search: ''
  };

  totalUsers = 0;
  searchTerm: string = '';
  paginationConfig = {
    id: 'moneyswitch-users-pagination',
    itemsPerPage: this.payload.limit,
    currentPage: this.payload.page,
    totalItems: 0
  };

  constructor(
    private moneyswitchUsersService: MoneyswitchUsersService,
    private sidebarService: SidebarService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.sidebarService.isCollapsed$.subscribe((isCollapsed) => {
      this.isSidebarCollapsed = isCollapsed;
    });
  }

  /**
   * Load all Money Switch users with pagination
   */
  loadUsers(): void {
    this.isLoading = true;
    this.moneyswitchUsersService.getAllMoneySwitchUsers(this.payload).subscribe({
      next: (response) => {
        this.users = response.data?.docs || [];
        this.totalUsers = response.data?.totalDocs || 0;
        this.paginationConfig.totalItems = this.totalUsers;
        this.paginationConfig.currentPage = this.payload.page;
        this.paginationConfig.itemsPerPage = this.payload.limit;
        this.isLoading = false;
      },
      error: (err) => {
        swalHelper.messageToast(err?.error?.message ?? 'Failed to load users.', 'error');
        this.isLoading = false;
      }
    });
  }

  /**
   * Preview user details
   */
  previewUser(user: MoneySwitchUser): void {
    if (!user._id) return;
    
    this.isLoading = true;
    this.moneyswitchUsersService.getMoneySwitchUserById(user._id).subscribe({
      next: (response) => {
        this.currentUser = response.data as MoneySwitchUserDetail;
        this.mode = 'preview';
        this.isLoading = false;
      },
      error: (err) => {
        swalHelper.messageToast(err?.error?.message ?? 'Failed to load user details.', 'error');
        this.isLoading = false;
      }
    });
  }

  /**
   * Resend email to user
   */
  resendEmail(userId: string): void {
    Swal.fire({
      title: 'Resend Email?',
      text: 'Are you sure you want to resend the money code email to this user?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, resend it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.isResendingEmail = true;
        this.moneyswitchUsersService.resendEmail(userId).subscribe({
          next: (response) => {
            this.isResendingEmail = false;
            swalHelper.showToast(response.message || 'Email resent successfully', 'success');
            // Reload user details if in preview mode
            if (this.mode === 'preview' && this.currentUser) {
              this.previewUser({ _id: userId } as MoneySwitchUser);
            }
          },
          error: (err) => {
            this.isResendingEmail = false;
            swalHelper.messageToast(err?.error?.message ?? 'Failed to resend email.', 'error');
          }
        });
      }
    });
  }

  /**
   * Back to list
   */
  backToList(): void {
    this.mode = 'list';
    this.currentUser = null;
    this.loadUsers();
  }

  /**
   * Search users
   */
  onSearch(): void {
    this.payload.search = this.searchTerm;
    this.payload.page = 1;
    this.paginationConfig.currentPage = 1;
    this.loadUsers();
  }

  /**
   * Page change handler
   */
  onPageChange(page: number): void {
    this.payload.page = page;
    this.paginationConfig.currentPage = page;
    this.loadUsers();
  }

  /**
   * Page size change handler
   */
  onPageSizeChange(): void {
    this.payload.limit = this.paginationConfig.itemsPerPage;
    this.payload.page = 1;
    this.paginationConfig.currentPage = 1;
    this.loadUsers();
  }

  /**
   * Export users to Excel
   */
  exportToExcel(): void {
    Swal.fire({
      title: 'Preparing export...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    // Fetch all users for export
    this.moneyswitchUsersService.getAllMoneySwitchUsers({ 
      page: 1, 
      limit: 10000, 
      search: this.searchTerm 
    }).subscribe({
      next: (response) => {
        const allUsers = response.data?.docs || [];

        if (allUsers.length === 0) {
          Swal.close();
          swalHelper.error('No users to export');
          return;
        }

        try {
          // Prepare data for Excel export
          const excelData = allUsers.map((user, index) => ({
            'S.No': index + 1,
            'Full Name': user.fullName || 'N/A',
            'Email': user.email || 'N/A',
            'Phone': user.phone || 'N/A',
            'Date of Birth': user.dateOfBirth || 'N/A',
            'Gender': user.gender || 'N/A',
            'Profession': user.profession || 'N/A',
            'Day Number': user.dayNumber ?? 'N/A',
            'Life Path Number': user.lifePathNumber ?? 'N/A',
            'Name Number': user.nameNumber ?? 'N/A',
            'Daily Code': user.moneyCodes?.daily || 'N/A',
            'Wealth Code': user.moneyCodes?.wealth || 'N/A',
            'Luxury Code': user.moneyCodes?.luxury || 'N/A',
            'Master Code': user.moneyCodes?.master || 'N/A',
            'Payment Status': user.paymentStatus || 'N/A',
            'Amount Paid': user.amountPaid ? `₹${(user.amountPaid / 100).toFixed(2)}` : '₹0.00',
            'Payment ID': user.paymentId || 'N/A',
            'Order ID': user.orderId || 'N/A',
            'Email Sent': user.emailSent ? 'Yes' : 'No',
            'WhatsApp Sent': user.whatsappSent ? 'Yes' : 'No',
            'Report Generated': user.reportUrl ? 'Yes' : 'No',
            'Created Date': this.formatDate(user.createdAt || null)
          }));

          // Create worksheet
          const worksheet = XLSX.utils.json_to_sheet(excelData);

          // Create workbook
          const workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, 'Money Switch Users');

          // Generate filename with current date
          const fileName = `Money_Switch_Users_Export_${new Date().toISOString().split('T')[0]}.xlsx`;

          // Write file
          XLSX.writeFile(workbook, fileName);

          Swal.close();
          swalHelper.showToast(`Successfully exported ${allUsers.length} users to Excel`, 'success');
        } catch (error) {
          Swal.close();
          swalHelper.messageToast('Failed to export users to Excel', 'error');
        }
      },
      error: (err) => {
        Swal.close();
        swalHelper.messageToast(err?.error?.message ?? 'Failed to load users for export', 'error');
      }
    });
  }

  /**
   * Format date
   */
  formatDate(date: string | null): string {
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
   * Format amount from paise to rupees
   */
  formatAmount(amount: number | undefined): string {
    if (!amount) return '₹0.00';
    return `₹${(amount)}`;
  }

  /**
   * Get payment status class
   */
  getPaymentStatusClass(status: string | undefined): string {
    switch (status) {
      case 'paid':
        return 'tw-bg-green-100 tw-text-green-800';
      case 'pending':
        return 'tw-bg-yellow-100 tw-text-yellow-800';
      case 'failed':
        return 'tw-bg-red-100 tw-text-red-800';
      default:
        return 'tw-bg-gray-100 tw-text-gray-800';
    }
  }

  /**
   * Get payment status text
   */
  getPaymentStatusText(status: string | undefined): string {
    if (!status) return 'Unknown';
    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  /**
   * Get delivery status icon
   */
  getDeliveryIcon(sent: boolean | undefined): string {
    return sent ? 'ph-check-circle tw-text-green-600' : 'ph-x-circle tw-text-red-600';
  }

  /**
   * Get report URL
   */
  getReportUrl(reportUrl: string | null | undefined): string {
    if (!reportUrl) return '';
    return environment.baseURL + reportUrl;
  }

  /**
   * Download report
   */
  downloadReport(reportUrl: string | null | undefined): void {
    if (!reportUrl) {
      swalHelper.messageToast('Report not available', 'error');
      return;
    }
    const url = this.getReportUrl(reportUrl);
    window.open(url, '_blank');
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
}