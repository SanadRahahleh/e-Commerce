import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="order-details-container">
      <div class="back-link-wrapper">
        <a routerLink="/orders" class="back-link">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to Orders
        </a>
      </div>

      @if (isLoading()) {
        
        <div class="skeleton details-sk-panel"></div>
      } @else if (errorState()) {
        
        <div class="error-container glass-panel">
          <h3>Failed to Load Order Details</h3>
          <p>{{ errorState() }}</p>
          <a routerLink="/orders" class="btn btn-primary">Back to Orders</a>
        </div>
      } @else {
        @if (order(); as ord) {
          
          <div class="details-layout">

            <div class="header-card glass-panel">
              <div class="title-meta">
                <span class="order-date">Placed on {{ ord.createdAt | date:'medium' }}</span>
                <h2>Order #{{ ord.id }}</h2>
              </div>
              
              <div class="status-col">
                <span class="badge" [class]="getStatusClass(ord.status)">
                  {{ ord.status }}
                </span>
                
                @if (ord.status === 'Pending') {
                  <a [routerLink]="['/payment', ord.id]" class="btn btn-primary pay-btn">
                    Pay Now
                  </a>
                }
              </div>
            </div>

            <div class="grid-split">

              <div class="items-card glass-panel">
                <h3>Order Items</h3>
                <div class="items-list">
                  @for (item of ord.items; track item.id) {
                    <div class="order-item">
                      <div class="item-meta">
                        <span class="item-name">{{ item.productName }}</span>
                        <span class="item-qty">Qty: {{ item.quantity }}</span>
                      </div>
                      
                      <div class="item-pricing">
                        <span class="price-val">{{ (item.priceAtTime * item.quantity) | currency:'USD' }}</span>
                        <span class="unit-price-label">({{ item.priceAtTime | currency:'USD' }} each)</span>
                      </div>
                    </div>
                  }
                </div>
              </div>

              <div class="sidebar-cards">

                <div class="sidebar-card glass-panel">
                  <h3>Delivery Address</h3>
                  <p class="address-text">{{ ord.address }}</p>
                </div>

                <div class="sidebar-card glass-panel">
                  <h3>Payment Summary</h3>
                  <div class="summary-rows">
                    <div class="summary-row">
                      <span>Subtotal</span>
                      <span>{{ ord.totalPrice | currency:'USD' }}</span>
                    </div>
                    <div class="summary-row">
                      <span>Shipping</span>
                      <span class="free-badge">FREE</span>
                    </div>
                    <div class="divider"></div>
                    <div class="summary-row total-row">
                      <span>Total Paid</span>
                      <span>{{ ord.totalPrice | currency:'USD' }}</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>
        }
      }
    </div>
  `,
  styles: [`
    .order-details-container {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .back-link-wrapper {
      margin-bottom: 0.5rem;
    }

    .back-link {
      color: var(--text-secondary);
      text-decoration: none;
      font-size: 0.95rem;
      font-weight: 500;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      transition: var(--transition-fast);
    }

    .back-link:hover {
      color: var(--primary-color);
      transform: translateX(-4px);
    }

    .details-sk-panel {
      height: 350px;
      width: 100%;
      border-radius: var(--radius-lg);
    }

    .details-layout {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .header-card {
      padding: 2rem;
      border-radius: var(--radius-lg);
      border-color: var(--panel-border);
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1.5rem;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.01) 0%, rgba(99, 102, 241, 0.03) 100%), var(--panel-bg);
    }

    .title-meta h2 {
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    .order-date {
      font-size: 0.85rem;
      color: var(--text-secondary);
    }

    .status-col {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .pay-btn {
      padding: 0.5rem 1.25rem;
      font-size: 0.85rem;
      background: var(--secondary-color);
      box-shadow: 0 4px 10px rgba(236, 72, 153, 0.2);
    }

    .pay-btn:hover {
      background: var(--secondary-hover);
      box-shadow: 0 6px 15px rgba(236, 72, 153, 0.3);
    }

    .grid-split {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.5rem;
      align-items: start;
    }

    @media (min-width: 992px) {
      .grid-split {
        grid-template-columns: 1.8fr 1fr;
      }
    }

    .items-card {
      padding: 2rem;
      border-radius: var(--radius-lg);
      border-color: var(--panel-border);
    }

    .items-card h3 {
      font-size: 1.25rem;
      margin-bottom: 1.5rem;
      border-bottom: 1px solid var(--border-color);
      padding-bottom: 0.75rem;
    }

    .items-list {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .order-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 1.25rem;
      border-bottom: 1px solid var(--border-light);
    }

    .order-item:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }

    .item-meta {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
    }

    .item-name {
      font-size: 1.05rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    .item-qty {
      font-size: 0.85rem;
      color: var(--text-muted);
    }

    .item-pricing {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }

    .item-pricing .price-val {
      font-size: 1.15rem;
      font-weight: 700;
      color: var(--text-primary);
      font-family: var(--font-heading);
    }

    .unit-price-label {
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .sidebar-cards {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .sidebar-card {
      padding: 1.75rem;
      border-radius: var(--radius-md);
      border-color: var(--panel-border);
    }

    .sidebar-card h3 {
      font-size: 1.15rem;
      margin-bottom: 1rem;
    }

    .address-text {
      color: var(--text-secondary);
      font-size: 0.95rem;
      line-height: 1.6;
    }

    .summary-rows {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      font-size: 0.9rem;
      color: var(--text-secondary);
    }

    .free-badge {
      color: var(--success);
      font-weight: 700;
    }

    .divider {
      height: 1px;
      background: var(--border-color);
    }

    .total-row {
      font-size: 1.15rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    .total-row span:last-child {
      font-family: var(--font-heading);
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
export class OrderDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private orderService = inject(OrderService);

  order = signal<Order | null>(null);
  isLoading = signal<boolean>(true);
  errorState = signal<string | null>(null);

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const idStr = params.get('id');
      if (idStr) {
        this.loadOrderDetails(Number(idStr));
      } else {
        this.errorState.set('Invalid Order ID.');
        this.isLoading.set(false);
      }
    });
  }

  loadOrderDetails(id: number) {
    this.isLoading.set(true);
    this.errorState.set(null);

    this.orderService.getOrderById(id).subscribe({
      next: (data) => {
        this.order.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.errorState.set('Order not found or access denied.');
        this.isLoading.set(false);
      }
    });
  }

  getStatusClass(status: string): string {
    const s = status.toLowerCase();
    return `badge-${s}`;
  }
}
