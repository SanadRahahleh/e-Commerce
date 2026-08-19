import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="login-wrapper">
      <div class="login-card glass-panel">
        <h2 class="auth-title">Welcome Back</h2>
        <p class="auth-subtitle">Sign in to your NeoShop account</p>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="auth-form">
          
          <div class="form-group">
            <label class="form-label" for="email">Email Address</label>
            <input
              type="email"
              id="email"
              formControlName="email"
              class="form-control"
              [class.invalid]="isFieldInvalid('email')"
              placeholder="name@example.com"
              autocomplete="email"
            />
            @if (isFieldInvalid('email')) {
              <span class="form-error">
                @if (loginForm.get('email')?.errors?.['required']) { Email is required. }
                @if (loginForm.get('email')?.errors?.['email']) { Please enter a valid email. }
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
              autocomplete="current-password"
            />
            @if (isFieldInvalid('password')) {
              <span class="form-error">Password is required.</span>
            }
          </div>

          <button type="submit" [disabled]="loginForm.invalid || isLoading" class="btn btn-primary btn-full btn-auth">
            @if (isLoading) {
              <span class="spinner"></span> Logging in...
            } @else {
              Login
            }
          </button>
        </form>

        <div class="auth-footer">
          <p>Don't have an account? <a routerLink="/signup" class="auth-link">Sign up</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 60vh;
      padding: 1rem;
    }

    .login-card {
      max-width: 420px;
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
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  loginForm: FormGroup;
  isLoading = false;
  returnUrl = '/';

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.isLoading = false;
        this.toastService.success('Logged in successfully!');
        this.router.navigateByUrl(this.returnUrl);
      },
      error: (err) => {
        this.isLoading = false;
        const errMsg = err.error?.message || err.error || 'Invalid email or password.';
        this.toastService.error(errMsg);
      }
    });
  }
}
