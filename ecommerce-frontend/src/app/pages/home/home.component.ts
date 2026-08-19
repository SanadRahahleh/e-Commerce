import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { Product, Category } from '../../models';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="home-container">
      
      <section class="hero-section glass-panel">
        <div class="hero-text">
          <h1 class="hero-title">Upgrade Your Gear</h1>
          <p class="hero-subtitle">Explore the latest smartphones, laptops, and premium accessories with free delivery nationwide.</p>
        </div>
      </section>

      <div class="controls-bar">
        <div class="search-box glass-panel">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            placeholder="Search products..."
            [value]="searchQuery()"
            (input)="onSearchInput($event)"
            class="search-input"
          />
        </div>

        <div class="categories-chips">
          <button
            class="chip"
            [class.active]="selectedCategoryId() === null"
            (click)="selectCategory(null)"
          >
            All Products
          </button>
          @for (cat of categories(); track cat.id) {
            <button
              class="chip"
              [class.active]="selectedCategoryId() === cat.id"
              (click)="selectCategory(cat.id)"
            >
              {{ cat.name }}
            </button>
          }
        </div>
      </div>

      @if (isLoading()) {
        
        <div class="products-grid">
          @for (mock of [1, 2, 3, 4, 5, 6]; track mock) {
            <div class="product-card skeleton-card">
              <div class="skeleton card-img-skeleton"></div>
              <div class="card-body-skeleton">
                <div class="skeleton line-skeleton title-sk"></div>
                <div class="skeleton line-skeleton cat-sk"></div>
                <div class="card-footer-skeleton">
                  <div class="skeleton line-skeleton price-sk"></div>
                  <div class="skeleton btn-sk"></div>
                </div>
              </div>
            </div>
          }
        </div>
      } @else if (errorState()) {
        
        <div class="error-container glass-panel">
          <h3>Failed to Load Products</h3>
          <p>{{ errorState() }}</p>
          <button class="btn btn-primary" (click)="loadData()">Try Again</button>
        </div>
      } @else if (filteredProducts().length === 0) {
        
        <div class="empty-container glass-panel">
          <h3>No Products Found</h3>
          <p>We couldn't find any items matching your criteria. Try altering your filters or query!</p>
        </div>
      } @else {
        
        <div class="products-grid">
          @for (prod of filteredProducts(); track prod.id) {
            <div class="product-card glass-panel">
              
              <div class="card-img-container" [routerLink]="['/products', prod.id]">
                <img
                  [src]="prod.imageUrl || 'assets/placeholder.jpg'"
                  [alt]="prod.name"
                  class="product-image"
                  (error)="handleImageError($event)"
                />
              </div>

              <div class="card-body">
                <div class="category-tag">{{ prod.categoryName || 'Product' }}</div>
                <h3 class="product-title" [routerLink]="['/products', prod.id]">{{ prod.name }}</h3>
                <p class="product-desc">{{ prod.description }}</p>
                
                <div class="card-footer">
                  <span class="product-price">{{ prod.price | currency:'USD':'symbol':'1.2-2' }}</span>
                  
                  <button class="btn btn-primary btn-sm add-cart-btn" (click)="addToCart(prod)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="9" cy="21" r="1"></circle>
                      <circle cx="20" cy="21" r="1"></circle>
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                    Add
                  </button>
                </div>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .home-container {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .hero-section {
      padding: 4rem 2rem;
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(236, 72, 153, 0.05) 100%), var(--panel-bg);
      border-color: var(--panel-border);
      overflow: hidden;
      position: relative;
    }

    .hero-text {
      max-width: 600px;
      z-index: 10;
    }

    .hero-title {
      font-size: 2.75rem;
      font-weight: 800;
      margin-bottom: 0.75rem;
      line-height: 1.1;
      background: linear-gradient(to right, #ffffff, #94a3b8);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .hero-subtitle {
      font-size: 1.1rem;
      color: var(--text-secondary);
      font-weight: 450;
    }

    .controls-bar {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    @media (min-width: 768px) {
      .controls-bar {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
      }
    }

    .search-box {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.6rem 1rem;
      border-radius: var(--radius-full);
      max-width: 400px;
      width: 100%;
      border-color: var(--panel-border);
    }

    .search-box svg {
      color: var(--text-secondary);
      flex-shrink: 0;
    }

    .search-input {
      background: transparent;
      border: none;
      color: var(--text-primary);
      width: 100%;
      outline: none;
      font-family: var(--font-body);
      font-size: 0.95rem;
    }

    .categories-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 0.6rem;
      overflow-x: auto;
      padding-bottom: 0.25rem;
    }

    .chip {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--border-color);
      color: var(--text-secondary);
      padding: 0.5rem 1.1rem;
      border-radius: var(--radius-full);
      cursor: pointer;
      font-size: 0.85rem;
      font-weight: 500;
      transition: var(--transition-fast);
      white-space: nowrap;
    }

    .chip:hover {
      background: rgba(255, 255, 255, 0.06);
      color: var(--text-primary);
      border-color: var(--text-muted);
    }

    .chip.active {
      background: var(--primary-color);
      color: #ffffff;
      border-color: var(--primary-color);
      box-shadow: 0 4px 10px 0 var(--primary-glow);
    }

    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 2rem;
    }

    .product-card {
      display: flex;
      flex-direction: column;
      border-radius: var(--radius-lg);
      border-color: var(--panel-border);
      overflow: hidden;
      height: 100%;
      transition: var(--transition-smooth);
    }

    .product-card:hover {
      transform: translateY(-6px);
      border-color: var(--panel-hover-border);
      box-shadow: var(--shadow-glow), var(--shadow-lg);
    }

    .card-img-container {
      aspect-ratio: 1.25 / 1;
      overflow: hidden;
      background: rgba(255, 255, 255, 0.01);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }

    .product-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: var(--transition-smooth);
    }

    .product-card:hover .product-image {
      transform: scale(1.05);
    }

    .card-body {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      flex-grow: 1;
    }

    .category-tag {
      font-size: 0.75rem;
      text-transform: uppercase;
      font-weight: 700;
      color: var(--secondary-color);
      margin-bottom: 0.5rem;
      letter-spacing: 0.05em;
    }

    .product-title {
      font-size: 1.2rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
      cursor: pointer;
      color: var(--text-primary);
      transition: var(--transition-fast);

      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .product-title:hover {
      color: var(--primary-color);
    }

    .product-desc {
      color: var(--text-secondary);
      font-size: 0.85rem;
      margin-bottom: 1.5rem;
      line-height: 1.5;

      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .card-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: auto;
    }

    .product-price {
      font-size: 1.35rem;
      font-weight: 700;
      color: var(--text-primary);
      font-family: var(--font-heading);
    }

    .add-cart-btn {
      padding: 0.5rem 1rem;
      border-radius: var(--radius-sm);
    }

    .skeleton-card {
      pointer-events: none;
    }

    .card-img-skeleton {
      aspect-ratio: 1.25 / 1;
      width: 100%;
    }

    .card-body-skeleton {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .line-skeleton {
      height: 12px;
      width: 100%;
    }

    .title-sk { height: 18px; width: 70%; }
    .cat-sk { height: 10px; width: 40%; }
    .price-sk { height: 22px; width: 30%; }
    
    .card-footer-skeleton {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 1rem;
    }

    .btn-sk {
      height: 32px;
      width: 70px;
    }

    .error-container, .empty-container {
      padding: 4rem 2rem;
      text-align: center;
      border-radius: var(--radius-lg);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      border-color: var(--panel-border);
    }

    .error-container h3, .empty-container h3 {
      font-size: 1.5rem;
    }

    .error-container p, .empty-container p {
      color: var(--text-secondary);
      max-width: 450px;
      margin-bottom: 1rem;
    }
  `]
})
export class HomeComponent implements OnInit {
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private cartService = inject(CartService);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  products = signal<Product[]>([]);
  categories = signal<Category[]>([]);

  searchQuery = signal<string>('');
  selectedCategoryId = signal<number | null>(null);

  isLoading = signal<boolean>(true);
  errorState = signal<string | null>(null);

  filteredProducts = computed(() => {
    let prods = this.products();
    const query = this.searchQuery().toLowerCase().trim();
    const categoryId = this.selectedCategoryId();

    if (categoryId !== null) {
      prods = prods.filter(p => (p.categoryID ?? p.categoryId) === categoryId);
    }

    if (query !== '') {
      prods = prods.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
      );
    }

    return prods;
  });

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading.set(true);
    this.errorState.set(null);

    forkJoin({
      prods: this.productService.getProducts(),
      cats: this.categoryService.getCategories()
    }).subscribe({
      next: (results) => {

        const catMap = new Map(results.cats.map(c => [c.id, c.name]));
        const mappedProds = results.prods.map(p => {
          const catId = p.categoryID ?? p.categoryId;
          return {
            ...p,
            categoryId: catId,
            categoryName: p.categoryName || catMap.get(catId ?? -1) || 'Product'
          };
        });

        this.products.set(mappedProds);
        this.categories.set(results.cats);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.errorState.set('Server is offline or database query failed.');
        this.isLoading.set(false);
        this.toastService.error('Failed to load catalog.');
      }
    });
  }

  onSearchInput(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.searchQuery.set(val);
  }

  selectCategory(id: number | null) {
    this.selectedCategoryId.set(id);
  }

  addToCart(product: Product) {
    if (!this.authService.isAuthenticated()) {
      this.toastService.info('Please log in to add items to your cart.');
      this.router.navigate(['/login']);
      return;
    }

    this.cartService.addToCart(product.id, 1).subscribe({
      next: () => {
        this.toastService.success(`Added ${product.name} to cart.`);
      },
      error: (err) => {
        console.error(err);
        this.toastService.error('Could not add item to cart.');
      }
    });
  }

  handleImageError(event: Event) {
    (event.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=500&q=80';
  }
}
