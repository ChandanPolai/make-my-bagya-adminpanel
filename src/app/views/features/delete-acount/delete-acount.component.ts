// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-delete-acount',
//   imports: [],
//   templateUrl: './delete-acount.component.html',
//   styleUrl: './delete-acount.component.scss'
// })
// export class DeleteAcountComponent {

// }


import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { DeleteAccountService } from '../../../core/services/delete-acount.service';
import { DeleteRequest, PaginatedDeleteRequestResponse } from '../../../core/interfaces/delete-acount-request.interface';
import { swalHelper } from '../../../core/constants/swal-helper';
import { SidebarService } from '../../../core/services/sidebar.service';
import { ThemeService } from '../../../core/services/theme.service';
import { Theme } from '../../../core/interfaces/sidebar.interface';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-delete-acount',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgxPaginationModule,
    FormsModule
  ],
  templateUrl: './delete-acount.component.html',
  styleUrl: './delete-acount.component.scss'
})
export class DeleteAcountComponent implements OnInit {
  mode: 'list' | 'action' = 'list';
  deleteRequests: DeleteRequest[] = [];
  currentRequest: DeleteRequest | null = null;
  isLoading: boolean = false;
  isActionLoading: boolean = false;
  isSidebarCollapsed: boolean = false;
  actionForm!: FormGroup;
  
  payload = {
    page: 1,
    limit: 10,
    search: ''
  };
  totalRequests = 0;
  searchTerm: string = '';
  paginationConfig = {
    id: 'delete-requests-pagination',
    itemsPerPage: this.payload.limit,
    currentPage: this.payload.page,
    totalItems: 0
  };

  constructor(
    private fb: FormBuilder,
    private deleteAccountService: DeleteAccountService,
    private sidebarService: SidebarService,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.initializeActionForm();
    this.loadDeleteRequests();
    this.sidebarService.isCollapsed$.subscribe((isCollapsed) => {
      this.isSidebarCollapsed = isCollapsed;
    });
  }

  get currentTheme(): Theme {
    return this.themeService.getCurrentTheme();
  }

  private initializeActionForm(): void {
    this.actionForm = this.fb.group({
      action: ['', [Validators.required]]
    });
  }

  loadDeleteRequests(): void {
    this.isLoading = true;
    this.deleteAccountService.getAllDeleteRequests(this.payload).subscribe({
      next: (response: PaginatedDeleteRequestResponse) => {
        this.deleteRequests = response.data?.docs || [];
        this.totalRequests = response.data?.totalDocs || 0;
        this.paginationConfig.totalItems = this.totalRequests;
        this.paginationConfig.currentPage = this.payload.page;
        this.paginationConfig.itemsPerPage = this.payload.limit;
        this.isLoading = false;
      },
      error: (err) => {
        swalHelper.messageToast(err?.message ?? 'Failed to load delete requests.', 'error');
        this.isLoading = false;
      }
    });
  }

  onPageChange(page: number): void {
    this.payload.page = page;
    this.paginationConfig.currentPage = page;
    this.loadDeleteRequests();
  }

  onPageSizeChange(): void {
    this.payload.limit = this.paginationConfig.itemsPerPage;
    this.payload.page = 1;
    this.paginationConfig.currentPage = 1;
    this.loadDeleteRequests();
  }

  onSearch(): void {
    this.payload.search = this.searchTerm.trim();
    this.payload.page = 1;
    this.paginationConfig.currentPage = 1;
    this.loadDeleteRequests();
  }

  openActionModal(request: DeleteRequest): void {
    this.currentRequest = request;
    this.mode = 'action';
    this.resetActionForm();
  }

  handleAction(): void {
    if (this.actionForm.valid && this.currentRequest && !this.isActionLoading) {
      this.isActionLoading = true;
      const formValue = this.actionForm.value;
      
      const actionData = {
        requestId: this.currentRequest._id!,
        action: formValue.action
      };

      this.deleteAccountService.handleDeleteRequest(actionData).subscribe({
        next: (response) => {
          const actionText = formValue.action === 'approve' ? 'approved' : 'rejected';
          swalHelper.showToast(response.message || `Request ${actionText} successfully`, 'success');
          this.isActionLoading = false;
          this.cancelAction();
          this.loadDeleteRequests();
        },
        error: (err) => {
          swalHelper.messageToast(err?.message ?? 'Failed to process request.', 'error');
          this.isActionLoading = false;
        }
      });
    } else {
      this.markActionFieldsAsTouched();
      swalHelper.error('Please select an action');
    }
  }

  cancelAction(): void {
    this.mode = 'list';
    this.currentRequest = null;
    this.resetActionForm();
  }

  private resetActionForm(): void {
    this.actionForm.reset({
      action: ''
    });
  }

  private markActionFieldsAsTouched(): void {
    Object.keys(this.actionForm.controls).forEach(key => {
      this.actionForm.get(key)?.markAsTouched();
    });
  }

  isActionFieldInvalid(fieldName: string): boolean {
    const field = this.actionForm.get(fieldName);
    return !!(field?.invalid && field?.touched);
  }

  getActionFieldError(fieldName: string): string {
    const field = this.actionForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return 'Please select an action';
    }
    return '';
  }

  getDisplayName(request: DeleteRequest): string {
    if (!request.user) return 'Unknown User';
    const firstName = request.user.firstName || '';
    const lastName = request.user.lastName || '';
    return `${firstName} ${lastName}`.trim() || request.user.email || request.user.mobile_number || 'Unknown User';
  }

  formatDate(date: string | null | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'pending':
        return 'tw-bg-yellow-100 tw-text-yellow-800';
      case 'approved':
        return 'tw-bg-green-100 tw-text-green-800';
      case 'rejected':
        return 'tw-bg-red-100 tw-text-red-800';
      default:
        return 'tw-bg-gray-100 tw-text-gray-800';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Rejected';
      default:
        return 'Unknown';
    }
  }

  canTakeAction(status: string): boolean {
    return status === 'pending';
  }

  exportToExcel(): void {
    Swal.fire({
      title: 'Preparing export...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    
    // Fetch all delete requests for export
    this.deleteAccountService.getAllDeleteRequests({ page: 1, limit: 10000, search: this.searchTerm }).subscribe({
      next: (response: PaginatedDeleteRequestResponse) => {
        const allRequests = response.data?.docs || [];
        
        if (allRequests.length === 0) {
          Swal.close();
          swalHelper.error('No delete requests to export');
          return;
        }

        try {
          // Prepare data for Excel export
          const excelData = allRequests.map((request, index) => ({
            'S.No': index + 1,
            'User Name': this.getDisplayName(request),
            'Email': request.user?.email || 'N/A',
            'Mobile Number': request.user?.mobile_number || 'N/A',
            'Reason': request.reason || 'No reason provided',
            'Status': this.getStatusText(request.status),
            'Request Date': this.formatDate(request.createdAt),
            'Processed Date': request.reviewedAt ? this.formatDate(request.reviewedAt) : 'N/A'
          }));

          // Create worksheet
          const worksheet = XLSX.utils.json_to_sheet(excelData);
          
          // Create workbook
          const workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, 'Delete Requests');

          // Generate filename with current date
          const fileName = `Delete_Account_Requests_Export_${new Date().toISOString().split('T')[0]}.xlsx`;

          // Write file
          XLSX.writeFile(workbook, fileName);
          
          Swal.close();
          swalHelper.showToast(`Successfully exported ${allRequests.length} delete requests into Excel`, 'success');
        } catch (error) {
          Swal.close();
          swalHelper.messageToast('Failed to export delete requests to Excel', 'error');
        }
      },
      error: (err) => {
        Swal.close();
        swalHelper.messageToast(err?.message ?? 'Failed to load delete requests for export', 'error');
      }
    });
  }
}