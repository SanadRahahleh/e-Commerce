import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="admin-container">
      
      <aside class="admin-sidebar glass-panel">
        <div class="sidebar-header">
          <h3>Control Panel</h3>
          <span class="sub">Administrator Mode</span>
        </div>

        <nav class="sidebar-nav">
          <a routerLink="products" routerLinkActive="active" class="nav-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
              <polyline points="2 17 12 22 22 17"></polyline>
              <polyline points="2 12 12 17 22 12"></polyline>
            </svg>
            Products CRUD
          </a>

          <a routerLink="categories" routerLinkActive="active" class="nav-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
              <line x1="4" y1="22" x2="4" y2="15"></line>
            </svg>
            Categories CRUD
          </a>

          <a routerLink="orders" routerLinkActive="active" class="nav-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
              <line x1="1" y1="10" x2="23" y2="10"></line>
            </svg>
            Manage Orders
          </a>

          <a routerLink="users" routerLinkActive="active" class="nav-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            Manage Users
          </a>
        </nav>
      </aside>

      <main class="admin-content-view">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .admin-container {
      display: grid;
      grid-template-columns: 1fr;
      gap: 2rem;
      align-items: start;
    }

    @media (min-width: 992px) {
      .admin-container {
        grid-template-columns: 240px 1fr;
      }
    }

    .admin-sidebar {
      padding: 1.5rem 1rem;
      border-radius: var(--radius-lg);
      border-color: var(--panel-border);
    }

    .sidebar-header {
      padding: 0.5rem 0.75rem 1.5rem 0.75rem;
      border-bottom: 1px solid var(--border-color);
      margin-bottom: 1.5rem;
    }

    .sidebar-header h3 {
      font-size: 1.2rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    .sidebar-header .sub {
      font-size: 0.75rem;
      color: var(--secondary-color);
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .sidebar-nav {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      border-radius: var(--radius-sm);
      color: var(--text-secondary);
      text-decoration: none;
      font-weight: 500;
      font-size: 0.9rem;
      transition: var(--transition-fast);
    }

    .nav-item svg {
      color: var(--text-secondary);
      transition: var(--transition-fast);
    }

    .nav-item:hover {
      color: var(--text-primary);
      background: rgba(255, 255, 255, 0.03);
    }

    .nav-item:hover svg {
      color: var(--text-primary);
    }

    .nav-item.active {
      color: var(--primary-color);
      background: rgba(99, 102, 241, 0.08);
      font-weight: 600;
    }

    .nav-item.active svg {
      color: var(--primary-color);
    }

    .admin-content-view {
      min-height: 500px;
    }
  `]
})
export class AdminDashboardComponent {}
