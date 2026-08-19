import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models';
import { API_URL } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {
  private http = inject(HttpClient);

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${API_URL}/Users`);
  }

  updateUserRole(id: number, role: string): Observable<any> {
    return this.http.put(`${API_URL}/Users/${id}/role`, JSON.stringify(role), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
