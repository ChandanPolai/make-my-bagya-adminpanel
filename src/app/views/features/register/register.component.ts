import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { UsersService } from '../../../core/services/users.service';
import { User } from '../../../core/interfaces/users.interface';
import { swalHelper } from '../../../core/constants/swal-helper';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgSelectModule,
    BsDatepickerModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  
  @ViewChild('fileInput', { static: false })
  fileInput!: ElementRef<HTMLInputElement>;

  registerForm!: FormGroup;
  isLoading: boolean = false;
  selectedFile: File | null = null;
  fileError: string | null = null;
  maxFileSize = 5 * 1024 * 1024; // 5MB in bytes
  allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      mobile_number: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      date_of_birth: [null],
      profilePic: ['']
    }, { validators: this.passwordMatchValidator });
  }

  // Custom validator for password matching
  passwordMatchValidator(form: any) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.registerForm.valid && !this.isLoading) {
      this.isLoading = true;
      
      // Always use FormData for file handling
      const formData = this.buildFormData();

      this.usersService.createUser(formData).subscribe({
        next: (response) => {
          swalHelper.showToast(response.message || 'User created successfully', 'success');
          this.isLoading = false;
          this.resetForm();
        },
        error: (err) => {
          swalHelper.messageToast(err?.message ?? 'Something went wrong. Please try again.', 'error');
          this.isLoading = false;
        }
      });
    } else {
      this.markAllFieldsAsTouched();
      swalHelper.error('Please fill in all required fields correctly');
    }
  }

  private buildFormData(): FormData {
    const formValue = this.registerForm.value;
    const formData = new FormData();

    // Add all form fields
    formData.append('name', formValue.name || '');
    formData.append('email', formValue.email || '');
    formData.append('mobile_number', formValue.mobile_number || '');
    formData.append('password', formValue.password || '');
    
    if (formValue.date_of_birth) {
      formData.append('date_of_birth', formValue.date_of_birth.toISOString());
    }

    // Add profile picture file if selected (binary file)
    if (this.selectedFile) {
      formData.append('profilePic', this.selectedFile, this.selectedFile.name);
    }

    return formData;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.validateAndAttachFile(file);
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

    // Check file type
    if (!this.allowedFileTypes.includes(file.type)) {
      this.fileError = 'Only JPG, JPEG and PNG files are allowed';
      this.clearFileInput();
      return;
    }

    // Check file size
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

  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field?.invalid && field?.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return `${this.getFieldDisplayName(fieldName)} is required`;
      if (field.errors['email']) return 'Please enter a valid email address';
      if (field.errors['minlength']) return `Minimum ${field.errors['minlength'].requiredLength} characters required`;
      if (field.errors['pattern']) return 'Please enter a valid 10-digit mobile number';
      if (field.errors['passwordMismatch']) return 'Passwords do not match';
    }
    return '';
  }

  private getFieldDisplayName(fieldName: string): string {
    const fieldNames: { [key: string]: string } = {
      name: 'Name',
      email: 'Email',
      mobile_number: 'Mobile number',
      password: 'Password',
      confirmPassword: 'Confirm password',
      date_of_birth: 'Date of birth'
    };
    return fieldNames[fieldName] || fieldName;
  }

  private markAllFieldsAsTouched(): void {
    Object.keys(this.registerForm.controls).forEach(key => {
      this.registerForm.get(key)?.markAsTouched();
    });
  }

  resetForm(): void {
    this.registerForm.reset();
    this.selectedFile = null;
    this.fileError = null;
    this.clearFileInput();
  }

  cancelForm(): void {
    this.resetForm();
    // You can add navigation logic here if needed
  }
}