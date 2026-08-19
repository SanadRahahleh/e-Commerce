import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';
import { CartItem } from '../../models';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="cart-container">
      <h1 class="page-title">Shopping Cart</h1>

      @if (cartService.cart() === null || cartService.cart()?.items?.length === 0) {
        
        <div class="empty-cart glass-panel">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="empty-icon">
            <circle cx="8" cy="21" r="1"></circle>
            <circle cx="19" cy="21" r="1"></circle>
            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
          </svg>
          <h3>Your cart is empty</h3>
          <p>Explore our cyberpunk collection and grab some awesome gear!</p>
          <a routerLink="/" class="btn btn-primary">Start Shopping</a>
        </div>
      } @else {
        
        <div class="cart-layout">
          
          <div class="cart-items-section glass-panel">
            <div class="section-header">
              <h3>Items ({{ cartService.cartItemsCount() }})</h3>
              <button class="btn btn-secondary btn-sm clear-btn" (click)="clearCart()">Clear Cart</button>
            </div>

            <div class="items-list">
              @for (item of cartService.cart()?.items; track item.id) {
                <div class="cart-item">
                  <div class="item-img-wrapper glass-panel">
                    <img
                      [src]="item.productImageUrl || 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=100&q=80'"
                      [alt]="item.productName"
                      class="item-img"
                      (error)="handleImageError($event)"
                    />
                  </div>
                  
                  <div class="item-info">
                    <h4 class="item-name" [routerLink]="['/products', item.productId]">{{ item.productName }}</h4>
                    <span class="item-unit-price">{{ item.productPrice | currency:'USD' }}</span>
                  </div>

                  <div class="item-actions">
                    <div class="quantity-control">
                      <button class="qty-btn" (click)="updateQty(item, item.quantity - 1)" [disabled]="item.quantity <= 1">-</button>
                      <span class="qty-val">{{ item.quantity }}</span>
                      <button class="qty-btn" (click)="updateQty(item, item.quantity + 1)">+</button>
                    </div>

                    <span class="item-total-price">{{ (item.productPrice * item.quantity) | currency:'USD' }}</span>

                    <button class="delete-btn" (click)="removeItem(item)" aria-label="Remove item">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                      </svg>
                    </button>
                  </div>
                </div>
              }
            </div>
          </div>

          <div class="summary-section glass-panel">
            <h3>Order Summary</h3>
            
            <div class="summary-row">
              <span>Subtotal</span>
              <span>{{ cartService.cartTotal() | currency:'USD' }}</span>
            </div>
            
            <div class="summary-row">
              <span>Shipping</span>
              <span class="shipping-val">FREE</span>
            </div>
            
            <div class="divider"></div>

            <div class="summary-row total-row">
              <span>Total</span>
              <span>{{ cartService.cartTotal() | currency:'USD' }}</span>
            </div>

            <a routerLink="/checkout" class="btn btn-primary btn-full checkout-btn">
              Proceed to Checkout
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </a>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .cart-container {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .page-title {
      font-size: 2rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    .empty-cart {
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

    .empty-cart h3 {
      font-size: 1.5rem;
    }

    .empty-cart p {
      color: var(--text-secondary);
      max-width: 400px;
      margin-bottom: 1rem;
    }

    .cart-layout {
      display: grid;
      grid-template-columns: 1fr;
      gap: 2rem;
      align-items: start;
    }

    @media (min-width: 992px) {
      .cart-layout {
        grid-template-columns: 2fr 1fr;
      }
    }

    .cart-items-section {
      padding: 2rem;
      border-radius: var(--radius-lg);
      border-color: var(--panel-border);
    }

    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 2rem;
    }

    .clear-btn {
      padding: 0.4rem 0.8rem;
      font-size: 0.8rem;
    }

    .items-list {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .cart-item {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid var(--border-light);
    }

    @media (min-width: 600px) {
      .cart-item {
        flex-direction: row;
        align-items: center;
      }
    }

    .cart-item:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }

    .item-img-wrapper {
      width: 70px;
      height: 70px;
      border-radius: var(--radius-sm);
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      border-color: var(--panel-border);
    }

    .item-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .item-info {
      flex-grow: 1;
    }

    .item-name {
      font-size: 1.05rem;
      font-weight: 600;
      color: var(--text-primary);
      text-decoration: none;
      cursor: pointer;
      transition: var(--transition-fast);
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
      margin-bottom: 0.25rem;
    }

    .item-name:hover {
      color: var(--primary-color);
    }

    .item-unit-price {
      font-size: 0.85rem;
      color: var(--text-secondary);
    }

    .item-actions {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1.5rem;
    }

    @media (min-width: 600px) {
      .item-actions {
        justify-content: flex-end;
      }
    }

    .quantity-control {
      display: flex;
      align-items: center;
      border: 1px solid var(--border-color);
      border-radius: var(--radius-sm);
      background: rgba(255, 255, 255, 0.02);
      overflow: hidden;
    }

    .qty-btn {
      background: transparent;
      border: none;
      color: var(--text-primary);
      width: 30px;
      height: 30px;
      cursor: pointer;
      transition: var(--transition-fast);
    }

    .qty-btn:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.05);
    }

    .qty-btn:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }

    .qty-val {
      padding: 0 0.5rem;
      font-size: 0.9rem;
      font-weight: 600;
      min-width: 28px;
      text-align: center;
    }

    .item-total-price {
      font-size: 1.1rem;
      font-weight: 700;
      font-family: var(--font-heading);
      min-width: 80px;
      text-align: right;
    }

    .delete-btn {
      background: transparent;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      transition: var(--transition-fast);
      padding: 0.5rem;
      border-radius: var(--radius-sm);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .delete-btn:hover {
      color: var(--error);
      background: rgba(244, 63, 94, 0.05);
    }

    .summary-section {
      padding: 2.5rem 2rem;
      border-radius: var(--radius-lg);
      border-color: var(--panel-border);
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .summary-section h3 {
      font-size: 1.35rem;
      margin-bottom: 0.5rem;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      font-size: 0.95rem;
      color: var(--text-secondary);
    }

    .shipping-val {
      color: var(--success);
      font-weight: 700;
      font-size: 0.85rem;
    }

    .divider {
      height: 1px;
      background: var(--border-color);
    }

    .total-row {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    .total-row span:last-child {
      font-family: var(--font-heading);
    }

    .checkout-btn {
      margin-top: 1rem;
      height: 46px;
    }
  `]
})
export class CartComponent {
  cartService = inject(CartService);
  toastService = inject(ToastService);

  updateQty(item: CartItem, newQty: number) {
    if (newQty < 1) return;

    this.cartService.updateQuantity(item.id, newQty).subscribe({
      next: () => {
        this.toastService.success('Cart updated.');
      },
      error: (err) => {
        console.error(err);
        this.toastService.error('Failed to update quantity.');
      }
    });
  }

  removeItem(item: CartItem) {
    this.cartService.removeFromCart(item.id).subscribe({
      next: () => {
        this.toastService.success(`Removed ${item.productName} from cart.`);
      },
      error: (err) => {
        console.error(err);
        this.toastService.error('Failed to remove item.');
      }
    });
  }

  clearCart() {
    if (confirm('Are you sure you want to clear your cart?')) {
      this.cartService.clearCart().subscribe({
        next: () => {
          this.toastService.success('Cart cleared.');
        },
        error: (err) => {
          console.error(err);
          this.toastService.error('Failed to clear cart.');
        }
      });
    }
  }

  handleImageError(event: Event) {
    (event.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=100&q=80';
  }
}
