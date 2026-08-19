import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserManagementService } from '../../../services/user-management.service';
import { ToastService } from '../../../services/toast.service';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-users-container">
      <div class="panel-header">
        <div>
          <h2>Manage Users</h2>
          <p class="sub">View registered customers and update their access roles</p>
        </div>
        <div class="search-box glass-panel">
          <input
            type="text"
            [(ngModel)]="searchQuery"
            placeholder="Search by name, email or role..."
            class="search-input"
          />
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
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Joined Date</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (usr of filteredUsers(); track usr.email) {
                <tr>
                  <td>#{{ usr.id || 0 }}</td>
                  <td class="user-name-cell">{{ usr.fullName || 'No Name' }}</td>
                  <td>{{ usr.email }}</td>
                  <td>{{ usr.phone || '—' }}</td>
                  <td class="address-cell" [title]="usr.address || ''">{{ usr.address || '—' }}</td>
                  <td>{{ usr.createdAt | date:'mediumDate' }}</td>
                  <td>
                    <span class="role-badge" [class.admin]="usr.role === 'Admin'" [class.customer]="usr.role === 'Customer'">
                      {{ usr.role }}
                    </span>
                  </td>
                  <td>
                    @if (isSelf(usr)) {
                      <span class="self-label">Logged In</span>
                    } @else {
                      <select
                        [ngModel]="usr.role"
                        (ngModelChange)="changeRole(usr, $event)"
                        class="role-select"
                      >
                        <option value="Customer">Customer</option>
                        <option value="Admin">Admin</option>
                      </select>
                    }
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="8" class="empty-row-text">No registered users match your search criteria.</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>
  `,
  styles: [`
    .admin-users-container {
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

    .search-box {
      border: 1px solid var(--panel-border);
      border-radius: var(--radius-sm);
      overflow: hidden;
      padding: 0 0.75rem;
      background: rgba(255, 255, 255, 0.02);
      display: flex;
      align-items: center;
      width: 300px;
    }

    .search-input {
      background: transparent;
      border: none;
      color: var(--text-primary);
      width: 100%;
      height: 38px;
      font-size: 0.9rem;
      outline: none;
    }

    .search-input::placeholder {
      color: var(--text-muted);
    }

    .skeleton-table {
      height: 350px;
      width: 100%;
      border-radius: var(--radius-lg);
    }

    .user-name-cell {
      font-weight: 600;
      color: var(--text-primary);
    }

    .address-cell {
      max-width: 150px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .role-badge {
      display: inline-block;
      padding: 0.25rem 0.6rem;
      border-radius: var(--radius-sm);
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
    }

    .role-badge.admin {
      background: rgba(99, 102, 241, 0.15);
      color: var(--primary-color);
    }

    .role-badge.customer {
      background: rgba(255, 255, 255, 0.05);
      color: var(--text-secondary);
    }

    .role-select {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--border-color);
      color: var(--text-primary);
      border-radius: var(--radius-sm);
      padding: 0.25rem 0.5rem;
      font-size: 0.85rem;
      outline: none;
      cursor: pointer;
      transition: var(--transition-fast);
    }

    .role-select:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: var(--primary-color);
    }

    .self-label {
      font-size: 0.8rem;
      color: var(--text-muted);
      font-style: italic;
    }

    .empty-row-text {
      text-align: center;
      padding: 3rem !important;
      color: var(--text-muted);
    }
  `]
})
export class AdminUsersComponent implements OnInit {
  private userManagementService = inject(UserManagementService);
  private toastService = inject(ToastService);
  private authService = inject(AuthService);

  users = signal<User[]>([]);
  isLoading = signal<boolean>(true);
  searchQuery = '';

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading.set(true);
    this.userManagementService.getUsers().subscribe({
      next: (data) => {
        this.users.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.toastService.error('Failed to load users.');
        this.isLoading.set(false);
      }
    });
  }

  filteredUsers(): User[] {
    const query = this.searchQuery.toLowerCase().trim();
    if (!query) return this.users();

    return this.users().filter(u =>
      (u.fullName || '').toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query) ||
      u.role.toLowerCase().includes(query)
    );
  }

  isSelf(usr: User): boolean {
    const loggedInUser = this.authService.currentUser();
    return loggedInUser !== null && loggedInUser.email === usr.email;
  }

  changeRole(usr: User, newRole: string) {
    if (!usr.id) return;

    if (confirm(`Are you sure you want to change role of "${usr.fullName}" to "${newRole}"?`)) {
      this.userManagementService.updateUserRole(usr.id, newRole).subscribe({
        next: () => {
          this.toastService.success(`Updated role of ${usr.fullName} to ${newRole}.`);
          this.loadUsers();
        },
        error: (err) => {
          console.error(err);
          const errMsg = err.error?.message || err.error || 'Failed to update user role.';
          this.toastService.error(errMsg);
        }
      });
    }
  }
}
