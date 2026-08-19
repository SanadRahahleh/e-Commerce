import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { HomeComponent } from './pages/home/home.component';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';
import { CartComponent } from './pages/cart/cart.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { OrderDetailsComponent } from './pages/order-details/order-details.component';
import { PaymentComponent } from './pages/payment/payment.component';
import { AdminDashboardComponent } from './pages/admin/admin-dashboard.component';
import { AdminProductsComponent } from './pages/admin/products/admin-products.component';
import { AdminCategoriesComponent } from './pages/admin/categories/admin-categories.component';
import { AdminOrdersComponent } from './pages/admin/orders/admin-orders.component';
import { AdminUsersComponent } from './pages/admin/users/admin-users.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: '', component: HomeComponent },
  { path: 'products/:id', component: ProductDetailsComponent },

  { path: 'cart', component: CartComponent, canActivate: [authGuard] },
  { path: 'checkout', component: CheckoutComponent, canActivate: [authGuard] },
  { path: 'orders', component: OrdersComponent, canActivate: [authGuard] },
  { path: 'orders/:id', component: OrderDetailsComponent, canActivate: [authGuard] },
  { path: 'payment/:orderId', component: PaymentComponent, canActivate: [authGuard] },

  { 
    path: 'admin', 
    component: AdminDashboardComponent, 
    canActivate: [authGuard, adminGuard],
    children: [
      { path: '', redirectTo: 'products', pathMatch: 'full' },
      { path: 'products', component: AdminProductsComponent },
      { path: 'categories', component: AdminCategoriesComponent },
      { path: 'orders', component: AdminOrdersComponent },
      { path: 'users', component: AdminUsersComponent }
    ]
  },

  { path: '**', redirectTo: '' }
];
