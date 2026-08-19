import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models';
import { API_URL } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${API_URL}/Products`);
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${API_URL}/Products/${id}`);
  }

  createProduct(product: Omit<Product, 'id'>): Observable<Product> {
    return this.http.post<Product>(`${API_URL}/Products`, product);
  }

  updateProduct(id: number, product: Product): Observable<Product> {
    return this.http.put<Product>(`${API_URL}/Products/${id}`, product);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${API_URL}/Products/${id}`);
  }
}
