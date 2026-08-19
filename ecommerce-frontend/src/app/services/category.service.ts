import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../models';
import { API_URL } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private http = inject(HttpClient);

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${API_URL}/Categories`);
  }

  createCategory(category: Omit<Category, 'id'>): Observable<Category> {
    return this.http.post<Category>(`${API_URL}/Categories`, category);
  }

  updateCategory(id: number, category: Category): Observable<Category> {
    return this.http.put<Category>(`${API_URL}/Categories/${id}`, category);
  }

  deleteCategory(id: number): Observable<any> {
    return this.http.delete(`${API_URL}/Categories/${id}`);
  }
}
