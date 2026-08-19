import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header class="navbar-header glass-panel">
      <div class="navbar-container">
        
        <a routerLink="/" class="navbar-brand">
          <span class="logo-accent">Neo</span>Shop
        </a>

        <button class="menu-toggle" (click)="toggleMenu()" aria-label="Toggle Menu">
          <span class="bar" [class.open]="isMenuOpen()"></span>
          <span class="bar" [class.open]="isMenuOpen()"></span>
          <span class="bar" [class.open]="isMenuOpen()"></span>
        </button>

        <nav class="navbar-links" [class.show]="isMenuOpen()">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" (click)="closeMenu()">Home</a>
          
          @if (authService.isAuthenticated()) {
            @if (authService.isAdmin()) {
              <a routerLink="/admin" routerLinkActive="active" class="admin-link" (click)="closeMenu()">Admin Dashboard</a>
            } @else {
              <a routerLink="/orders" routerLinkActive="active" (click)="closeMenu()">My Orders</a>
            }
            
            <div class="user-profile">
              <span class="user-name">Hi, {{ authService.currentUser()?.fullName }}</span>
              <button class="btn btn-secondary btn-sm" (click)="logout()">Logout</button>
            </div>
          } @else {
            <a routerLink="/login" routerLinkActive="active" class="auth-btn" (click)="closeMenu()">Login</a>
            <a routerLink="/signup" routerLinkActive="active" class="btn btn-primary btn-sm signup-nav-btn" (click)="closeMenu()">Sign Up</a>
          }

          <a routerLink="/cart" class="cart-badge-container" (click)="closeMenu()">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="8" cy="21" r="1"></circle>
              <circle cx="19" cy="21" r="1"></circle>
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
            </svg>
            @if (cartService.cartItemsCount() > 0) {
              <span class="cart-count">{{ cartService.cartItemsCount() }}</span>
            }
          </a>
        </nav>
      </div>
    </header>
  `,
  styles: [`
    .navbar-header {
      position: sticky;
      top: 0;
      z-index: 1000;
      margin: 0;
      border-radius: 0;
      border-bottom: 1px solid var(--border-light);
      padding: 1rem 1.5rem;
      border-top: none;
      border-left: none;
      border-right: none;
    }

    .navbar-container {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .navbar-brand {
      font-family: var(--font-heading);
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--text-primary);
      text-decoration: none;
      letter-spacing: -0.03em;
    }

    .logo-accent {
      color: var(--primary-color);
    }

    .navbar-links {
      display: flex;
      align-items: center;
      gap: 2rem;
    }

    .navbar-links a {
      color: var(--text-secondary);
      text-decoration: none;
      font-weight: 500;
      font-size: 0.95rem;
      transition: var(--transition-fast);
      position: relative;
      padding: 0.25rem 0;
    }

    .navbar-links a:hover {
      color: var(--text-primary);
    }

    .navbar-links a.active {
      color: var(--primary-color);
    }

    .navbar-links a.active::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 0;
      width: 100%;
      height: 2px;
      background: var(--primary-color);
      border-radius: var(--radius-full);
      box-shadow: 0 0 8px var(--primary-color);
    }

    .admin-link {
      color: var(--secondary-color) !important;
    }
    .admin-link.active::after {
      background: var(--secondary-color) !important;
      box-shadow: 0 0 8px var(--secondary-color) !important;
    }

    .user-profile {
      display: flex;
      align-items: center;
      gap: 1rem;
      border-left: 1px solid var(--border-color);
      padding-left: 1.5rem;
    }

    .user-name {
      font-size: 0.9rem;
      color: var(--text-secondary);
      font-weight: 500;
    }

    .cart-badge-container {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-secondary);
      padding: 0.5rem;
      border-radius: var(--radius-sm);
      transition: var(--transition-fast);
    }

    .cart-badge-container:hover {
      color: var(--text-primary);
      background: rgba(255, 255, 255, 0.04);
      transform: scale(1.05);
    }

    .cart-badge-container.active::after {
      display: none; /* Override default underline for active link */
    }

    .cart-count {
      position: absolute;
      top: -2px;
      right: -2px;
      background: var(--secondary-color);
      color: white;
      font-size: 0.7rem;
      font-weight: 700;
      min-width: 18px;
      height: 18px;
      border-radius: var(--radius-full);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
    }

    .menu-toggle {
      display: none;
      flex-direction: column;
      justify-content: space-between;
      width: 24px;
      height: 18px;
      background: transparent;
      border: none;
      cursor: pointer;
      padding: 0;
      z-index: 1010;
    }

    .menu-toggle .bar {
      width: 100%;
      height: 2px;
      background-color: var(--text-primary);
      transition: var(--transition-smooth);
    }

    .menu-toggle .bar.open:nth-child(1) {
      transform: translateY(8px) rotate(45deg);
    }

    .menu-toggle .bar.open:nth-child(2) {
      opacity: 0;
    }

    .menu-toggle .bar.open:nth-child(3) {
      transform: translateY(-8px) rotate(-45deg);
    }

    @media (max-width: 768px) {
      .menu-toggle {
        display: flex;
      }

      .navbar-links {
        position: fixed;
        top: 60px;
        left: 0;
        right: 0;
        bottom: 0;
        background: var(--bg-color);
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 2.5rem;
        transform: translateY(-100%);
        opacity: 0;
        pointer-events: none;
        transition: var(--transition-smooth);
        z-index: 999;
      }

      .navbar-links.show {
        transform: translateY(0);
        opacity: 1;
        pointer-events: all;
      }

      .navbar-links a {
        font-size: 1.25rem;
      }

      .user-profile {
        flex-direction: column;
        border-left: none;
        padding-left: 0;
        gap: 1rem;
      }

      .signup-nav-btn {
        width: 180px;
      }
    }
  `]
})
export class NavbarComponent {
  authService = inject(AuthService);
  cartService = inject(CartService);

  isMenuOpen = signal(false);

  toggleMenu() {
    this.isMenuOpen.update(v => !v);
  }

  closeMenu() {
    this.isMenuOpen.set(false);
  }

  logout() {
    this.closeMenu();
    this.authService.logout();
  }
}
