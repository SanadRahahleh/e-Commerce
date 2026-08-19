import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { ReviewService } from '../../services/review.service';
import { ProductImageService } from '../../services/product-image.service';
import { Product, Review, ProductImage } from '../../models';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="details-container">
      <div class="back-link-wrapper">
        <a routerLink="/" class="back-link">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to Catalog
        </a>
      </div>

      @if (isLoading()) {
        <div class="details-layout skeleton-layout">
          <div class="skeleton img-sk"></div>
          <div class="info-sk-wrapper">
            <div class="skeleton title-sk"></div>
            <div class="skeleton cat-sk"></div>
            <div class="skeleton price-sk"></div>
            <div class="skeleton desc-sk"></div>
            <div class="skeleton btn-sk"></div>
          </div>
        </div>
      } @else if (errorState()) {
        <div class="error-container glass-panel">
          <h3>Failed to Load Product</h3>
          <p>{{ errorState() }}</p>
          <a routerLink="/" class="btn btn-primary">Back to Home</a>
        </div>
      } @else {
        @if (product(); as prod) {
          <div class="details-layout">
            <div class="product-gallery">
              <div class="main-image-wrapper glass-panel">
                <img
                  [src]="selectedImage() || 'assets/placeholder.jpg'"
                  [alt]="prod.name"
                  class="main-image"
                  (error)="handleImageError($event)"
                />
              </div>
              @if (images().length > 1) {
                <div class="thumbnails-grid">
                  @for (imgUrl of images(); track imgUrl) {
                    <div
                      class="thumbnail glass-panel"
                      [class.active]="imgUrl === selectedImage()"
                      (click)="selectedImage.set(imgUrl)"
                    >
                      <img [src]="imgUrl" (error)="handleImageError($event)" alt="thumbnail" />
                    </div>
                  }
                </div>
              }
            </div>

            <div class="product-info glass-panel">
              <span class="product-category">{{ prod.categoryName || 'Premium Gear' }}</span>
              <h1 class="product-title">{{ prod.name }}</h1>
              
              <div class="price-row">
                <span class="price-val">{{ prod.price | currency:'USD':'symbol':'1.2-2' }}</span>
                <span class="availability-badge">In Stock</span>
              </div>

              <div class="divider"></div>

              <div class="desc-section">
                <h4>Description</h4>
                <p>{{ prod.description }}</p>
              </div>

              <div class="divider"></div>

              <div class="actions-section">
                <div class="quantity-picker">
                  <button class="qty-btn" (click)="decrementQty()" [disabled]="quantity() <= 1">-</button>
                  <span class="qty-val">{{ quantity() }}</span>
                  <button class="qty-btn" (click)="incrementQty()">+</button>
                </div>

                <button class="btn btn-primary add-cart-btn" (click)="addToCart(prod)">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                  </svg>
                  Add To Cart
                </button>
              </div>
            </div>
          </div>

          <!-- Reviews Section -->
          <div class="reviews-section glass-panel">
            <div class="reviews-header">
              <h3>Customer Reviews</h3>
              @if (reviews().length > 0) {
                <div class="average-rating">
                  <span class="stars">{{ getStars(averageRating()) }}</span>
                  <span class="rating-text">{{ averageRating() | number:'1.1-1' }} out of 5 ({{ reviews().length }} reviews)</span>
                </div>
              } @else {
                <p class="no-reviews-text">No reviews yet. Be the first to review this product!</p>
              }
            </div>

            <div class="divider"></div>

            <!-- Add Review Form -->
            <div class="add-review-container">
              @if (authService.isAuthenticated()) {
                @if (hasUserReviewed()) {
                  <div class="already-reviewed-msg">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="success-icon">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <span>You have already reviewed this product.</span>
                  </div>
                } @else {
                  <h4>Write a Review</h4>
                  <form (ngSubmit)="submitReview()" class="review-form">
                    <div class="rating-input-group">
                      <span class="rating-label">Your Rating:</span>
                      <div class="star-rating-selector">
                        @for (star of [1, 2, 3, 4, 5]; track star) {
                          <button type="button" class="star-btn" (click)="setNewRating(star)" [class.active]="star <= newRating()">
                            ★
                          </button>
                        }
                      </div>
                    </div>
                    <div class="form-group">
                      <label class="form-label" for="newComment">Your Review*</label>
                      <textarea id="newComment" [(ngModel)]="newComment" name="newComment" rows="3" class="form-control" placeholder="Share your experience with this product..." required maxLength="500"></textarea>
                    </div>
                    <button type="submit" [disabled]="!newComment || isSubmitting()" class="btn btn-primary btn-sm">
                      Submit Review
                    </button>
                  </form>
                }
              } @else {
                <div class="login-prompt">
                  <p>Please <a routerLink="/login">log in</a> to write a review.</p>
                </div>
              }
            </div>

            <div class="divider"></div>

            <!-- Reviews List -->
            <div class="reviews-list">
              @for (rev of reviews(); track rev.id) {
                <div class="review-card glass-panel">
                  <div class="review-meta">
                    <div class="user-info">
                      <span class="user-avatar">{{ rev.userName.substring(0, 1).toUpperCase() }}</span>
                      <div>
                        <h5 class="user-name">{{ rev.userName }}</h5>
                        <span class="review-date">{{ rev.createdAt | date:'mediumDate' }}</span>
                      </div>
                    </div>
                    <div class="rating-actions">
                      <span class="stars">{{ getStars(rev.rating) }}</span>
                      @if (canDeleteReview(rev)) {
                        <button class="delete-review-btn" (click)="deleteReview(rev.id)" title="Delete review">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                        </button>
                      }
                    </div>
                  </div>
                  <p class="review-comment">{{ rev.comment }}</p>
                </div>
              }
            </div>
          </div>
        }
      }
    </div>
  `,
  styles: [`
    .details-container {
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

    .details-layout {
      display: grid;
      grid-template-columns: 1fr;
      gap: 2.5rem;
      align-items: start;
    }

    @media (min-width: 992px) {
      .details-layout {
        grid-template-columns: 1fr 1fr;
      }
    }

    .product-gallery {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .main-image-wrapper {
      aspect-ratio: 1.25 / 1;
      width: 100%;
      overflow: hidden;
      border-radius: var(--radius-lg);
      border-color: var(--panel-border);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .main-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .thumbnails-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
    }

    .thumbnail {
      aspect-ratio: 1.25 / 1;
      border-radius: var(--radius-sm);
      overflow: hidden;
      cursor: pointer;
      border-color: var(--panel-border);
      opacity: 0.6;
      transition: var(--transition-fast);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .thumbnail img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .thumbnail:hover, .thumbnail.active {
      opacity: 1;
      border-color: var(--primary-color);
    }

    .product-info {
      padding: 2.5rem 2rem;
      border-radius: var(--radius-lg);
      border-color: var(--panel-border);
    }

    .product-category {
      font-size: 0.85rem;
      font-weight: 700;
      color: var(--secondary-color);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 0.5rem;
      display: block;
    }

    .product-title {
      font-size: 2.25rem;
      font-weight: 700;
      margin-bottom: 1rem;
      color: var(--text-primary);
    }

    .price-row {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .price-val {
      font-size: 1.85rem;
      font-weight: 800;
      font-family: var(--font-heading);
      color: var(--text-primary);
    }

    .availability-badge {
      background: rgba(16, 185, 129, 0.15);
      color: var(--success);
      padding: 0.3rem 0.75rem;
      font-size: 0.75rem;
      font-weight: 700;
      border-radius: var(--radius-full);
      text-transform: uppercase;
    }

    .divider {
      height: 1px;
      background: var(--border-color);
      margin: 1.5rem 0;
    }

    .desc-section h4 {
      margin-bottom: 0.75rem;
      color: var(--text-primary);
    }

    .desc-section p {
      color: var(--text-secondary);
      font-size: 0.95rem;
      line-height: 1.7;
    }

    .actions-section {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 1.5rem;
      margin-top: 1.5rem;
    }

    .quantity-picker {
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
      width: 42px;
      height: 42px;
      font-size: 1.2rem;
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
      padding: 0 1rem;
      font-weight: 600;
      min-width: 40px;
      text-align: center;
    }

    .add-cart-btn {
      flex-grow: 1;
      height: 42px;
    }

    .skeleton-layout {
      grid-template-columns: 1fr 1fr;
    }

    .img-sk {
      aspect-ratio: 1.25 / 1;
      border-radius: var(--radius-lg);
      width: 100%;
    }

    .info-sk-wrapper {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .info-sk-wrapper .title-sk { height: 32px; width: 80%; }
    .info-sk-wrapper .cat-sk { height: 14px; width: 30%; }
    .info-sk-wrapper .price-sk { height: 28px; width: 40%; }
    .info-sk-wrapper .desc-sk { height: 120px; width: 100%; }
    .info-sk-wrapper .btn-sk { height: 42px; width: 150px; }

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

    /* Reviews Styling */
    .reviews-section {
      margin-top: 3rem;
      padding: 2.5rem 2rem;
      border-radius: var(--radius-lg);
      border-color: var(--panel-border);
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .reviews-header h3 {
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
    }

    .average-rating {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    .stars {
      color: #fbbf24;
      font-size: 1.2rem;
      letter-spacing: 2px;
    }

    .rating-text {
      color: var(--text-secondary);
      font-size: 0.9rem;
    }

    .no-reviews-text {
      color: var(--text-muted);
      font-size: 0.95rem;
    }

    .add-review-container {
      background: rgba(255, 255, 255, 0.01);
      padding: 1.5rem;
      border-radius: var(--radius-md);
      border: 1px solid var(--border-light);
    }

    .add-review-container h4 {
      margin-bottom: 1rem;
      font-size: 1.15rem;
    }

    .review-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .rating-input-group {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .rating-label {
      font-size: 0.9rem;
      color: var(--text-secondary);
      font-weight: 500;
    }

    .star-rating-selector {
      display: flex;
      gap: 0.25rem;
    }

    .star-btn {
      background: transparent;
      border: none;
      font-size: 1.75rem;
      color: var(--text-muted);
      cursor: pointer;
      transition: var(--transition-fast);
      padding: 0;
      line-height: 1;
    }

    .star-btn:hover, .star-btn.active {
      color: #fbbf24;
      transform: scale(1.1);
    }

    .already-reviewed-msg {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      color: var(--success);
      font-size: 0.95rem;
      background: rgba(16, 185, 129, 0.05);
      padding: 1rem;
      border-radius: var(--radius-sm);
      border: 1px solid rgba(16, 185, 129, 0.1);
    }

    .success-icon {
      color: var(--success);
    }

    .login-prompt {
      color: var(--text-secondary);
      font-size: 0.95rem;
    }

    .login-prompt a {
      color: var(--primary-color);
      text-decoration: none;
      font-weight: 600;
    }

    .login-prompt a:hover {
      text-decoration: underline;
    }

    .reviews-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .review-card {
      padding: 1.5rem;
      border-radius: var(--radius-md);
      border-color: var(--panel-border);
      background: rgba(255, 255, 255, 0.01);
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .review-meta {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: var(--primary-color);
      color: white;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.1rem;
      box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
    }

    .user-name {
      font-size: 0.95rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    .review-date {
      font-size: 0.75rem;
      color: var(--text-muted);
      display: block;
    }

    .rating-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .delete-review-btn {
      background: transparent;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      transition: var(--transition-fast);
    }

    .delete-review-btn:hover {
      color: var(--error);
      background: rgba(244, 63, 94, 0.05);
    }

    .review-comment {
      color: var(--text-secondary);
      font-size: 0.95rem;
      line-height: 1.6;
    }
  `]
})
export class ProductDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  public authService = inject(AuthService);
  private toastService = inject(ToastService);
  private reviewService = inject(ReviewService);
  private productImageService = inject(ProductImageService);

  product = signal<Product | null>(null);
  quantity = signal<number>(1);
  isLoading = signal<boolean>(true);
  errorState = signal<string | null>(null);

  // Gallery State
  images = signal<string[]>([]);
  selectedImage = signal<string>('');

  // Reviews State
  reviews = signal<Review[]>([]);
  averageRating = signal<number>(0);
  newRating = signal<number>(5);
  newComment = '';
  isSubmitting = signal<boolean>(false);

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const idStr = params.get('id');
      if (idStr) {
        this.loadProduct(Number(idStr));
      } else {
        this.errorState.set('Invalid Product ID.');
        this.isLoading.set(false);
      }
    });
  }

  loadProduct(id: number) {
    this.isLoading.set(true);
    this.errorState.set(null);

    this.productService.getProductById(id).subscribe({
      next: (prod) => {
        this.product.set(prod);
        this.selectedImage.set(prod.imageUrl);
        this.images.set([prod.imageUrl]);
        this.loadReviews(id);
        this.loadProductImages(id, prod.imageUrl);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.errorState.set('Product not found or connection failed.');
        this.isLoading.set(false);
      }
    });
  }

  loadProductImages(productId: number, mainImageUrl: string) {
    this.productImageService.getProductImages(productId).subscribe({
      next: (imgs) => {
        const urls = [mainImageUrl, ...imgs.map(i => i.imageUrl)];
        const uniqueUrls = Array.from(new Set(urls.filter(Boolean)));
        this.images.set(uniqueUrls);
      },
      error: (err) => {
        console.error('Failed to load product images:', err);
      }
    });
  }


  loadReviews(productId: number) {
    this.reviewService.getProductReviews(productId).subscribe({
      next: (revs) => {
        this.reviews.set(revs);
        if (revs.length > 0) {
          const sum = revs.reduce((acc, curr) => acc + curr.rating, 0);
          this.averageRating.set(sum / revs.length);
        } else {
          this.averageRating.set(0);
        }
      },
      error: (err) => {
        console.error('Failed to load reviews:', err);
      }
    });
  }

  hasUserReviewed(): boolean {
    const user = this.authService.currentUser();
    if (!user) return false;
    return this.reviews().some(r => r.userName === user.fullName);
  }

  getStars(rating: number): string {
    const fullStars = Math.round(rating);
    return '★'.repeat(fullStars) + '☆'.repeat(5 - fullStars);
  }

  setNewRating(rating: number) {
    this.newRating.set(rating);
  }

  canDeleteReview(review: Review): boolean {
    const user = this.authService.currentUser();
    if (!user) return false;
    return user.role === 'Admin' || review.userName === user.fullName;
  }

  deleteReview(id: number) {
    if (confirm('Are you sure you want to delete this review?')) {
      this.reviewService.deleteReview(id).subscribe({
        next: () => {
          this.toastService.success('Review deleted.');
          const prod = this.product();
          if (prod) {
            this.loadReviews(prod.id);
          }
        },
        error: (err) => {
          console.error(err);
          this.toastService.error('Failed to delete review.');
        }
      });
    }
  }

  submitReview() {
    const prod = this.product();
    if (!prod) return;

    if (!this.newComment || this.newComment.trim() === '') {
      this.toastService.error('Please enter a comment.');
      return;
    }

    this.isSubmitting.set(true);
    const request = {
      productID: prod.id,
      rating: this.newRating(),
      comment: this.newComment.trim()
    };

    this.reviewService.createReview(request).subscribe({
      next: () => {
        this.toastService.success('Review submitted successfully.');
        this.newComment = '';
        this.newRating.set(5);
        this.isSubmitting.set(false);
        this.loadReviews(prod.id);
      },
      error: (err) => {
        console.error(err);
        this.isSubmitting.set(false);
        const errMsg = err.error?.message || err.error || 'Failed to submit review.';
        this.toastService.error(errMsg);
      }
    });
  }

  incrementQty() {
    this.quantity.update(q => q + 1);
  }

  decrementQty() {
    if (this.quantity() > 1) {
      this.quantity.update(q => q - 1);
    }
  }

  addToCart(product: Product) {
    if (!this.authService.isAuthenticated()) {
      this.toastService.info('Please log in to add items to your cart.');
      this.router.navigate(['/login']);
      return;
    }

    this.cartService.addToCart(product.id, this.quantity()).subscribe({
      next: () => {
        this.toastService.success(`Added ${this.quantity()} x ${product.name} to cart.`);
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
