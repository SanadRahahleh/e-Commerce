import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

export function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  if (!password || !confirmPassword) return null;

  if (password.value !== confirmPassword.value) {
    confirmPassword.setErrors({ passwordMismatch: true });
    return { passwordMismatch: true };
  } else {

    const errors = confirmPassword.errors;
    if (errors) {
      delete errors['passwordMismatch'];
      confirmPassword.setErrors(Object.keys(errors).length ? errors : null);
    }
  }
  return null;
}

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="signup-wrapper">
      <div class="signup-card glass-panel">
        <h2 class="auth-title">Create Account</h2>
        <p class="auth-subtitle">Join NeoShop today and start shopping</p>

        <form [formGroup]="signupForm" (ngSubmit)="onSubmit()" class="auth-form">
          
          <div class="form-group">
            <label class="form-label" for="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              formControlName="fullName"
              class="form-control"
              [class.invalid]="isFieldInvalid('fullName')"
              placeholder="John Doe"
              autocomplete="name"
            />
            @if (isFieldInvalid('fullName')) {
              <span class="form-error">Full name is required.</span>
            }
          </div>

          <div class="form-group">
            <label class="form-label" for="email">Email Address</label>
            <input
              type="email"
              id="email"
              formControlName="email"
              class="form-control"
              [class.invalid]="isFieldInvalid('email')"
              placeholder="john@example.com"
              autocomplete="email"
            />
            @if (isFieldInvalid('email')) {
              <span class="form-error">
                @if (signupForm.get('email')?.errors?.['required']) { Email is required. }
                @if (signupForm.get('email')?.errors?.['email']) { Please enter a valid email address. }
              </span>
            }
          </div>

          <div class="form-group">
            <label class="form-label" for="password">Password</label>
            <input
              type="password"
              id="password"
              formControlName="password"
              class="form-control"
              [class.invalid]="isFieldInvalid('password')"
              placeholder="••••••••"
              autocomplete="new-password"
            />
            @if (isFieldInvalid('password')) {
              <span class="form-error">
                @if (signupForm.get('password')?.errors?.['required']) { Password is required. }
                @if (signupForm.get('password')?.errors?.['minlength']) { Password must be at least 6 characters. }
              </span>
            }
          </div>

          <div class="form-group">
            <label class="form-label" for="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              formControlName="confirmPassword"
              class="form-control"
              [class.invalid]="isFieldInvalid('confirmPassword')"
              placeholder="••••••••"
              autocomplete="new-password"
            />
            @if (isFieldInvalid('confirmPassword')) {
              <span class="form-error">
                @if (signupForm.get('confirmPassword')?.errors?.['required']) { Confirming password is required. }
                @if (signupForm.get('confirmPassword')?.errors?.['passwordMismatch']) { Passwords do not match. }
              </span>
            }
          </div>

          <div class="form-group">
            <label class="form-label" for="phone">Phone Number (Optional)</label>
            <input
              type="tel"
              id="phone"
              formControlName="phone"
              class="form-control"
              placeholder="+962 7 9000 0000"
            />
          </div>

          <div class="form-group">
            <label class="form-label" for="address">Delivery Address (Optional)</label>
            <textarea
              id="address"
              formControlName="address"
              rows="2"
              class="form-control"
              placeholder="City, Street Name, Building No."
            ></textarea>
          </div>

          <button type="submit" [disabled]="signupForm.invalid || isLoading" class="btn btn-primary btn-full btn-auth">
            @if (isLoading) {
              <span class="spinner"></span> Creating Account...
            } @else {
              Sign Up
            }
          </button>
        </form>

        <div class="auth-footer">
          <p>Already have an account? <a routerLink="/login" class="auth-link">Login</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .signup-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 70vh;
      padding: 1rem;
    }

    .signup-card {
      max-width: 450px;
      width: 100%;
      padding: 2.5rem 2rem;
      border-radius: var(--radius-lg);
    }

    .auth-title {
      font-size: 2rem;
      font-weight: 700;
      text-align: center;
      margin-bottom: 0.25rem;
      color: var(--text-primary);
    }

    .auth-subtitle {
      font-size: 0.9rem;
      color: var(--text-secondary);
      text-align: center;
      margin-bottom: 2rem;
    }

    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .btn-auth {
      margin-top: 1rem;
    }

    .auth-footer {
      margin-top: 1.5rem;
      text-align: center;
      font-size: 0.9rem;
      color: var(--text-secondary);
    }

    .auth-link {
      color: var(--primary-color);
      text-decoration: none;
      font-weight: 600;
      transition: var(--transition-fast);
    }

    .auth-link:hover {
      color: var(--primary-hover);
      text-decoration: underline;
    }

    .spinner {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      display: inline-block;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class SignupComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  signupForm: FormGroup;
  isLoading = false;

  constructor() {
    this.signupForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      address: [''],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: passwordMatchValidator });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.signupForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit() {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.authService.signup(this.signupForm.value).subscribe({
      next: () => {
        this.isLoading = false;
        this.toastService.success('Account created successfully! Please login.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.isLoading = false;
        const errMsg = err.error?.message || err.error || 'Failed to create account.';
        this.toastService.error(errMsg);
      }
    });
  }
}
