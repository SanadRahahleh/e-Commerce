import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="footer-container glass-panel">
      <div class="footer-content">
        <div class="footer-brand-section">
          <h4 class="footer-logo"><span class="logo-accent">Neo</span>Shop</h4>
          <p class="footer-desc">Your one-stop destination for premium electronics, smart devices, and computer accessories. Delivering quality and reliability directly to your doorstep.</p>
        </div>
        <div class="footer-links-section">
          <div class="links-column">
            <h5>Shop</h5>
            <ul>
              <li><a href="#">New Arrivals</a></li>
              <li><a href="#">Categories</a></li>
              <li><a href="#">Best Sellers</a></li>
            </ul>
          </div>
          <div class="links-column">
            <h5>Support</h5>
            <ul>
              <li><a href="#">FAQ</a></li>
              <li><a href="#">Shipping</a></li>
              <li><a href="#">Returns</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2026 NeoShop Inc. All rights reserved.</p>
      </div>
    </footer>
  `,
  styles: [`
    .footer-container {
      margin-top: auto;
      border-radius: 0;
      border-top: 1px solid var(--border-light);
      border-bottom: none;
      border-left: none;
      border-right: none;
      padding: 3rem 1.5rem 1.5rem 1.5rem;
      background: rgba(11, 15, 25, 0.85);
    }

    .footer-content {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 1fr;
      gap: 2rem;
      margin-bottom: 2.5rem;
    }

    @media (min-width: 768px) {
      .footer-content {
        grid-template-columns: 2fr 1fr;
      }
    }

    .footer-logo {
      font-size: 1.4rem;
      font-weight: 800;
      margin-bottom: 0.75rem;
      letter-spacing: -0.02em;
    }

    .logo-accent {
      color: var(--primary-color);
    }

    .footer-desc {
      color: var(--text-secondary);
      font-size: 0.9rem;
      max-width: 400px;
    }

    .footer-links-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
    }

    .links-column h5 {
      color: var(--text-primary);
      font-size: 0.95rem;
      margin-bottom: 1rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .links-column ul {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
    }

    .links-column a {
      color: var(--text-secondary);
      text-decoration: none;
      font-size: 0.85rem;
      transition: var(--transition-fast);
    }

    .links-column a:hover {
      color: var(--primary-color);
      padding-left: 2px;
    }

    .footer-bottom {
      max-width: 1200px;
      margin: 0 auto;
      border-top: 1px solid var(--border-light);
      padding-top: 1.5rem;
      text-align: center;
    }

    .footer-bottom p {
      color: var(--text-muted);
      font-size: 0.8rem;
    }
  `]
})
export class FooterComponent {}
