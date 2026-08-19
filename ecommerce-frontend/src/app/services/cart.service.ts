import { Injectable, signal, computed, inject, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Cart, CartItem } from '../models';
import { API_URL, AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  cart = signal<Cart | null>(null);

  cartItemsCount = computed(() => {
    const currentCart = this.cart();
    return currentCart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  });

  cartTotal = computed(() => {
    const currentCart = this.cart();
    return currentCart?.totalPrice || currentCart?.items?.reduce((sum, item) => sum + (item.productPrice * item.quantity), 0) || 0;
  });

  constructor() {

    effect(() => {
      if (this.authService.isAuthenticated()) {
        this.loadCart().subscribe();
      } else {
        this.cart.set(null);
      }
    });
  }

  loadCart(): Observable<Cart> {
    return this.http.get<Cart>(`${API_URL}/Carts`).pipe(
      tap(cart => this.cart.set(cart))
    );
  }

  addToCart(productId: number, quantity: number = 1): Observable<any> {

    return this.http.post(`${API_URL}/CartItems`, { ProductID: productId, Quantity: quantity }).pipe(
      tap(() => this.loadCart().subscribe())
    );
  }

  updateQuantity(cartItemId: number, quantity: number): Observable<any> {

    return this.http.put(`${API_URL}/CartItems/${cartItemId}`, { Quantity: quantity }).pipe(
      tap(() => this.loadCart().subscribe())
    );
  }

  removeFromCart(cartItemId: number): Observable<any> {

    return this.http.delete(`${API_URL}/CartItems/${cartItemId}`).pipe(
      tap(() => this.loadCart().subscribe())
    );
  }

  clearCart(): Observable<any> {

    return this.http.delete(`${API_URL}/Carts/Clear`).pipe(
      tap(() => this.cart.set(null))
    );
  }
}
