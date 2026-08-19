import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { ToastService } from '../../services/toast.service';
import { Order } from '../../models';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="orders-container">
      <h1 class="page-title">My Orders</h1>

      @if (isLoading()) {
        
        <div class="skeleton-list">
          @for (mock of [1, 2, 3]; track mock) {
            <div class="skeleton order-sk-card"></div>
          }
        </div>
      } @else if (errorState()) {
        
        <div class="error-container glass-panel">
          <h3>Failed to Load Orders</h3>
          <p>{{ errorState() }}</p>
          <button class="btn btn-primary" (click)="loadOrders()">Retry</button>
        </div>
      } @else if (orders().length === 0) {
        
        <div class="empty-orders glass-panel">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="empty-icon">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="9" y1="9" x2="15" y2="9"></line>
            <line x1="9" y1="13" x2="15" y2="13"></line>
            <line x1="9" y1="17" x2="15" y2="17"></line>
          </svg>
          <h3>No Orders Found</h3>
          <p>You haven't placed any orders yet. Check out our products to get started!</p>
          <a routerLink="/" class="btn btn-primary">Browse Catalog</a>
        </div>
      } @else {
        
        <div class="orders-list">
          @for (order of orders(); track order.id) {
            <div class="order-card glass-panel">
              <div class="card-header">
                <div class="order-meta">
                  <span class="order-id">Order ID: #{{ order.id }}</span>
                  <span class="order-date">{{ order.createdAt | date:'mediumDate' }}</span>
                </div>
                
                <span class="badge" [class]="getStatusClass(order.status)">
                  {{ order.status }}
                </span>
              </div>
              
              <div class="card-body">
                <div class="summary-details">
                  <div class="detail-group">
                    <span class="label">Total Price</span>
                    <span class="val price">{{ order.totalPrice | currency:'USD' }}</span>
                  </div>
                  <div class="detail-group">
                    <span class="label">Ship To</span>
                    <span class="val address-preview">{{ order.address }}</span>
                  </div>
                </div>

                <div class="card-actions">
                  <a [routerLink]="['/orders', order.id]" class="btn btn-secondary btn-sm">
                    View Details
                  </a>
                  
                  @if (order.status === 'Pending') {
                    <a [routerLink]="['/payment', order.id]" class="btn btn-primary btn-sm pay-now-btn">
                      Pay Now
                    </a>
                  }
                </div>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .orders-container {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .page-title {
      font-size: 2rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    .skeleton-list {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .order-sk-card {
      height: 140px;
      width: 100%;
      border-radius: var(--radius-md);
    }

    .empty-orders {
      padding: 5rem 2rem;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      border-color: var(--panel-border);
    }

    .empty-icon {
      color: var(--text-muted);
      margin-bottom: 0.5rem;
    }

    .empty-orders h3 {
      font-size: 1.5rem;
    }

    .empty-orders p {
      color: var(--text-secondary);
      max-width: 400px;
      margin-bottom: 1rem;
    }

    .orders-list {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .order-card {
      border-radius: var(--radius-md);
      border-color: var(--panel-border);
      overflow: hidden;
      transition: var(--transition-smooth);
    }

    .order-card:hover {
      border-color: var(--panel-hover-border);
      transform: translateY(-2px);
    }

    .card-header {
      padding: 1.25rem 1.5rem;
      background: rgba(255, 255, 255, 0.01);
      border-bottom: 1px solid var(--border-light);
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .order-meta {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
    }

    .order-id {
      font-family: var(--font-heading);
      font-weight: 700;
      color: var(--text-primary);
      font-size: 1.05rem;
    }

    .order-date {
      font-size: 0.8rem;
      color: var(--text-secondary);
    }

    .card-body {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    @media (min-width: 768px) {
      .card-body {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
      }
    }

    .summary-details {
      display: flex;
      gap: 2rem;
      flex-wrap: wrap;
      flex-grow: 1;
    }

    .detail-group {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .detail-group .label {
      font-size: 0.75rem;
      text-transform: uppercase;
      color: var(--text-muted);
      letter-spacing: 0.05em;
      font-weight: 600;
    }

    .detail-group .val {
      font-size: 0.95rem;
      color: var(--text-primary);
    }

    .detail-group .val.price {
      font-weight: 700;
      color: var(--text-primary);
      font-family: var(--font-heading);
    }

    .address-preview {

      max-width: 250px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .card-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
      flex-shrink: 0;
    }

    .pay-now-btn {
      background: var(--secondary-color);
      box-shadow: 0 4px 10px rgba(236, 72, 153, 0.2);
    }

    .pay-now-btn:hover {
      background: var(--secondary-hover);
      box-shadow: 0 6px 15px rgba(236, 72, 153, 0.3);
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
export class OrdersComponent implements OnInit {
  private orderService = inject(OrderService);
  private toastService = inject(ToastService);

  orders = signal<Order[]>([]);
  isLoading = signal<boolean>(true);
  errorState = signal<string | null>(null);

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.isLoading.set(true);
    this.errorState.set(null);

    this.orderService.getOrders().subscribe({
      next: (data) => {

        this.orders.set(data.sort((a, b) => b.id - a.id));
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.errorState.set('Server is offline or database query failed.');
        this.isLoading.set(false);
        this.toastService.error('Failed to load orders.');
      }
    });
  }

  getStatusClass(status: string): string {
    const s = status.toLowerCase();
    return `badge-${s}`;
  }
}
