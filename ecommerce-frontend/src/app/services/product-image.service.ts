import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductImage } from '../models';
import { API_URL } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProductImageService {
  private http = inject(HttpClient);

  getProductImages(productId: number): Observable<ProductImage[]> {
    return this.http.get<ProductImage[]>(`${API_URL}/ProductImages/product/${productId}`);
  }
}
