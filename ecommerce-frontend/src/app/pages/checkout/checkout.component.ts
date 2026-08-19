import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { ToastService } from '../../services/toast.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="checkout-container">
      <h1 class="page-title">Checkout</h1>

      <div class="checkout-layout">
        
        <div class="form-section glass-panel">
          <h3>Shipping Information</h3>
          <p class="section-desc">Please enter the delivery address for your order.</p>

          <form [formGroup]="checkoutForm" (ngSubmit)="onSubmit()" class="checkout-form">
            
            <div class="form-group">
              <label class="form-label" for="phone">Contact Phone Number</label>
              <input
                type="tel"
                id="phone"
                formControlName="phone"
                class="form-control"
                [class.invalid]="isFieldInvalid('phone')"
                placeholder="+962 7 9000 0000"
              />
              @if (isFieldInvalid('phone')) {
                <span class="form-error">Contact phone number is required.</span>
              }
              <span class="form-hint">
                This number will be used for delivery contact. Changing it updates your profile.
              </span>
            </div>

            <div class="form-group">
              <label class="form-label" for="address">Delivery Address</label>
              <textarea
                id="address"
                formControlName="address"
                rows="4"
                class="form-control"
                [class.invalid]="isFieldInvalid('address')"
                placeholder="Street address, apartment, city, state, zip code"
              ></textarea>
              @if (isFieldInvalid('address')) {
                <span class="form-error">Delivery address is required.</span>
              }
            </div>

            <div class="button-row">
              <a routerLink="/cart" class="btn btn-secondary">Back to Cart</a>
              
              <button type="submit" [disabled]="checkoutForm.invalid || isLoading" class="btn btn-primary place-order-btn">
                @if (isLoading) {
                  <span class="spinner"></span> Processing Order...
                } @else {
                  Place Order & Pay
                }
              </button>
            </div>
          </form>
        </div>

        <div class="preview-section glass-panel">
          <h3>Items Details</h3>
          
          <div class="preview-items">
            @for (item of cartService.cart()?.items; track item.id) {
              <div class="preview-item">
                <span class="item-name">{{ item.productName }} <span class="item-qty">x {{ item.quantity }}</span></span>
                <span class="item-price">{{ (item.productPrice * item.quantity) | currency:'USD' }}</span>
              </div>
            }
          </div>

          <div class="divider"></div>

          <div class="summary-totals">
            <div class="summary-row">
              <span>Subtotal</span>
              <span>{{ cartService.cartTotal() | currency:'USD' }}</span>
            </div>
            <div class="summary-row">
              <span>Shipping</span>
              <span class="shipping-free">FREE</span>
            </div>
            <div class="divider"></div>
            <div class="summary-row total-row">
              <span>Order Total</span>
              <span>{{ cartService.cartTotal() | currency:'USD' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .checkout-container {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .page-title {
      font-size: 2rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    .checkout-layout {
      display: grid;
      grid-template-columns: 1fr;
      gap: 2rem;
      align-items: start;
    }

    @media (min-width: 992px) {
      .checkout-layout {
        grid-template-columns: 1.5fr 1fr;
      }
    }

    .form-section {
      padding: 2.5rem 2rem;
      border-radius: var(--radius-lg);
      border-color: var(--panel-border);
    }

    .form-section h3 {
      font-size: 1.35rem;
      margin-bottom: 0.25rem;
    }

    .section-desc {
      font-size: 0.9rem;
      color: var(--text-secondary);
      margin-bottom: 2rem;
    }

    .checkout-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    textarea.form-control {
      resize: vertical;
      line-height: 1.5;
    }

    .form-hint {
      font-size: 0.8rem;
      color: var(--text-muted);
      margin-top: 0.35rem;
      display: block;
    }

    .button-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 1rem;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .place-order-btn {
      height: 44px;
    }

    .preview-section {
      padding: 2.5rem 2rem;
      border-radius: var(--radius-lg);
      border-color: var(--panel-border);
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .preview-section h3 {
      font-size: 1.25rem;
    }

    .preview-items {
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
      max-height: 200px;
      overflow-y: auto;
      padding-right: 0.25rem;
    }

    .preview-item {
      display: flex;
      justify-content: space-between;
      font-size: 0.9rem;
      color: var(--text-secondary);
      align-items: center;
    }

    .preview-item .item-name {
      color: var(--text-primary);
      font-weight: 500;

      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
      margin-right: 1rem;
    }

    .item-qty {
      color: var(--text-muted);
      font-size: 0.8rem;
    }

    .divider {
      height: 1px;
      background: var(--border-color);
    }

    .summary-totals {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      font-size: 0.95rem;
      color: var(--text-secondary);
    }

    .shipping-free {
      color: var(--success);
      font-weight: 700;
    }

    .total-row {
      font-size: 1.2rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    .total-row span:last-child {
      font-family: var(--font-heading);
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
export class CheckoutComponent {
  private fb = inject(FormBuilder);
  cartService = inject(CartService);
  private orderService = inject(OrderService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  public authService = inject(AuthService);

  checkoutForm: FormGroup;
  isLoading = false;

  constructor() {
    const user = this.authService.currentUser();
    this.checkoutForm = this.fb.group({
      address: [user?.address || '', Validators.required],
      phone: [user?.phone || '', Validators.required]
    });

    if (this.cartService.cartItemsCount() === 0) {
      this.toastService.info('Your cart is empty. Please add items before checking out.');
      this.router.navigate(['/']);
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.checkoutForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit() {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const { address, phone } = this.checkoutForm.value;

    this.orderService.createOrder(address, phone).subscribe({
      next: (order: any) => {
        this.isLoading = false;
        this.toastService.success('Order placed successfully!');

        // Update the client's local user details cache so next checkout has updated profile
        this.authService.updateLocalUserProfile(phone, address);

        this.cartService.cart.set(null);

        this.router.navigate(['/payment', order.orderId]);
      },
      error: (err) => {
        this.isLoading = false;
        console.error(err);
        const errMsg = err.error?.message || err.error || 'Failed to place order.';
        this.toastService.error(errMsg);
      }
    });
  }
}
