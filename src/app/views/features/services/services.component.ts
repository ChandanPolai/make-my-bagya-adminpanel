import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { ServicesService } from '../../../core/services/services.service';
import { Service, PaginatedServiceResponse } from '../../../core/interfaces/services.interface';
import { swalHelper } from '../../../core/constants/swal-helper';
import { SidebarService } from '../../../core/services/sidebar.service';
import { environment } from '../../../../env/env.local';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
    NgxPaginationModule
  ],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef<HTMLInputElement>;

  mode: 'list' | 'create' | 'edit' | 'preview' = 'list';
  services: Service[] = [];
  currentService: Service | null = null;
  currentServiceId?: string;
  isLoading: boolean = false;
  isSidebarCollapsed: boolean = false;

  serviceForm!: FormGroup;
  selectedFile: File | null = null;
  fileError: string | null = null;
  maxFileSize = 5 * 1024 * 1024; // 5MB
  allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];

  // Pagination & Search
  payload = {
    page: 1,
    limit: 10,
    search: '',
    isActive: undefined as boolean | undefined
  };
  totalServices = 0;
  searchTerm: string = '';
  filterStatus: string = 'all'; // 'all', 'active', 'inactive'

  paginationConfig = {
    id: 'services-pagination',
    itemsPerPage: this.payload.limit,
    currentPage: this.payload.page,
    totalItems: 0
  };

  constructor(
    private fb: FormBuilder,
    private servicesService: ServicesService,
    private sidebarService: SidebarService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadServices();
    this.sidebarService.isCollapsed$.subscribe((isCollapsed) => {
      this.isSidebarCollapsed = isCollapsed;
    });
  }

  /**
   * Initialize service form
   */
  private initializeForm(): void {
    this.serviceForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      price: [0, [Validators.required, Validators.min(1)]],
      image: [''],
      isActive: [true]
    });
  }

  /**
   * Load all services
   */
  loadServices(): void {
    this.isLoading = true;
    this.servicesService.getAllServices(this.payload).subscribe({
      next: (response: PaginatedServiceResponse) => {
        this.services = response.data?.docs || [];
        this.totalServices = response.data?.totalDocs || 0;
        this.paginationConfig.totalItems = this.totalServices;
        this.paginationConfig.currentPage = this.payload.page;
        this.paginationConfig.itemsPerPage = this.payload.limit;
        this.isLoading = false;
      },
      error: (err) => {
        swalHelper.messageToast(err?.error?.message ?? 'Failed to load services.', 'error');
        this.isLoading = false;
      }
    });
  }

  /**
   * Create new service
   */
  createNew(): void {
    this.mode = 'create';
    this.currentService = null;
    this.currentServiceId = undefined;
    this.resetForm();
  }

  /**
   * Edit existing service
   */
  editService(service: Service): void {
    if (!service._id) return;

    this.isLoading = true;
    this.servicesService.getServiceById(service._id).subscribe({
      next: (response) => {
        this.currentService = response.data;
        this.currentServiceId = service._id;
        this.mode = 'edit';
        this.populateForm(response.data as Service);
        this.isLoading = false;
      },
      error: (err) => {
        swalHelper.messageToast(err?.error?.message ?? 'Failed to load service details.', 'error');
        this.isLoading = false;
      }
    });
  }

  /**
   * Preview service
   */
  previewService(service: Service): void {
    if (!service._id) return;

    this.isLoading = true;
    this.servicesService.getServiceById(service._id).subscribe({
      next: (response) => {
        this.currentService = response.data;
        this.mode = 'preview';
        this.isLoading = false;
      },
      error: (err) => {
        swalHelper.messageToast(err?.error?.message ?? 'Failed to load service details.', 'error');
        this.isLoading = false;
      }
    });
  }

  /**
   * Delete service
   */
  deleteService(service: Service): void {
    if (!service._id) return;

    Swal.fire({
      title: 'Delete Service?',
      html: `Are you sure you want to delete <strong>${service.title}</strong>?<br><br>
             <small class="text-danger">Warning: This action cannot be undone. The service will be permanently deleted.</small>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;
        this.servicesService.deleteService(service._id!).subscribe({
          next: (response) => {
            this.isLoading = false;
            swalHelper.showToast(response.message || 'Service deleted successfully', 'success');
            this.loadServices();
          },
          error: (err) => {
            this.isLoading = false;
            swalHelper.messageToast(err?.error?.message ?? 'Failed to delete service.', 'error');
          }
        });
      }
    });
  }

  /**
   * Populate form with service data
   */
  private populateForm(service: Service): void {
    this.serviceForm.patchValue({
      title: service.title,
      description: service.description,
      price: service.price,
      isActive: service.isActive ?? true
    });
  }

  /**
   * Submit form (Create or Update)
   */
  onSubmit(): void {
    if (this.serviceForm.invalid) {
      this.markAllFieldsAsTouched();
      swalHelper.messageToast('Please fill all required fields correctly.', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('title', this.serviceForm.get('title')?.value);
    formData.append('description', this.serviceForm.get('description')?.value);
    formData.append('price', this.serviceForm.get('price')?.value.toString());
    formData.append('isActive', this.serviceForm.get('isActive')?.value.toString());

    // Add image if selected
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.isLoading = true;

    if (this.mode === 'create') {
      // Create new service
      this.servicesService.createService(formData).subscribe({
        next: (response) => {
          this.isLoading = false;
          swalHelper.showToast(response.message || 'Service created successfully', 'success');
          this.mode = 'list';
          this.resetForm();
          this.loadServices();
        },
        error: (err) => {
          this.isLoading = false;
          swalHelper.messageToast(err?.error?.message ?? 'Failed to create service.', 'error');
        }
      });
    } else if (this.mode === 'edit' && this.currentServiceId) {
      // Update existing service
      this.servicesService.updateService(this.currentServiceId, formData).subscribe({
        next: (response) => {
          this.isLoading = false;
          swalHelper.showToast(response.message || 'Service updated successfully', 'success');
          this.mode = 'list';
          this.resetForm();
          this.loadServices();
        },
        error: (err) => {
          this.isLoading = false;
          swalHelper.messageToast(err?.error?.message ?? 'Failed to update service.', 'error');
        }
      });
    }
  }

  /**
   * Cancel form and go back to list
   */
  cancelForm(): void {
    this.mode = 'list';
    this.resetForm();
  }

  /**
   * Back to list from preview
   */
  backToList(): void {
    this.mode = 'list';
    this.currentService = null;
  }

  /**
   * Reset form
   */
  private resetForm(): void {
    this.serviceForm.reset({
      title: '',
      description: '',
      price: 0,
      image: '',
      isActive: true
    });
    this.selectedFile = null;
    this.fileError = null;
    this.clearFileInput();
  }

  /**
   * Handle file selection
   */
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.validateAndSetFile(file);
    }
  }

  /**
   * Validate and set file
   */
  private validateAndSetFile(file: File): void {
    this.fileError = null;

    if (!this.allowedFileTypes.includes(file.type)) {
      this.fileError = 'Only JPG, JPEG, and PNG files are allowed';
      this.clearFileInput();
      return;
    }

    if (file.size > this.maxFileSize) {
      this.fileError = 'File size must be less than 5MB';
      this.clearFileInput();
      return;
    }

    this.selectedFile = file;
  }

  /**
   * Remove selected file
   */
  removeSelectedFile(): void {
    this.selectedFile = null;
    this.fileError = null;
    this.clearFileInput();
  }

  /**
   * Clear file input
   */
  private clearFileInput(): void {
    if (this.fileInput?.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
  }

  /**
   * Get image preview URL
   */
  getImagePreviewUrl(): string | null {
    if (this.selectedFile) {
      return URL.createObjectURL(this.selectedFile);
    }
    return null;
  }

  /**
   * Get file size in human readable format
   */
  getFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Search services
   */
  onSearch(): void {
    this.payload.search = this.searchTerm;
    this.payload.page = 1;
    this.paginationConfig.currentPage = 1;
    this.loadServices();
  }

  /**
   * Filter by status
   */
  onFilterChange(): void {
    if (this.filterStatus === 'active') {
      this.payload.isActive = true;
    } else if (this.filterStatus === 'inactive') {
      this.payload.isActive = false;
    } else {
      this.payload.isActive = undefined;
    }
    this.payload.page = 1;
    this.paginationConfig.currentPage = 1;
    this.loadServices();
  }

  /**
   * Page change handler
   */
  onPageChange(page: number): void {
    this.payload.page = page;
    this.paginationConfig.currentPage = page;
    this.loadServices();
  }

  /**
   * Page size change handler
   */
  onPageSizeChange(): void {
    this.payload.limit = this.paginationConfig.itemsPerPage;
    this.payload.page = 1;
    this.paginationConfig.currentPage = 1;
    this.loadServices();
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

    this.servicesService.getAllServices({ page: 1, limit: 10000, search: this.searchTerm }).subscribe({
      next: (response: PaginatedServiceResponse) => {
        const allServices = response.data?.docs || [];

        if (allServices.length === 0) {
          Swal.close();
          swalHelper.error('No services to export');
          return;
        }

        try {
          const excelData = allServices.map((service, index) => ({
            'S.No': index + 1,
            'Title': service.title,
            'Description': service.description,
            'Price': `₹${service.price}`,
            'Status': service.isActive ? 'Active' : 'Inactive',
            'Created Date': this.formatDate(service.createdAt)
          }));

          const worksheet = XLSX.utils.json_to_sheet(excelData);
          const workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, 'Services');

          const fileName = `Services_Export_${new Date().toISOString().split('T')[0]}.xlsx`;
          XLSX.writeFile(workbook, fileName);

          Swal.close();
          swalHelper.showToast(`Successfully exported ${allServices.length} services to Excel`, 'success');
        } catch (error) {
          Swal.close();
          swalHelper.messageToast('Failed to export services to Excel', 'error');
        }
      },
      error: (err) => {
        Swal.close();
        swalHelper.messageToast(err?.error?.message ?? 'Failed to load services for export', 'error');
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
      day: 'numeric'
    });
  }

  /**
   * Format currency
   */
  formatCurrency(amount: number): string {
    return `₹${amount.toLocaleString('en-IN')}`;
  }

  /**
   * Get service image URL
   */
  getServiceImage(service: Service): string {
    if (!service.image || service.image === 'default-service.jpg') {
      return '/images/default-service.jpg';
    }
    return environment.imageUrl + service.image;
  }

  /**
   * Get status class
   */
  getStatusClass(isActive: boolean | undefined): string {
    return isActive ? 'tw-bg-green-100 tw-text-green-800' : 'tw-bg-red-100 tw-text-red-800';
  }

  /**
   * Get status text
   */
  getStatusText(isActive: boolean | undefined): string {
    return isActive ? 'Active' : 'Inactive';
  }

  /**
   * Check if field is invalid
   */
  isFieldInvalid(fieldName: string): boolean {
    const field = this.serviceForm.get(fieldName);
    return !!(field?.invalid && field?.touched);
  }

  /**
   * Get field error message
   */
  getFieldError(fieldName: string): string {
    const field = this.serviceForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return `${this.getFieldDisplayName(fieldName)} is required`;
      if (field.errors['minlength']) return `Minimum ${field.errors['minlength'].requiredLength} characters required`;
      if (field.errors['min']) return `Minimum value is ${field.errors['min'].min}`;
    }
    return '';
  }

  /**
   * Get field display name
   */
  private getFieldDisplayName(fieldName: string): string {
    const fieldNames: { [key: string]: string } = {
      title: 'Title',
      description: 'Description',
      price: 'Price'
    };
    return fieldNames[fieldName] || fieldName;
  }

  /**
   * Mark all fields as touched
   */
  private markAllFieldsAsTouched(): void {
    Object.keys(this.serviceForm.controls).forEach(key => {
      this.serviceForm.get(key)?.markAsTouched();
    });
  }
}