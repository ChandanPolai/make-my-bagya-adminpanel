import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule, NgIf } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgxPaginationModule } from 'ngx-pagination';
import { UsersService } from '../../../core/services/users.service';
import { ManualAccessService } from '../../../core/services/manual-access.service';
import { ServicesService } from '../../../core/services/services.service';
import { User, PaginatedUserResponse } from '../../../core/interfaces/users.interface';
import { Service } from '../../../core/interfaces/services.interface';
import { SendNotificationRequest } from '../../../core/interfaces/usernotification.interface';
import { ManualAccessGrant } from '../../../core/interfaces/manual-access.interface';
import { swalHelper } from '../../../core/constants/swal-helper';
import { SidebarService } from '../../../core/services/sidebar.service';
import { ThemeService } from '../../../core/services/theme.service';
import { Theme } from '../../../core/interfaces/sidebar.interface';
import { environment } from '../../../../env/env.local';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgSelectModule,
    BsDatepickerModule,
    NgxPaginationModule,
    FormsModule
  ],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef<HTMLInputElement>;

  mode: 'list' | 'create' | 'edit' | 'preview' | 'single-notification' | 'bulk-notification' | 'grant-access' | 'view-accesses' = 'list';
  users: User[] = [];
  allUsersForNotification: User[] = [];
  filteredUsersForNotification: User[] = [];
  currentUser: User | null = null;
  currentUserId?: string;
  selectedUserForNotification: User | null = null;
  selectedUserForAccess: User | null = null;
  allServices: Service[] = [];
  userManualAccesses: any[] = [];
  isLoading: boolean = false;
  isNotificationLoading: boolean = false;
  isAccessLoading: boolean = false;
  isSidebarCollapsed: boolean = false;
  notificationSearchTerm: string = '';
  notificationPageSize: number = 50;
  notificationCurrentPage: number = 1;
  notificationTotalPages: number = 0;
  userForm!: FormGroup;
  notificationForm!: FormGroup;
  grantAccessForm!: FormGroup;
  selectedFile: File | null = null;
  fileError: string | null = null;
  maxFileSize = 5 * 1024 * 1024;
  allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  payload = {
    page: 1,
    limit: 10,
    search: ''
  };
  totalUsers = 0;
  searchTerm: string = '';
  paginationConfig = {
    id: 'users-pagination',
    itemsPerPage: this.payload.limit,
    currentPage: this.payload.page,
    totalItems: 0
  };

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private manualAccessService: ManualAccessService,
    private servicesService: ServicesService,
    private sidebarService: SidebarService,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.initializeNotificationForm();
    this.initializeGrantAccessForm();
    this.loadUsers();
    this.loadAllServices();
    this.sidebarService.isCollapsed$.subscribe((isCollapsed) => {
      this.isSidebarCollapsed = isCollapsed;
    });
  }

  get currentTheme(): Theme {
    return this.themeService.getCurrentTheme();
  }

  private initializeForm(): void {
    this.userForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: [''],
      email: ['', [Validators.email]],
      mobile_number: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      date_of_birth: [null],
      profilePic: [''],
      city: [''],
      company_name: [''],
      active: [true],
      isDeleted: [false]
    });
  }

  private initializeNotificationForm(): void {
    this.notificationForm = this.fb.group({
      type: ['general', [Validators.required]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  private initializeGrantAccessForm(): void {
    this.grantAccessForm = this.fb.group({
      serviceId: ['', Validators.required],
      validity_from: [new Date(), Validators.required],
      validity_to: [null],
      isLifetime: [false]
    });

    this.grantAccessForm.get('isLifetime')?.valueChanges.subscribe(isLifetime => {
      const validityTo = this.grantAccessForm.get('validity_to');
      if (isLifetime) {
        validityTo?.clearValidators();
        validityTo?.setValue(null);
        validityTo?.disable();
      } else {
        validityTo?.setValidators([Validators.required]);
        validityTo?.enable();
      }
      validityTo?.updateValueAndValidity();
    });
  }

  loadUsers(): void {
    this.isLoading = true;
    this.usersService.getAllUsers(this.payload).subscribe({
      next: (response: PaginatedUserResponse) => {
        this.users = response.data?.docs?.map(user => ({ ...user, selected: false })) || [];
        this.totalUsers = response.data?.totalDocs || 0;
        this.paginationConfig.totalItems = this.totalUsers;
        this.paginationConfig.currentPage = this.payload.page;
        this.paginationConfig.itemsPerPage = this.payload.limit;
        this.isLoading = false;
      },
      error: (err) => {
        swalHelper.messageToast(err?.message ?? 'Failed to load users.', 'error');
        this.isLoading = false;
      }
    });
  }

  loadAllServices(): void {
    this.servicesService.getAllServices({ page: 1, limit: 1000 }).subscribe({
      next: (response) => {
        this.allServices = response.data?.docs || [];
      },
      error: () => {
        swalHelper.messageToast('Failed to load services', 'error');
      }
    });
  }

  loadAllUsersForNotification(): void {
    this.isLoading = true;
    this.usersService.getAllUsers({ page: 1, limit: 10000, search: '' }).subscribe({
      next: (response: PaginatedUserResponse) => {
        this.allUsersForNotification = response.data?.docs?.map(user => ({ ...user, selected: false })) || [];
        this.filteredUsersForNotification = [...this.allUsersForNotification];
        this.updateNotificationPagination();
        this.isLoading = false;
      },
      error: (err) => {
        swalHelper.messageToast('Failed to load users for notification', 'error');
        this.allUsersForNotification = [];
        this.filteredUsersForNotification = [];
        this.isLoading = false;
      }
    });
  }

  filterUsersForNotification(): void {
    if (!this.notificationSearchTerm.trim()) {
      this.filteredUsersForNotification = [...this.allUsersForNotification];
    } else {
      const searchTerm = this.notificationSearchTerm.toLowerCase();
      this.filteredUsersForNotification = this.allUsersForNotification.filter(user => {
        const name = this.getDisplayName(user).toLowerCase();
        const email = (user.email || '').toLowerCase();
        const mobile = (user.mobile_number || '').toLowerCase();
        return name.includes(searchTerm) || email.includes(searchTerm) || mobile.includes(searchTerm);
      });
    }
    this.notificationCurrentPage = 1;
    this.updateNotificationPagination();
  }

  updateNotificationPagination(): void {
    this.notificationTotalPages = Math.ceil(this.filteredUsersForNotification.length / this.notificationPageSize);
  }

  getPaginatedUsersForNotification(): User[] {
    const startIndex = (this.notificationCurrentPage - 1) * this.notificationPageSize;
    const endIndex = startIndex + this.notificationPageSize;
    return this.filteredUsersForNotification.slice(startIndex, endIndex);
  }

  onNotificationPageChange(page: number): void {
    this.notificationCurrentPage = page;
  }

  onNotificationPageSizeChange(): void {
    this.notificationCurrentPage = 1;
    this.updateNotificationPagination();
  }

  selectUsersByStatus(status: 'active' | 'inactive' | 'all'): void {
    this.allUsersForNotification.forEach(user => {
      if (status === 'all') {
        user.selected = true;
      } else if (status === 'active') {
        user.selected = user.active === true;
      } else if (status === 'inactive') {
        user.selected = user.active === false;
      }
    });
    this.filteredUsersForNotification = [...this.allUsersForNotification];
  }

  onPageChange(page: number): void {
    this.payload.page = page;
    this.paginationConfig.currentPage = page;
    this.loadUsers();
  }

  onPageSizeChange(): void {
    this.payload.limit = this.paginationConfig.itemsPerPage;
    this.payload.page = 1;
    this.paginationConfig.currentPage = 1;
    this.loadUsers();
  }

  onSearch(): void {
    this.payload.search = this.searchTerm.trim();
    this.payload.page = 1;
    this.paginationConfig.currentPage = 1;
    this.loadUsers();
  }

  createNew(): void {
    this.mode = 'create';
    this.resetForm();
  }

  editUser(user: User): void {
    this.mode = 'edit';
    this.currentUserId = user._id;
    this.currentUser = user;
    this.userForm.patchValue({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email,
      mobile_number: user.mobile_number,
      date_of_birth: user.date_of_birth ? new Date(user.date_of_birth) : null,
      city: user.city || '',
      company_name: user.company_name || '',
      active: user.active ?? true,
      isDeleted: user.isDeleted ?? false
    });
  }

  previewUser(user: User): void {
    this.mode = 'preview';
    this.currentUser = user;
  }

  openGrantAccessModal(user: User): void {
    this.selectedUserForAccess = user;
    this.mode = 'grant-access';
    this.resetGrantAccessForm();
  }

  viewUserAccesses(user: User): void {
    this.selectedUserForAccess = user;
    this.mode = 'view-accesses';
    this.loadUserManualAccesses(user._id!);
  }

  loadUserManualAccesses(userId: string): void {
    this.isAccessLoading = true;
    this.manualAccessService.getUserManualAccesses({ userId }).subscribe({
      next: (response) => {
        this.userManualAccesses = response.data?.manualAccesses || [];
        this.isAccessLoading = false;
      },
      error: () => {
        swalHelper.messageToast('Failed to load user accesses', 'error');
        this.userManualAccesses = [];
        this.isAccessLoading = false;
      }
    });
  }

  submitGrantAccess(): void {
    if (this.grantAccessForm.valid && this.selectedUserForAccess && !this.isAccessLoading) {
      this.isAccessLoading = true;
      const formValue = this.grantAccessForm.value;
      
      const accessData: ManualAccessGrant = {
        userId: this.selectedUserForAccess._id!,
        serviceId: formValue.serviceId,
        validity_from: formValue.validity_from,
        validity_to: formValue.isLifetime ? null : formValue.validity_to
      };

      this.manualAccessService.grantManualAccess(accessData).subscribe({
        next: (response) => {
          swalHelper.showToast(response.message || 'Access granted successfully', 'success');
          this.isAccessLoading = false;
          this.cancelGrantAccess();
          this.loadUsers();
        },
        error: (err) => {
          swalHelper.messageToast(err?.message ?? 'Failed to grant access', 'error');
          this.isAccessLoading = false;
        }
      });
    } else {
      this.markAllGrantAccessFieldsAsTouched();
      swalHelper.error('Please fill in all required fields');
    }
  }

  revokeAccess(transactionId: string): void {
    swalHelper.takeConfirmation('Revoke Access?', 'User will lose access immediately').then((result) => {
      if (result.isConfirmed) {
        this.manualAccessService.revokeManualAccess({ transactionId }).subscribe({
          next: () => {
            swalHelper.showToast('Access revoked successfully', 'success');
            this.loadUserManualAccesses(this.selectedUserForAccess?._id!);
            this.loadUsers();
          },
          error: () => {
            swalHelper.messageToast('Failed to revoke access', 'error');
          }
        });
      }
    });
  }

  cancelGrantAccess(): void {
    this.mode = 'list';
    this.selectedUserForAccess = null;
    this.resetGrantAccessForm();
  }

  private resetGrantAccessForm(): void {
    this.grantAccessForm.reset({
      serviceId: '',
      validity_from: new Date(),
      validity_to: null,
      isLifetime: false
    });
  }

  private markAllGrantAccessFieldsAsTouched(): void {
    Object.keys(this.grantAccessForm.controls).forEach(key => {
      this.grantAccessForm.get(key)?.markAsTouched();
    });
  }

  isGrantAccessFieldInvalid(fieldName: string): boolean {
    const field = this.grantAccessForm.get(fieldName);
    return !!(field?.invalid && field?.touched);
  }

  getGrantAccessFieldError(fieldName: string): string {
    const field = this.grantAccessForm.get(fieldName);
    if (field?.errors?.['required']) {
      return `${this.getGrantAccessFieldDisplayName(fieldName)} is required`;
    }
    return '';
  }

  private getGrantAccessFieldDisplayName(fieldName: string): string {
    const fieldNames: { [key: string]: string } = {
      serviceId: 'Service',
      validity_from: 'Valid from date',
      validity_to: 'Valid to date'
    };
    return fieldNames[fieldName] || fieldName;
  }

  getServiceName(serviceId: string): string {
    const service = this.allServices.find(s => s._id === serviceId);
    return service?.name || 'Unknown Service';
  }

  formatAccessDate(date: string | Date | null): string {
    if (!date) return 'Lifetime';
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getAccessStatusClass(isActive: boolean): string {
    return isActive ? 'tw-bg-green-100 tw-text-green-800' : 'tw-bg-red-100 tw-text-red-800';
  }

  getAccessStatusText(isActive: boolean): string {
    return isActive ? 'Active' : 'Expired';
  }

  onSubmit(): void {
    if (this.userForm.valid && !this.isLoading) {
      this.isLoading = true;
      const formData = this.buildFormData();
      
      if (this.mode === 'create') {
        this.usersService.createUser(formData).subscribe({
          next: (response) => {
            swalHelper.showToast(response.message || 'User created successfully', 'success');
            this.isLoading = false;
            this.resetForm();
            this.loadUsers();
            this.mode = 'list';
          },
          error: (err) => {
            swalHelper.messageToast(err?.message ?? 'Failed to create user.', 'error');
            this.isLoading = false;
          }
        });
      } else if (this.mode === 'edit' && this.currentUserId) {
        this.usersService.updateUser(formData, this.currentUserId).subscribe({
          next: (response) => {
            swalHelper.showToast(response.message || 'User updated successfully', 'success');
            this.isLoading = false;
            this.resetForm();
            this.loadUsers();
            this.mode = 'list';
          },
          error: (err) => {
            swalHelper.messageToast(err?.message ?? 'Failed to update user.', 'error');
            this.isLoading = false;
          }
        });
      }
    } else {
      this.markAllFieldsAsTouched();
      swalHelper.error('Please fill in all required fields correctly');
    }
  }

  private buildFormData(): FormData {
    const formValue = this.userForm.value;
    const formData = new FormData();
    
    formData.append('firstName', formValue.firstName || '');
    formData.append('lastName', formValue.lastName || '');
    formData.append('email', formValue.email || '');
    formData.append('mobile_number', formValue.mobile_number || '');
    formData.append('city', formValue.city || '');
    formData.append('company_name', formValue.company_name || '');
    
    if (formValue.date_of_birth) {
      formData.append('date_of_birth', formValue.date_of_birth.toISOString());
    }
    
    if (this.selectedFile) {
      formData.append('profilePic', this.selectedFile, this.selectedFile.name);
    }
    
    if (this.mode === 'edit') {
      formData.append('active', String(formValue.active));
      formData.append('isDeleted', String(formValue.isDeleted));
    } else {
      formData.append('isDeleted', String(formValue.isDeleted || false));
    }
    
    return formData;
  }

  sendNotificationToUser(user: User): void {
    this.selectedUserForNotification = user;
    this.mode = 'single-notification';
    this.resetNotificationForm();
  }

  openBulkNotificationModal(): void {
    this.mode = 'bulk-notification';
    this.resetNotificationForm();
    this.loadAllUsersForNotification();
  }

  sendSingleNotification(): void {
    if (this.notificationForm.valid && this.selectedUserForNotification && !this.isNotificationLoading) {
      this.isNotificationLoading = true;
      const formValue = this.notificationForm.value;
      
      const notificationData: SendNotificationRequest = {
        userId: this.selectedUserForNotification._id,
        message: formValue.message,
        type: formValue.type
      };

      this.usersService.sendNotification(notificationData).subscribe({
        next: (response) => {
          swalHelper.showToast(response.message || 'Notification sent successfully', 'success');
          this.isNotificationLoading = false;
          this.cancelNotification();
        },
        error: (err) => {
          swalHelper.messageToast(err?.message ?? 'Failed to send notification.', 'error');
          this.isNotificationLoading = false;
        }
      });
    } else {
      this.markAllNotificationFieldsAsTouched();
      swalHelper.error('Please fill in all required fields correctly');
    }
  }

  sendBulkNotification(): void {
    if (this.notificationForm.valid && this.canSendBulkNotification() && !this.isNotificationLoading) {
      this.isNotificationLoading = true;
      const formValue = this.notificationForm.value;
      const selectedUserIds = this.allUsersForNotification.filter(user => user.selected).map(user => user._id).filter(id => id) as string[];
      
      const notificationData: SendNotificationRequest = {
        userIds: selectedUserIds,
        message: formValue.message,
        type: formValue.type
      };

      this.usersService.sendNotification(notificationData).subscribe({
        next: (response) => {
          swalHelper.showToast(response.message || `Notification sent to ${selectedUserIds.length} users successfully`, 'success');
          this.isNotificationLoading = false;
          this.cancelNotification();
        },
        error: (err) => {
          swalHelper.messageToast(err?.message ?? 'Failed to send notification.', 'error');
          this.isNotificationLoading = false;
        }
      });
    } else {
      this.markAllNotificationFieldsAsTouched();
      swalHelper.error('Please fill in all required fields correctly and select at least one user');
    }
  }

  cancelNotification(): void {
    this.mode = 'list';
    this.selectedUserForNotification = null;
    this.resetNotificationForm();
    this.deselectAllUsers();
    this.notificationSearchTerm = '';
    this.notificationCurrentPage = 1;
    this.notificationPageSize = 50;
    this.filteredUsersForNotification = [];
  }

  selectAllUsers(): void {
    this.allUsersForNotification.forEach(user => user.selected = true);
    this.filteredUsersForNotification = [...this.allUsersForNotification];
  }

  deselectAllUsers(): void {
    this.allUsersForNotification.forEach(user => user.selected = false);
    this.filteredUsersForNotification = [...this.allUsersForNotification];
  }

  getSelectedUsersCount(): number {
    return this.allUsersForNotification.filter(user => user.selected).length;
  }

  getSelectedUsersCountInCurrentPage(): number {
    return this.getPaginatedUsersForNotification().filter(user => user.selected).length;
  }

  selectAllInCurrentPage(): void {
    this.getPaginatedUsersForNotification().forEach(user => {
      const originalUser = this.allUsersForNotification.find(u => u._id === user._id);
      if (originalUser) {
        originalUser.selected = true;
      }
    });
    this.filteredUsersForNotification = [...this.allUsersForNotification];
  }

  deselectAllInCurrentPage(): void {
    this.getPaginatedUsersForNotification().forEach(user => {
      const originalUser = this.allUsersForNotification.find(u => u._id === user._id);
      if (originalUser) {
        originalUser.selected = false;
      }
    });
    this.filteredUsersForNotification = [...this.allUsersForNotification];
  }

  canSendBulkNotification(): boolean {
    return this.notificationForm.valid && this.getSelectedUsersCount() > 0;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.validateAndAttachFile(input.files[0]);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.validateAndAttachFile(files[0]);
    }
  }

  private validateAndAttachFile(file: File): void {
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

  removeSelectedFile(): void {
    this.selectedFile = null;
    this.fileError = null;
    this.clearFileInput();
  }

  private clearFileInput(): void {
    if (this.fileInput?.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
  }

  getImagePreviewUrl(): string | null {
    if (this.selectedFile) {
      return URL.createObjectURL(this.selectedFile);
    }
    return null;
  }

  getFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  getUserProfileImage(user: User): string {
    if (user.profilePic && user.profilePic !== 'default.jpg') {
      return environment.imageUrl + user.profilePic;
    }
    return '/images/profile-avtart.png';
  }

  getDisplayName(user: User): string {
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    return `${firstName} ${lastName}`.trim() || user.email || user.mobile_number || 'Unknown User';
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.userForm.get(fieldName);
    return !!(field?.invalid && field?.touched);
  }

  isNotificationFieldInvalid(fieldName: string): boolean {
    const field = this.notificationForm.get(fieldName);
    return !!(field?.invalid && field?.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.userForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return `${this.getFieldDisplayName(fieldName)} is required`;
      if (field.errors['email']) return 'Please enter a valid email address';
      if (field.errors['minlength']) return `Minimum ${field.errors['minlength'].requiredLength} characters required`;
      if (field.errors['pattern']) return 'Please enter a valid 10-digit mobile number';
    }
    return '';
  }

  getNotificationFieldError(fieldName: string): string {
    const field = this.notificationForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return `${this.getNotificationFieldDisplayName(fieldName)} is required`;
      if (field.errors['minlength']) return `Minimum ${field.errors['minlength'].requiredLength} characters required`;
    }
    return '';
  }

  private getFieldDisplayName(fieldName: string): string {
    const fieldNames: { [key: string]: string } = {
      firstName: 'First name',
      lastName: 'Last name',
      email: 'Email',
      mobile_number: 'Mobile number',
      date_of_birth: 'Date of birth',
      city: 'City',
      company_name: 'Company name',
      active: 'Active',
      isDeleted: 'Is Deleted'
    };
    return fieldNames[fieldName] || fieldName;
  }

  private getNotificationFieldDisplayName(fieldName: string): string {
    const fieldNames: { [key: string]: string } = {
      type: 'Notification type',
      message: 'Message'
    };
    return fieldNames[fieldName] || fieldName;
  }

  private markAllFieldsAsTouched(): void {
    Object.keys(this.userForm.controls).forEach(key => {
      this.userForm.get(key)?.markAsTouched();
    });
  }

  private markAllNotificationFieldsAsTouched(): void {
    Object.keys(this.notificationForm.controls).forEach(key => {
      this.notificationForm.get(key)?.markAsTouched();
    });
  }

  resetForm(): void {
    this.userForm.reset({
      firstName: '',
      lastName: '',
      email: '',
      mobile_number: '',
      date_of_birth: null,
      profilePic: '',
      city: '',
      company_name: '',
      active: true,
      isDeleted: false
    });
    this.selectedFile = null;
    this.fileError = null;
    this.clearFileInput();
    this.currentUserId = undefined;
    this.currentUser = null;
  }

  private resetNotificationForm(): void {
    this.notificationForm.reset({
      type: 'general',
      message: ''
    });
  }

  cancelForm(): void {
    this.resetForm();
    this.mode = 'list';
  }

  formatDate(date: string | null): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getStatusClass(active: boolean | undefined): string {
    return active ? 'tw-bg-green-100 tw-text-green-800' : 'tw-bg-red-100 tw-text-red-800';
  }

  getStatusText(active: boolean | undefined): string {
    return active ? 'Active' : 'Inactive';
  }

  exportToExcel(): void {
    Swal.fire({
      title: 'Preparing export...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    
    // Fetch all users for export
    this.usersService.getAllUsers({ page: 1, limit: 10000, search: this.searchTerm }).subscribe({
      next: (response: PaginatedUserResponse) => {
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
            'First Name': user.firstName || 'N/A',
            'Last Name': user.lastName || 'N/A',
            'Email': user.email || 'N/A',
            'Mobile Number': user.mobile_number || 'N/A',
            'Date of Birth': user.date_of_birth ? this.formatDate(user.date_of_birth) : 'N/A',
            'City': user.city || 'N/A',
            'Company Name': user.company_name || 'N/A',
            'Status': this.getStatusText(user.active),
            'Created Date': this.formatDate(user.createdAt || null),
            'Updated Date': this.formatDate(user.updatedAt || null)
          }));

          // Create worksheet
          const worksheet = XLSX.utils.json_to_sheet(excelData);
          
          // Create workbook
          const workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');

          // Generate filename with current date
          const fileName = `Users_Export_${new Date().toISOString().split('T')[0]}.xlsx`;

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
        swalHelper.messageToast(err?.message ?? 'Failed to load users for export', 'error');
      }
    });
  }
}