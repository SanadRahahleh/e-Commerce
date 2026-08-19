import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../services/order.service';
import { ToastService } from '../../../services/toast.service';
import { Order } from '../../../models';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-orders-container">
      <div class="panel-header">
        <div>
          <h2>Manage Orders</h2>
          <p class="sub">View incoming orders and alter shipment status</p>
        </div>
      </div>

      @if (isLoading()) {
        <div class="skeleton skeleton-table"></div>
      } @else {
        <div class="custom-table-container glass-panel">
          <table class="custom-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Ship To</th>
                <th>Total Price</th>
                <th>Status</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              @for (ord of orders(); track ord.id) {
                <tr>
                  <td>#{{ ord.id }}</td>
                  <td>{{ ord.createdAt | date:'mediumDate' }}</td>
                  <td class="address-cell" [title]="ord.address">{{ ord.address }}</td>
                  <td class="price-cell">{{ ord.totalPrice | currency:'USD' }}</td>
                  <td>
                    
                    <select
                      class="status-select"
                      [class]="getStatusClass(ord.status)"
                      [value]="ord.status"
                      (change)="onStatusChange(ord.id, $event)"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td>
                    <button class="btn btn-secondary btn-sm" (click)="viewOrderItems(ord)">
                      View Items
                    </button>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="6" class="empty-row-text">No orders placed in the system yet.</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }

      @if (selectedOrder(); as activeOrd) {
        <div class="modal-overlay" (click)="closeModal()">
          <div class="modal-card glass-panel" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h3>Order #{{ activeOrd.id }} Items</h3>
              <button class="close-btn" (click)="closeModal()">&times;</button>
            </div>

            <div class="items-list-modal">
              <div class="meta-section">
                <p><strong>Shipped To:</strong> {{ activeOrd.address }}</p>
                <p><strong>Placed On:</strong> {{ activeOrd.createdAt | date:'medium' }}</p>
              </div>
              <div class="divider"></div>
              
              <div class="items-grid">
                @for (item of activeOrd.items; track item.id) {
                  <div class="modal-item-row">
                    <div class="info">
                      <span class="name">{{ item.productName }}</span>
                      <span class="qty">Qty: {{ item.quantity }}</span>
                    </div>
                    <span class="price">{{ (item.priceAtTime * item.quantity) | currency:'USD' }}</span>
                  </div>
                }
              </div>

              <div class="divider"></div>
              <div class="total-row">
                <span>Grand Total:</span>
                <strong>{{ activeOrd.totalPrice | currency:'USD' }}</strong>
              </div>
            </div>

            <div class="modal-footer">
              <button class="btn btn-secondary" (click)="closeModal()">Close</button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .admin-orders-container {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .panel-header h2 {
      font-size: 1.6rem;
      color: var(--text-primary);
    }

    .panel-header .sub {
      font-size: 0.85rem;
      color: var(--text-secondary);
    }

    .skeleton-table {
      height: 350px;
      width: 100%;
      border-radius: var(--radius-lg);
    }

    .address-cell {
      max-width: 160px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .price-cell {
      font-family: var(--font-heading);
      font-weight: 700;
      color: var(--text-primary);
    }

    .empty-row-text {
      text-align: center;
      padding: 3rem !important;
      color: var(--text-muted);
    }

    .status-select {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-sm);
      padding: 0.4rem 0.6rem;
      color: var(--text-primary);
      outline: none;
      cursor: pointer;
      font-size: 0.85rem;
      font-weight: 600;
      transition: var(--transition-fast);
      text-transform: uppercase;
    }

    .status-select option {
      background: var(--bg-color);
      color: var(--text-primary);
    }

    .status-select.badge-pending { border-color: var(--warning); color: var(--warning); }
    .status-select.badge-processing { border-color: var(--info); color: var(--info); }
    .status-select.badge-shipped { border-color: var(--primary-color); color: var(--primary-color); }
    .status-select.badge-delivered { border-color: var(--success); color: var(--success); }
    .status-select.badge-cancelled { border-color: var(--error); color: var(--error); }

    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(4px);
      z-index: 2000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
    }

    .modal-card {
      max-width: 480px;
      width: 100%;
      border-radius: var(--radius-lg);
      border-color: var(--panel-border);
      padding: 2rem;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      animation: zoomIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--border-color);
      padding-bottom: 0.75rem;
    }

    .modal-header h3 {
      font-size: 1.25rem;
    }

    .close-btn {
      background: transparent;
      border: none;
      color: var(--text-muted);
      font-size: 1.75rem;
      cursor: pointer;
      line-height: 1;
    }

    .close-btn:hover {
      color: var(--text-primary);
    }

    .items-list-modal {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .meta-section p {
      font-size: 0.85rem;
      color: var(--text-secondary);
      margin-bottom: 0.25rem;
    }

    .divider {
      height: 1px;
      background: var(--border-color);
    }

    .items-grid {
      display: flex;
      flex-direction: column;
      gap: 0.8rem;
      max-height: 180px;
      overflow-y: auto;
    }

    .modal-item-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.9rem;
    }

    .modal-item-row .info {
      display: flex;
      flex-direction: column;
    }

    .modal-item-row .name {
      color: var(--text-primary);
      font-weight: 500;
    }

    .modal-item-row .qty {
      color: var(--text-muted);
      font-size: 0.75rem;
    }

    .modal-item-row .price {
      font-weight: 600;
      color: var(--text-primary);
      font-family: var(--font-heading);
    }

    .total-row {
      display: flex;
      justify-content: space-between;
      font-size: 1.15rem;
      color: var(--text-primary);
    }

    .total-row strong {
      color: var(--primary-color);
      font-family: var(--font-heading);
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
    }

    @keyframes zoomIn {
      from { transform: scale(0.95); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
  `]
})
export class AdminOrdersComponent implements OnInit {
  private orderService = inject(OrderService);
  private toastService = inject(ToastService);

  orders = signal<Order[]>([]);
  isLoading = signal<boolean>(true);
  selectedOrder = signal<Order | null>(null);

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.isLoading.set(true);
    this.orderService.getAllOrders().subscribe({
      next: (data) => {

        this.orders.set(data.sort((a, b) => b.id - a.id));
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.toastService.error('Failed to query system orders.');
        this.isLoading.set(false);
      }
    });
  }

  onStatusChange(orderId: number, event: Event) {
    const select = event.target as HTMLSelectElement;
    const newStatus = select.value;

    select.className = `status-select ${this.getStatusClass(newStatus)}`;

    this.orderService.updateOrderStatus(orderId, newStatus).subscribe({
      next: () => {
        this.toastService.success(`Order #${orderId} status set to ${newStatus}.`);
        this.loadOrders();
      },
      error: (err) => {
        console.error(err);
        this.toastService.error('Failed to change order status.');

        this.loadOrders();
      }
    });
  }

  getStatusClass(status: string): string {
    const s = status.toLowerCase();
    return `badge-${s}`;
  }

  viewOrderItems(order: Order) {
    this.selectedOrder.set(order);
  }

  closeModal() {
    this.selectedOrder.set(null);
  }
}
