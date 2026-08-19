import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '../../../services/category.service';
import { ToastService } from '../../../services/toast.service';
import { Category } from '../../../models';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="admin-cats-container">
      <div class="panel-header">
        <div>
          <h2>Manage Categories</h2>
          <p class="sub">Group products by defining categories</p>
        </div>
        <button class="btn btn-primary" (click)="openCreateForm()">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add Category
        </button>
      </div>

      @if (isLoading()) {
        <div class="skeleton skeleton-table"></div>
      } @else {
        <div class="custom-table-container glass-panel">
          <table class="custom-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Category Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (cat of categories(); track cat.id) {
                <tr>
                  <td>#{{ cat.id }}</td>
                  <td class="cat-name-cell">{{ cat.name }}</td>
                  <td>
                    <div class="table-actions">
                      <button class="action-btn edit" (click)="openEditForm(cat)" title="Edit">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </button>
                      <button class="action-btn delete" (click)="deleteCategory(cat)" title="Delete">
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
                  <td colspan="3" class="empty-row-text">No categories defined yet. Add one to sort your catalog!</td>
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
              <h3>{{ editingCategory() ? 'Edit Category' : 'Create Category' }}</h3>
              <button class="close-btn" (click)="closeForm()">&times;</button>
            </div>

            <form [formGroup]="catForm" (ngSubmit)="onSubmit()" class="modal-form">
              <div class="form-group">
                <label class="form-label" for="name">Category Name*</label>
                <input type="text" id="name" formControlName="name" class="form-control" [class.invalid]="isFieldInvalid('name')" />
                @if (isFieldInvalid('name')) {
                  <span class="form-error">Category name is required.</span>
                }
              </div>

              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" (click)="closeForm()">Cancel</button>
                <button type="submit" [disabled]="catForm.invalid || isSaving" class="btn btn-primary">
                  {{ editingCategory() ? 'Update' : 'Create' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .admin-cats-container {
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
      height: 250px;
      width: 100%;
      border-radius: var(--radius-lg);
    }

    .cat-name-cell {
      font-weight: 600;
      color: var(--text-primary);
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
      max-width: 400px;
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

    @keyframes zoomIn {
      from { transform: scale(0.95); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
  `]
})
export class AdminCategoriesComponent implements OnInit {
  private categoryService = inject(CategoryService);
  private toastService = inject(ToastService);
  private fb = inject(FormBuilder);

  categories = signal<Category[]>([]);
  isLoading = signal<boolean>(true);
  isFormOpen = signal<boolean>(false);
  editingCategory = signal<Category | null>(null);
  isSaving = false;

  catForm: FormGroup;

  constructor() {
    this.catForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.isLoading.set(true);
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.toastService.error('Failed to load categories.');
        this.isLoading.set(false);
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.catForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  openCreateForm() {
    this.editingCategory.set(null);
    this.catForm.reset({ name: '' });
    this.isFormOpen.set(true);
  }

  openEditForm(category: Category) {
    this.editingCategory.set(category);
    this.catForm.patchValue({ name: category.name });
    this.isFormOpen.set(true);
  }

  closeForm() {
    this.isFormOpen.set(false);
    this.editingCategory.set(null);
  }

  onSubmit() {
    if (this.catForm.invalid) {
      return;
    }

    this.isSaving = true;
    const { name } = this.catForm.value;

    const editCat = this.editingCategory();
    if (editCat) {

      const updated: Category = { id: editCat.id, name };
      this.categoryService.updateCategory(editCat.id, updated).subscribe({
        next: () => {
          this.isSaving = false;
          this.toastService.success(`Category "${name}" updated.`);
          this.closeForm();
          this.loadCategories();
        },
        error: (err) => {
          this.isSaving = false;
          console.error(err);
          this.toastService.error('Failed to update category.');
        }
      });
    } else {

      this.categoryService.createCategory({ name }).subscribe({
        next: () => {
          this.isSaving = false;
          this.toastService.success(`Category "${name}" created.`);
          this.closeForm();
          this.loadCategories();
        },
        error: (err) => {
          this.isSaving = false;
          console.error(err);
          this.toastService.error('Failed to create category.');
        }
      });
    }
  }

  deleteCategory(category: Category) {
    if (confirm(`Are you sure you want to delete category "${category.name}"?`)) {
      this.categoryService.deleteCategory(category.id).subscribe({
        next: () => {
          this.toastService.success(`Deleted category "${category.name}".`);
          this.loadCategories();
        },
        error: (err) => {
          console.error(err);
          this.toastService.error('Failed to delete category (it may be linked to products).');
        }
      });
    }
  }
}
