import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../models';
import { API_URL } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private http = inject(HttpClient);

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${API_URL}/Orders`);
  }

  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${API_URL}/Orders/all`);
  }

  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${API_URL}/Orders/${id}`);
  }

  createOrder(address: string, phone?: string): Observable<Order> {
    return this.http.post<Order>(`${API_URL}/Orders`, { address, phone });
  }


  updateOrderStatus(id: number, status: string): Observable<any> {

    return this.http.put(`${API_URL}/Orders/${id}/status`, JSON.stringify(status), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
