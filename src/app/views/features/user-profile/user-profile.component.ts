import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';
import { Theme } from '../../../core/interfaces/sidebar.interface';
import { swalHelper } from '../../../core/constants/swal-helper';
import { common } from '../../../core/constants/common';
import { AppStorage } from '../../../core/utilities/app-storage';
import { SidebarService } from '../../../core/services/sidebar.service';
import { environment } from '../../../../env/env.local';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  profileForm!: FormGroup;
  admin: any = {};
  isLoading = false;
  isEditMode = false; // New property to track edit mode
  previewAvatar: string | null = null;
  selectedAvatarFile: File | null = null;
  imageUrl = environment.imageUrl

  constructor(
    private authService: AuthService,
    private themeService: ThemeService,
    private fb: FormBuilder,
    public sidebarService: SidebarService,
    private storage: AppStorage
  ) {}

  isSidebarCollapsed = false;

  ngOnInit(): void {
    this.sidebarService.isCollapsed$.subscribe((isCollapsed: boolean) => {
      this.isSidebarCollapsed = isCollapsed;
    });
    
    this.initializeForm();
    this.loadUserProfile(); // Load profile data on initialization
  }

  @Output() toggleSidebar = new EventEmitter<void>();

  get currentTheme(): Theme {
    return this.themeService.getCurrentTheme();
  }

  initializeForm(): void {
    this.profileForm = this.fb.group({
      name: [{value: '', disabled: true}, [Validators.required, Validators.minLength(3)]],
      email: [{value: '', disabled: true}, [Validators.required, Validators.email]],
      mobile: [{value: '', disabled: true}, [Validators.required, Validators.pattern('^[0-9]{10,15}$')]],
    });
  }

  // Load user profile data
  loadUserProfile(): void {
    this.isLoading = true;
    
    this.authService.getProfile({}).subscribe({
      next: (response) => {
        if (response.data) {
          this.admin = response.data;
          
          // Update local storage with fresh data
          this.storage.set(common.USERDATA, this.admin);
          
          // Fill the form with profile data
          this.profileForm.patchValue({
            name: this.admin.name || '',
            email: this.admin.email || '',
            mobile: this.admin.mobile_number || ''
          });
          
          this.isLoading = false;
        }
      },
      error: (err) => {
        swalHelper.showToast(err.message || 'Failed to load profile', 'error');
        this.isLoading = false;
        
        // Fallback to storage data if API fails
        const storageData = this.storage.get(common.USERDATA);
        if (storageData) {
          this.admin = storageData;
          this.profileForm.patchValue({
            name: this.admin.name || '',
            email: this.admin.email || '',
            mobile: this.admin.mobile_number || ''
          });
        }
      }
    });
  }

  // Toggle edit mode
  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
    
    if (this.isEditMode) {
      // Enable form controls for editing
      this.profileForm.get('name')?.enable();
      this.profileForm.get('email')?.enable();
      this.profileForm.get('mobile')?.enable();
    } else {
      // Disable form controls and reset to original values
      this.profileForm.get('name')?.disable();
      this.profileForm.get('email')?.disable();
      this.profileForm.get('mobile')?.disable();
      
      // Reset form to original values
      this.profileForm.patchValue({
        name: this.admin.name || '',
        email: this.admin.email || '',
        mobile: this.admin.mobile_number || this.admin.mobile || ''
      });
    }
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      swalHelper.showToast('Please fill all required fields correctly', 'error');
      return;
    }

    const formData = new FormData();
    const formValue = this.profileForm.value;
    
    // Add form fields
    formData.append('name', formValue.name);
    formData.append('email', formValue.email);
    formData.append('mobile_number', formValue.mobile);
    
    // Add profile image if selected
    if (this.selectedAvatarFile) {
      formData.append('profilePic', this.selectedAvatarFile);
    }

    for (const pair of formData.entries()) {
    }

    this._UpdateUserProfile(formData);
  }

  _UpdateUserProfile(formData: FormData): void {
    this.isLoading = true;

    this.authService.updateAdminProfile(formData).subscribe({
      next: (response) => {
        if (response.data) {
          swalHelper.showToast(response.message || 'Profile updated successfully', 'success');
          
          // Disable edit mode
          this.isEditMode = false;
          this.profileForm.get('name')?.disable();
          this.profileForm.get('email')?.disable();
          this.profileForm.get('mobile')?.disable();
          
          // Clear image preview and selection
          this.previewAvatar = null;
          this.selectedAvatarFile = null;
          
          // Refresh profile data immediately after successful update
          this.loadUserProfile();
        }
      },
      error: (err) => {
        swalHelper.showToast(err?.message || 'Profile update failed', 'error');
        this.isLoading = false;
      }
    });
  }

  // Handle avatar/profile image change
  onAvatarChange(event: Event): void {
    if (!this.isEditMode) return; // Only allow in edit mode
    
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        swalHelper.showToast('Please select a valid image file', 'error');
        input.value = ''; // Clear the input
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        swalHelper.showToast('Image size should be less than 5MB', 'error');
        input.value = ''; // Clear the input
        return;
      }
      
      this.selectedAvatarFile = file;

      // Create preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewAvatar = e.target.result; // Set preview
      };
      reader.readAsDataURL(file);
      
      swalHelper.showToast('Image selected successfully! Click Update Profile to save.', 'info');
    }
  }

  // Get image URL with proper fallback
getImageUrl(url: string): string {
  if (!url || url.trim() === '' || url.toLowerCase() === 'default.jpg') {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(this.admin?.name || 'User')}&background=random&size=200`;
  }
  return `${this.imageUrl}${url}`;
}


  onClear(): void {
    // Reset form to original admin data
    this.profileForm.patchValue({
      name: this.admin.name || '',
      email: this.admin.email || '',
      mobile: this.admin.mobile_number || this.admin.mobile || ''
    });
    swalHelper.showToast('Form reset to original values', 'info');
  }
}