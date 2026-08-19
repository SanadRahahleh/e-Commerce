import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Review, CreateReviewRequest } from '../models';
import { API_URL } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private http = inject(HttpClient);

  getProductReviews(productId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${API_URL}/Reviews/product/${productId}`);
  }

  createReview(request: CreateReviewRequest): Observable<any> {
    return this.http.post<any>(`${API_URL}/Reviews`, request);
  }

  deleteReview(id: number): Observable<any> {
    return this.http.delete<any>(`${API_URL}/Reviews/${id}`);
  }
}
