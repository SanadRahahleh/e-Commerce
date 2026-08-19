import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';
import { ToastService } from '../../../services/toast.service';
import { Product, Category } from '../../../models';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="admin-products-container">
      <div class="panel-header">
        <div>
          <h2>Manage Products</h2>
          <p class="sub">Create, edit, and delete products in the database</p>
        </div>
        <button class="btn btn-primary" (click)="openCreateForm()">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add Product
        </button>
      </div>

      @if (isLoading()) {
        <div class="skeleton-table skeleton"></div>
      } @else {
        <div class="custom-table-container glass-panel">
          <table class="custom-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (prod of products(); track prod.id) {
                <tr>
                  <td>#{{ prod.id }}</td>
                  <td>
                    <img
                      [src]="prod.imageUrl || 'assets/placeholder.jpg'"
                      [alt]="prod.name"
                      class="table-prod-img"
                      (error)="handleImageError($event)"
                    />
                  </td>
                  <td class="prod-name-cell">{{ prod.name }}</td>
                  <td>{{ prod.categoryName || 'Product' }}</td>
                  <td class="price-cell">{{ prod.price | currency:'USD' }}</td>
                  <td class="stock-cell">{{ prod.stockQuantity ?? 0 }} pcs</td>
                  <td>
                    <span class="badge" [class.badge-success]="prod.isActive" [class.badge-danger]="!prod.isActive">
                      {{ prod.isActive ? 'Active' : 'Inactive' }}
                    </span>
                  </td>
                  <td>
                    <div class="table-actions">
                      <button class="action-btn edit" (click)="openEditForm(prod)" title="Edit">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </button>
                      <button class="action-btn delete" (click)="deleteProduct(prod)" title="Delete">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          <line x1="10" y1="11" x2="10" y2="17"></line>
                          <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="8" class="empty-row-text">No products in database. Add one to start cataloging!</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }

      @if (isFormOpen()) {
        <div class="modal-overlay" (click)="closeForm()">
          <div class="modal-card glass-panel" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h3>{{ editingProduct() ? 'Edit Product' : 'Create Product' }}</h3>
              <button class="close-btn" (click)="closeForm()">&times;</button>
            </div>

            <form [formGroup]="productForm" (ngSubmit)="onSubmit()" class="modal-form">
              
              <div class="form-group">
                <label class="form-label" for="name">Product Name*</label>
                <input type="text" id="name" formControlName="name" class="form-control" [class.invalid]="isFieldInvalid('name')" />
                @if (isFieldInvalid('name')) { <span class="form-error">Name is required.</span> }
              </div>

              <div class="form-group">
                <label class="form-label" for="categoryId">Category*</label>
                <select id="categoryId" formControlName="categoryId" class="form-control" [class.invalid]="isFieldInvalid('categoryId')">
                  <option value="" disabled selected>Select Category</option>
                  @for (cat of categories(); track cat.id) {
                    <option [value]="cat.id">{{ cat.name }}</option>
                  }
                </select>
                @if (isFieldInvalid('categoryId')) { <span class="form-error">Category is required.</span> }
              </div>

              <div class="form-group">
                <label class="form-label" for="price">Price ($)*</label>
                <input type="number" id="price" formControlName="price" class="form-control" [class.invalid]="isFieldInvalid('price')" step="0.01" />
                @if (isFieldInvalid('price')) {
                  <span class="form-error">
                    @if (productForm.get('price')?.errors?.['required']) { Price is required. }
                    @if (productForm.get('price')?.errors?.['min']) { Price must be greater than 0. }
                  </span>
                }
              </div>

              <div class="form-group">
                <label class="form-label" for="stockQuantity">Stock Quantity*</label>
                <input type="number" id="stockQuantity" formControlName="stockQuantity" class="form-control" [class.invalid]="isFieldInvalid('stockQuantity')" />
                @if (isFieldInvalid('stockQuantity')) {
                  <span class="form-error">
                    @if (productForm.get('stockQuantity')?.errors?.['required']) { Stock quantity is required. }
                    @if (productForm.get('stockQuantity')?.errors?.['min']) { Stock quantity cannot be negative. }
                  </span>
                }
              </div>

              <div class="form-group">
                <label class="form-label" for="imageUrl">Image URL</label>
                <input type="text" id="imageUrl" formControlName="imageUrl" class="form-control" placeholder="https://images.unsplash.com/..." />
              </div>

              <div class="form-group">
                <label class="form-label" for="description">Description*</label>
                <textarea id="description" formControlName="description" rows="3" class="form-control" [class.invalid]="isFieldInvalid('description')"></textarea>
                @if (isFieldInvalid('description')) { <span class="form-error">Description is required.</span> }
              </div>

              <div class="form-group checkbox-group">
                <label>
                  <input type="checkbox" id="isActive" formControlName="isActive" />
                  Is Active (Visible in Store)
                </label>
              </div>

              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" (click)="closeForm()">Cancel</button>
                <button type="submit" [disabled]="productForm.invalid || isSaving" class="btn btn-primary">
                  {{ editingProduct() ? 'Update' : 'Create' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .admin-products-container {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
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

    .table-prod-img {
      width: 44px;
      height: 44px;
      border-radius: var(--radius-sm);
      object-fit: cover;
      border: 1px solid var(--border-light);
    }

    .prod-name-cell {
      font-weight: 600;
      color: var(--text-primary);
    }

    .price-cell {
      font-family: var(--font-heading);
      font-weight: 700;
    }

    .stock-cell {
      color: var(--text-secondary);
      font-size: 0.9rem;
    }

    .table-actions {
      display: flex;
      gap: 0.5rem;
    }

    .action-btn {
      background: transparent;
      border: none;
      width: 32px;
      height: 32px;
      border-radius: var(--radius-sm);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: var(--text-secondary);
      transition: var(--transition-fast);
    }

    .action-btn.edit:hover {
      color: var(--primary-color);
      background: rgba(99, 102, 241, 0.05);
    }

    .action-btn.delete:hover {
      color: var(--error);
      background: rgba(244, 63, 94, 0.05);
    }

    .empty-row-text {
      text-align: center;
      padding: 3rem !important;
      color: var(--text-muted);
    }

    .badge {
      display: inline-block;
      padding: 0.25rem 0.5rem;
      font-size: 0.75rem;
      font-weight: 600;
      border-radius: 50px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    
    .badge-success {
      background: rgba(16, 185, 129, 0.1);
      color: #10b981;
      border: 1px solid rgba(16, 185, 129, 0.2);
    }
    
    .badge-danger {
      background: rgba(239, 68, 68, 0.1);
      color: #ef4444;
      border: 1px solid rgba(239, 68, 68, 0.2);
    }

    .checkbox-group {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 0;
    }

    .checkbox-group label {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      color: var(--text-primary);
      cursor: pointer;
      font-size: 0.9rem;
      user-select: none;
    }

    .checkbox-group input[type="checkbox"] {
      width: 18px;
      height: 18px;
      border-radius: var(--radius-sm);
      border: 1px solid var(--border-color);
      background: rgba(255, 255, 255, 0.05);
      cursor: pointer;
      accent-color: var(--primary-color);
    }

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
      max-width: 500px;
      width: 100%;
      border-radius: var(--radius-lg);
      border-color: var(--panel-border);
      padding: 2rem;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      max-height: 90vh;
      overflow-y: auto;
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

    .modal-form {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 1rem;
    }

    select.form-control {
      background: rgba(11, 15, 25, 0.95);
    }

    select.form-control option {
      background: var(--bg-color);
      color: var(--text-primary);
    }

    @keyframes zoomIn {
      from { transform: scale(0.95); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
  `]
})
export class AdminProductsComponent implements OnInit {
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private toastService = inject(ToastService);
  private fb = inject(FormBuilder);

  products = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  
  isLoading = signal<boolean>(true);
  isFormOpen = signal<boolean>(false);
  editingProduct = signal<Product | null>(null);
  isSaving = false;

  productForm: FormGroup;

  constructor() {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      categoryId: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0.01)]],
      stockQuantity: [100, [Validators.required, Validators.min(0)]],
      imageUrl: [''],
      description: ['', Validators.required],
      isActive: [true]
    });
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading.set(true);
    forkJoin({
      prods: this.productService.getProducts(),
      cats: this.categoryService.getCategories()
    }).subscribe({
      next: (results) => {
        const catMap = new Map(results.cats.map(c => [c.id, c.name]));
        const mapped = results.prods.map(p => {
          const catId = p.categoryID ?? p.categoryId;
          return {
            ...p,
            categoryId: catId,
            categoryName: p.categoryName || catMap.get(catId ?? -1) || 'Product'
          };
        });
        
        this.products.set(mapped);
        this.categories.set(results.cats);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.toastService.error('Failed to load database content.');
        this.isLoading.set(false);
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.productForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  openCreateForm() {
    this.editingProduct.set(null);
    this.productForm.reset({
      name: '',
      categoryId: '',
      price: '',
      stockQuantity: 100,
      imageUrl: '',
      description: '',
      isActive: true
    });
    this.isFormOpen.set(true);
  }

  openEditForm(product: Product) {
    this.editingProduct.set(product);
    this.productForm.patchValue({
      name: product.name,
      categoryId: product.categoryId,
      price: product.price,
      stockQuantity: product.stockQuantity ?? 0,
      imageUrl: product.imageUrl,
      description: product.description,
      isActive: product.isActive ?? true
    });
    this.isFormOpen.set(true);
  }

  closeForm() {
    this.isFormOpen.set(false);
    this.editingProduct.set(null);
  }

  onSubmit() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    const formVal = this.productForm.value;
    const modelData = {
      ...formVal,
      categoryId: Number(formVal.categoryId),
      price: Number(formVal.price),
      stockQuantity: Number(formVal.stockQuantity),
      isActive: !!formVal.isActive
    };

    const editProd = this.editingProduct();
    if (editProd) {

      const updatedModel: Product = { ...modelData, id: editProd.id };
      this.productService.updateProduct(editProd.id, updatedModel).subscribe({
        next: () => {
          this.isSaving = false;
          this.toastService.success(`Product ${updatedModel.name} updated.`);
          this.closeForm();
          this.loadData();
        },
        error: (err) => {
          this.isSaving = false;
          console.error(err);
          this.toastService.error('Failed to update product.');
        }
      });
    } else {

      this.productService.createProduct(modelData).subscribe({
        next: () => {
          this.isSaving = false;
          this.toastService.success(`Product ${modelData.name} created.`);
          this.closeForm();
          this.loadData();
        },
        error: (err) => {
          this.isSaving = false;
          console.error(err);
          this.toastService.error('Failed to create product.');
        }
      });
    }
  }

  deleteProduct(product: Product) {
    if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
      this.productService.deleteProduct(product.id).subscribe({
        next: () => {
          this.toastService.success(`Deleted ${product.name}.`);
          this.loadData();
        },
        error: (err) => {
          console.error(err);
          this.toastService.error('Failed to delete product.');
        }
      });
    }
  }

  handleImageError(event: Event) {
    (event.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=100&q=80';
  }
}
