import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ThemeService } from '../../../core/services/theme.service';
import { AuthService } from '../../../core/services/auth.service';
import { swalHelper } from '../../../core/constants/swal-helper';
import { SidebarService } from '../../../core/services/sidebar.service';
import { Theme } from '../../../core/interfaces/sidebar.interface';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm!: FormGroup;
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;
  isLoading = false;
  isSidebarCollapsed = false;

  constructor(
    private fb: FormBuilder,
    private themeService: ThemeService,
    private authService: AuthService,
    public sidebarService: SidebarService,
    private router: Router
  ) {}

  @Output() toggleSidebar = new EventEmitter<void>();

  get currentTheme(): Theme {
    return this.themeService.getCurrentTheme();
  }

  ngOnInit(): void {
    this.sidebarService.isCollapsed$.subscribe((isCollapsed: boolean) => {
      this.isSidebarCollapsed = isCollapsed;
    });
    
    this.initializeForm();
  }

  initializeForm(): void {
    this.changePasswordForm = this.fb.group({
      currentPassword: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: AbstractControl) {
    const newPassword = form.get('newPassword');
    const confirmPassword = form.get('confirmPassword');

    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    // Clear the error if passwords match
    if (confirmPassword?.errors?.['passwordMismatch'] && newPassword?.value === confirmPassword.value) {
      delete confirmPassword.errors['passwordMismatch'];
      if (Object.keys(confirmPassword.errors).length === 0) {
        confirmPassword.setErrors(null);
      }
    }
    
    return null;
  }

  togglePasswordVisibility(field: string): void {
    switch (field) {
      case 'current':
        this.showCurrentPassword = !this.showCurrentPassword;
        break;
      case 'new':
        this.showNewPassword = !this.showNewPassword;
        break;
      case 'confirm':
        this.showConfirmPassword = !this.showConfirmPassword;
        break;
    }
  }

  onSubmit(): void {
    if (this.changePasswordForm.invalid) {
      this.changePasswordForm.markAllAsTouched();
      swalHelper.showToast('Please fill all required fields correctly', 'error');
      return;
    }

    // Check if new password is same as current password
    const currentPass = this.changePasswordForm.get('currentPassword')?.value;
    const newPass = this.changePasswordForm.get('newPassword')?.value;
    
    if (currentPass === newPass) {
      swalHelper.showToast('New password must be different from current password', 'error');
      return;
    }

    const formData = {
      currentPassword: this.changePasswordForm.get('currentPassword')?.value,
      newPassword: this.changePasswordForm.get('newPassword')?.value,
      // confirmPassword: this.changePasswordForm.get('confirmPassword')?.value
    };

    this.isLoading = true;

    this.authService.changePassword(formData).subscribe({
      next: (response) => {
        this.isLoading = false;
        swalHelper.showToast(response.message || 'Password updated successfully', 'success');
        
        // Reset form after successful update
        this.changePasswordForm.reset();
        
        // Reset password visibility flags
        this.showCurrentPassword = false;
        this.showNewPassword = false;
        this.showConfirmPassword = false;
        
        // Optional: Redirect to profile or dashboard
        // setTimeout(() => {
        //   this.router.navigate(['/profile']);
        // }, 1500);
      },
      error: (err) => {
        this.isLoading = false;
        swalHelper.showToast(err?.message || 'Failed to update password', 'error');
      }
    });
  }

  onClear(): void {
    this.changePasswordForm.reset();
    
    // Reset all password visibility flags
    this.showCurrentPassword = false;
    this.showNewPassword = false;
    this.showConfirmPassword = false;
    
    swalHelper.showToast('Form cleared successfully', 'info');
  }

  // Helper methods for template
  isFieldInvalid(fieldName: string): boolean {
    const field = this.changePasswordForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.changePasswordForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) {
        const fieldDisplayName = this.getFieldDisplayName(fieldName);
        return `${fieldDisplayName} is required`;
      }
      if (field.errors['minlength']) {
        return `Minimum ${field.errors['minlength'].requiredLength} characters required`;
      }
      if (field.errors['passwordMismatch']) {
        return 'Passwords do not match';
      }
    }
    return '';
  }

  private getFieldDisplayName(fieldName: string): string {
    const displayNames: { [key: string]: string } = {
      'currentPassword': 'Current password',
      'newPassword': 'New password',
      'confirmPassword': 'Confirm password'
    };
    return displayNames[fieldName] || fieldName;
  }
}