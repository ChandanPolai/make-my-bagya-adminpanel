import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { swalHelper } from '../../../../core/constants/swal-helper';

@Component({
  selector: 'app-sign-in',
  standalone: false,
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent {
  loginForm: FormGroup;
  isLoading = false;
  showPassword = false;
  errorMessage: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  ngOnInit(): void {
    // Pre-fill form for development (remove in production)
    // this.loginForm.patchValue({
    //   email: 'admin@example.com',
    //   password: 'password123'
    // });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(event: Event): void {
    event.preventDefault(); // Prevent default form submission
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched(); // Mark all fields as touched to show validation errors
      return;
    }
    this.isLoading = true;
    this.errorMessage = null; // Reset error message
    const credentials = this.loginForm.value;
    delete credentials.rememberMe;
    this.authService.signIn(credentials).subscribe({
      next: (response) => {
        this.isLoading = false;
        swalHelper.messageToast(response.message, 'success');
        this.router.navigate(['/dashboard']); // Use Angular Router for navigation
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error?.message || 'Something went wrong. Please try again.';
        swalHelper.messageToast(this.errorMessage ?? 'Something went wrong. Please try again.', 'error');
      }
    });
  }
}