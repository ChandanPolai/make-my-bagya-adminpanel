import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { PaymentService } from '../../../core/services/transcation.service';
import { Transaction, PaginatedTransactionResponse, User, Service } from '../../../core/interfaces/transcation.interface';
import { swalHelper } from '../../../core/constants/swal-helper';
import { SidebarService } from '../../../core/services/sidebar.service';
import { ThemeService } from '../../../core/services/theme.service';
import { Theme } from '../../../core/interfaces/sidebar.interface';
import { environment } from '../../../../env/env.local';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';

type PaymentStatus = 'pending' | 'success' | 'failed' | 'refunded';

@Component({
  selector: 'app-transcation',
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
  mode: 'list' | 'preview' | 'approval' = 'list';
  transactions: Transaction[] = [];
  currentTransaction: Transaction | null = null;
  isLoading: boolean = false;
  isSidebarCollapsed: boolean = false;
  environment = environment;

  payload: {
    page: number;
    limit: number;
    status: '' | PaymentStatus;
    userId: string;
  } = {
    page: 1,
    limit: 10,
    status: '',
    userId: ''
  };
  
  totalTransactions = 0;
  searchTerm: string = '';
  selectedStatus: '' | PaymentStatus = '';
  selectedUserId: string = '';
  
  paginationConfig = {
    id: 'transactions-pagination',
    itemsPerPage: this.payload.limit,
    currentPage: this.payload.page,
    totalItems: 0
  };

  statusOptions = [
    { label: 'All Status', value: '' },
    { label: 'Pending', value: 'pending' },
    { label: 'Success', value: 'success' },
    { label: 'Failed', value: 'failed' },
    { label: 'Refunded', value: 'refunded' }
  ];

  constructor(
    private paymentService: PaymentService,
    private sidebarService: SidebarService,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.loadTransactions();
    this.sidebarService.isCollapsed$.subscribe((isCollapsed) => {
      this.isSidebarCollapsed = isCollapsed;
    });
  }

  get currentTheme(): Theme {
    return this.themeService.getCurrentTheme();
  }

  loadTransactions(): void {
    this.isLoading = true;
    const requestData = {
      page: this.payload.page,
      limit: this.payload.limit,
      ...(this.payload.status && { status: this.payload.status as PaymentStatus }),
      ...(this.payload.userId && { userId: this.payload.userId })
    };

    this.paymentService.getAllPayments(requestData).subscribe({
      next: (response: PaginatedTransactionResponse) => {
        this.transactions = response.data?.docs || [];
        this.totalTransactions = response.data?.totalDocs || 0;
        this.paginationConfig.totalItems = this.totalTransactions;
        this.paginationConfig.currentPage = this.payload.page;
        this.paginationConfig.itemsPerPage = this.payload.limit;
        this.isLoading = false;
      },
      error: (err) => {
        swalHelper.messageToast(err?.message ?? 'Failed to load transactions.', 'error');
        this.isLoading = false;
      }
    });
  }

  loadApprovalPayments(): void {
    this.isLoading = true;
    const requestData = {
      page: this.payload.page,
      limit: this.payload.limit,
      ...(this.payload.status && { status: this.payload.status as PaymentStatus })
    };

    this.paymentService.getPaymentsForApproval(requestData).subscribe({
      next: (response: PaginatedTransactionResponse) => {
        this.transactions = response.data?.docs || [];
        this.totalTransactions = response.data?.totalDocs || 0;
        this.paginationConfig.totalItems = this.totalTransactions;
        this.paginationConfig.currentPage = this.payload.page;
        this.paginationConfig.itemsPerPage = this.payload.limit;
        this.isLoading = false;
      },
      error: (err) => {
        swalHelper.messageToast(err?.message ?? 'Failed to load approval payments.', 'error');
        this.isLoading = false;
      }
    });
  }

  switchToAllPayments(): void {
    this.mode = 'list';
    this.loadTransactions();
  }

  switchToApprovalPayments(): void {
    this.mode = 'approval';
    this.loadApprovalPayments();
  }

  onPageChange(page: number): void {
    this.payload.page = page;
    this.paginationConfig.currentPage = page;
    if (this.mode === 'approval') {
      this.loadApprovalPayments();
    } else {
      this.loadTransactions();
    }
  }

  onPageSizeChange(): void {
    this.payload.limit = this.paginationConfig.itemsPerPage;
    this.payload.page = 1;
    this.paginationConfig.currentPage = 1;
    if (this.mode === 'approval') {
      this.loadApprovalPayments();
    } else {
      this.loadTransactions();
    }
  }

  onStatusChange(): void {
    this.payload.status = this.selectedStatus;
    this.payload.page = 1;
    this.paginationConfig.currentPage = 1;
    if (this.mode === 'approval') {
      this.loadApprovalPayments();
    } else {
      this.loadTransactions();
    }
  }

  previewTransaction(transaction: Transaction): void {
    this.currentTransaction = transaction;
    this.mode = 'preview';
  }

  async updatePaymentStatus(transaction: Transaction, status: PaymentStatus): Promise<void> {
    const confirmation = await swalHelper.takeConfirmation(
      'Update Payment Status',
      `Are you sure you want to mark this payment as ${status}?`
    );
    
    if (confirmation.isConfirmed) {
      this.paymentService.updatePaymentStatus({
        paymentId: transaction._id,
        status: status
      }).subscribe({
        next: (response) => {
          swalHelper.showToast(response.message || 'Payment status updated successfully', 'success');
          if (this.mode === 'approval') {
            this.loadApprovalPayments();
          } else {
            this.loadTransactions();
          }
        },
        error: (err) => {
          swalHelper.messageToast(err?.message ?? 'Failed to update payment status.', 'error');
        }
      });
    }
  }

  async deleteTransaction(transaction: Transaction): Promise<void> {
    const confirmation = await swalHelper.delete();
    if (confirmation.isConfirmed && transaction._id) {
      this.paymentService.deletePayment(transaction._id).subscribe({
        next: (response) => {
          swalHelper.showToast(response.message || 'Transaction deleted successfully', 'success');
          if (this.mode === 'approval') {
            this.loadApprovalPayments();
          } else {
            this.loadTransactions();
          }
        },
        error: (err) => {
          swalHelper.messageToast(err?.message ?? 'Failed to delete transaction.', 'error');
        }
      });
    }
  }

  getUserProfileImage(user: User | string): string {
    if (typeof user === 'string') return '/images/profile-avtart.png';
    if (user.profilePic && user.profilePic !== 'default.jpg') {
      return environment.imageUrl + user.profilePic;
    }
    return '/images/profile-avtart.png';
  }

  getUserName(user: User | string): string {
    if (typeof user === 'string') return 'Unknown User';
    return user.firstName || 'Unknown User';
  }

  getUserEmail(user: User | string): string {
    if (typeof user === 'string') return '';
    return user.email || '';
  }

  getServiceName(service: Service | string | undefined): string {
    if (!service) return 'No Service';
    if (typeof service === 'string') return 'Service ID: ' + service;
    return service.name || 'Unknown Service';
  }

  formatDate(date: string | null): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  }

  getStatusClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      'pending': 'tw-bg-yellow-100 tw-text-yellow-800',
      'success': 'tw-bg-green-100 tw-text-green-800',
      'failed': 'tw-bg-red-100 tw-text-red-800',
      'refunded': 'tw-bg-blue-100 tw-text-blue-800'
    };
    return statusClasses[status] || 'tw-bg-gray-100 tw-text-gray-800';
  }

  getStatusText(status: string): string {
    return status.charAt(0).toUpperCase() + status.slice(1);
  }

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

  cancelPreview(): void {
    this.currentTransaction = null;
    this.mode = this.mode === 'approval' ? 'approval' : 'list';
  }

  refreshData(): void {
    if (this.mode === 'approval') {
      this.loadApprovalPayments();
    } else {
      this.loadTransactions();
    }
  }

  exportToExcel(): void {
    Swal.fire({
      title: 'Preparing export...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    
    // Fetch all transactions for export
    const requestData = {
      page: 1,
      limit: 10000,
      ...(this.payload.status && { status: this.payload.status as PaymentStatus }),
      ...(this.payload.userId && { userId: this.payload.userId })
    };

    const apiCall = this.mode === 'approval' 
      ? this.paymentService.getPaymentsForApproval(requestData)
      : this.paymentService.getAllPayments(requestData);

    apiCall.subscribe({
      next: (response: PaginatedTransactionResponse) => {
        const allTransactions = response.data?.docs || [];
        
        if (allTransactions.length === 0) {
          Swal.close();
          swalHelper.error('No transactions to export');
          return;
        }

        try {
          // Prepare data for Excel export
          const excelData = allTransactions.map((transaction, index) => ({
            'S.No': index + 1,
            'User Name': this.getUserName(transaction.userId),
            'User Email': this.getUserEmail(transaction.userId),
            'Service': this.getServiceName(transaction.serviceId),
            'Amount': transaction.amount,
            'Currency': transaction.currency,
            'Pending Amount': transaction.pending_amount || 0,
            'Payment Method': this.getPaymentMethodDisplay(transaction.paymentMethod),
            'Status': this.getStatusText(transaction.status),
            'Transaction Date': this.formatDate(transaction.createdAt),
            'Razorpay Transaction ID': transaction.razorpayTransactionId || 'N/A',
            'Details': transaction.details || 'N/A'
          }));

          // Create worksheet
          const worksheet = XLSX.utils.json_to_sheet(excelData);
          
          // Create workbook
          const workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions');

          // Generate filename with current date
          const fileName = `${this.mode === 'approval' ? 'Payments_For_Approval' : 'All_Transactions'}_Export_${new Date().toISOString().split('T')[0]}.xlsx`;

          // Write file
          XLSX.writeFile(workbook, fileName);
          
          Swal.close();
          swalHelper.showToast(`Successfully exported ${allTransactions.length} transactions to Excel`, 'success');
        } catch (error) {
          Swal.close();
          swalHelper.messageToast('Failed to export transactions to Excel', 'error');
        }
      },
      error: (err) => {
        Swal.close();
        swalHelper.messageToast(err?.message ?? 'Failed to load transactions for export', 'error');
      }
    });
  }
}