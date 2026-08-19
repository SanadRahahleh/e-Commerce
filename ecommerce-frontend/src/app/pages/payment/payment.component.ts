import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { PaymentService } from '../../services/payment.service';
import { ToastService } from '../../services/toast.service';
import { Order } from '../../models';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="payment-container">
      <h1 class="page-title">Payment Processing</h1>

      <div class="payment-layout">
        @if (isLoadingOrder()) {
          <div class="skeleton payment-sk-card"></div>
        } @else if (errorState()) {
          <div class="error-container glass-panel">
            <h3>Order Verification Failed</h3>
            <p>{{ errorState() }}</p>
            <a routerLink="/orders" class="btn btn-primary">Back to My Orders</a>
          </div>
        } @else {
          
          <div class="order-summary-card glass-panel">
            <h3>Invoice Details</h3>
            <div class="meta-row">
              <span>Order Reference:</span>
              <strong>#{{ orderId }}</strong>
            </div>
            <div class="meta-row">
              <span>Delivery Address:</span>
              <span class="address-preview">{{ order()?.address }}</span>
            </div>
            <div class="divider"></div>
            <div class="meta-row amount-row">
              <span>Total Amount:</span>
              <span class="amount-val">{{ order()?.totalPrice | currency:'USD' }}</span>
            </div>
          </div>

          <div class="payment-card glass-panel">
            <h3>Choose Payment Method</h3>
            <p class="section-desc">Select how you'd like to pay for your neo-gear.</p>

            <form [formGroup]="paymentForm" (ngSubmit)="onSubmit()" class="payment-form">
              <div class="methods-grid">

                <label class="method-option-card" [class.selected]="isSelected('CashOnDelivery')">
                  <input
                    type="radio"
                    formControlName="paymentMethod"
                    value="CashOnDelivery"
                    class="hidden-radio"
                  />
                  <div class="option-content">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="2" y="6" width="20" height="12" rx="2"></rect>
                      <circle cx="12" cy="12" r="2"></circle>
                      <path d="M6 12h.01M18 12h.01"></path>
                    </svg>
                    <div class="option-details">
                      <span class="option-title">Cash on Delivery</span>
                      <span class="option-desc">Pay with cash upon arrival</span>
                    </div>
                  </div>
                </label>

                <label class="method-option-card" [class.selected]="isSelected('Visa')">
                  <input
                    type="radio"
                    formControlName="paymentMethod"
                    value="Visa"
                    class="hidden-radio"
                  />
                  <div class="option-content">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                      <line x1="1" y1="10" x2="23" y2="10"></line>
                    </svg>
                    <div class="option-details">
                      <span class="option-title">Visa Card</span>
                      <span class="option-desc">Pay securely using Visa Credit/Debit</span>
                    </div>
                  </div>
                </label>

                <label class="method-option-card" [class.selected]="isSelected('MasterCard')">
                  <input
                    type="radio"
                    formControlName="paymentMethod"
                    value="MasterCard"
                    class="hidden-radio"
                  />
                  <div class="option-content">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                      <line x1="1" y1="10" x2="23" y2="10"></line>
                    </svg>
                    <div class="option-details">
                      <span class="option-title">MasterCard</span>
                      <span class="option-desc">Pay securely using MasterCard</span>
                    </div>
                  </div>
                </label>

              </div>

              <button type="submit" [disabled]="paymentForm.invalid || isProcessing" class="btn btn-primary btn-full submit-pay-btn">
                @if (isProcessing) {
                  <span class="spinner"></span> Securing Connection...
                } @else {
                  Confirm & Pay {{ order()?.totalPrice | currency:'USD' }}
                }
              </button>
            </form>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .payment-container {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .page-title {
      font-size: 2rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    .payment-layout {
      display: grid;
      grid-template-columns: 1fr;
      gap: 2rem;
      align-items: start;
    }

    @media (min-width: 992px) {
      .payment-layout {
        grid-template-columns: 1fr 1.5fr;
      }
    }

    .payment-sk-card {
      height: 250px;
      width: 100%;
      border-radius: var(--radius-lg);
    }

    .order-summary-card {
      padding: 2rem;
      border-radius: var(--radius-lg);
      border-color: var(--panel-border);
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .order-summary-card h3 {
      font-size: 1.25rem;
      margin-bottom: 0.5rem;
    }

    .meta-row {
      display: flex;
      justify-content: space-between;
      font-size: 0.95rem;
      color: var(--text-secondary);
      align-items: center;
    }

    .address-preview {
      max-width: 180px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: var(--text-primary);
    }

    .divider {
      height: 1px;
      background: var(--border-color);
    }

    .amount-row {
      font-size: 1.15rem;
      color: var(--text-primary);
    }

    .amount-val {
      font-size: 1.35rem;
      font-weight: 800;
      color: var(--primary-color);
      font-family: var(--font-heading);
    }

    .payment-card {
      padding: 2.5rem 2rem;
      border-radius: var(--radius-lg);
      border-color: var(--panel-border);
    }

    .payment-card h3 {
      font-size: 1.35rem;
      margin-bottom: 0.25rem;
    }

    .section-desc {
      font-size: 0.9rem;
      color: var(--text-secondary);
      margin-bottom: 2rem;
    }

    .payment-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .methods-grid {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .method-option-card {
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      padding: 1rem 1.25rem;
      cursor: pointer;
      display: block;
      background: rgba(255, 255, 255, 0.01);
      transition: var(--transition-smooth);
    }

    .method-option-card:hover {
      border-color: var(--text-muted);
      background: rgba(255, 255, 255, 0.03);
    }

    .method-option-card.selected {
      border-color: var(--primary-color);
      background: rgba(99, 102, 241, 0.06);
      box-shadow: 0 0 15px rgba(99, 102, 241, 0.1);
    }

    .hidden-radio {
      position: absolute;
      opacity: 0;
      width: 0;
      height: 0;
    }

    .option-content {
      display: flex;
      align-items: center;
      gap: 1.25rem;
    }

    .option-content svg {
      color: var(--text-secondary);
      flex-shrink: 0;
    }

    .method-option-card.selected svg {
      color: var(--primary-color);
    }

    .option-details {
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
    }

    .option-title {
      font-size: 0.95rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    .option-desc {
      font-size: 0.8rem;
      color: var(--text-secondary);
    }

    .submit-pay-btn {
      height: 46px;
      margin-top: 1rem;
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

    .error-container {
      padding: 4rem 2rem;
      text-align: center;
      border-radius: var(--radius-lg);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      border-color: var(--panel-border);
    }

    .error-container h3 {
      font-size: 1.5rem;
    }

    .error-container p {
      color: var(--text-secondary);
      margin-bottom: 1rem;
    }
  `]
})
export class PaymentComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private orderService = inject(OrderService);
  private paymentService = inject(PaymentService);
  private toastService = inject(ToastService);

  orderId!: number;
  order = signal<Order | null>(null);
  
  isLoadingOrder = signal<boolean>(true);
  errorState = signal<string | null>(null);
  isProcessing = false;

  paymentForm: FormGroup;

  constructor() {
    this.paymentForm = this.fb.group({
      paymentMethod: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const idStr = params.get('orderId');
      if (idStr) {
        this.orderId = Number(idStr);
        this.loadOrder();
      } else {
        this.errorState.set('Invalid order context.');
        this.isLoadingOrder.set(false);
      }
    });
  }

  loadOrder() {
    this.isLoadingOrder.set(true);
    this.errorState.set(null);

    this.orderService.getOrderById(this.orderId).subscribe({
      next: (data) => {

        if (data.status !== 'Pending') {
          this.toastService.info(`Order is already ${data.status}. No payment required.`);
          this.router.navigate(['/orders', data.id]);
          return;
        }
        this.order.set(data);
        this.isLoadingOrder.set(false);
      },
      error: (err) => {
        console.error(err);
        this.errorState.set('Order not found or permission denied.');
        this.isLoadingOrder.set(false);
      }
    });
  }

  isSelected(method: string): boolean {
    return this.paymentForm.get('paymentMethod')?.value === method;
  }

  onSubmit() {
    if (this.paymentForm.invalid) {
      return;
    }

    this.isProcessing = true;
    const method = this.paymentForm.get('paymentMethod')?.value;

    this.paymentService.processPayment(this.orderId, method).subscribe({
      next: () => {
        this.isProcessing = false;
        this.toastService.success('Payment completed successfully!');

        this.router.navigate(['/orders', this.orderId]);
      },
      error: (err) => {
        this.isProcessing = false;
        console.error(err);
        const errMsg = err.error?.message || err.error || 'Payment processing failed.';
        this.toastService.error(errMsg);
      }
    });
  }
}
