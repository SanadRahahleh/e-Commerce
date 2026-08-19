import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { LoginRequest, LoginResponse, SignupRequest, User } from '../models';

export const API_URL = 'https://localhost:7285/api';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  currentUser = signal<User | null>(null);
  token = signal<string | null>(null);

  isAuthenticated = computed(() => this.token() !== null);
  isAdmin = computed(() => this.currentUser()?.role === 'Admin');

  constructor() {
    this.loadToken();
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${API_URL}/Auth/login`, request).pipe(
      tap(response => {
        if (response && response.token) {
          this.saveToken(response.token);
        }
      })
    );
  }

  signup(request: SignupRequest): Observable<any> {
    return this.http.post(`${API_URL}/Auth/signup`, request);
  }

  logout() {
    localStorage.removeItem('jwt_token');
    this.token.set(null);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  private saveToken(token: string) {
    localStorage.setItem('jwt_token', token);
    this.token.set(token);
    this.currentUser.set(this.parseUserFromToken(token));
  }

  private loadToken() {
    const storedToken = localStorage.getItem('jwt_token');
    if (storedToken) {

      const decoded = this.decodeToken(storedToken);
      if (decoded && decoded.exp * 1000 > Date.now()) {
        this.token.set(storedToken);
        this.currentUser.set(this.parseUserFromToken(storedToken));
      } else {
        localStorage.removeItem('jwt_token');
      }
    }
  }

  private parseUserFromToken(token: string): User | null {
    const decoded = this.decodeToken(token);
    if (!decoded) return null;

    const email = decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || decoded['email'];
    const role = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || decoded['role'];
    const fullName = decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || decoded['unique_name'] || decoded['name'];
    const phone = decoded['phone'];
    const address = decoded['address'];

    return {
      email: email || '',
      fullName: fullName || '',
      role: (role === 'Admin' || role?.toLowerCase() === 'admin') ? 'Admin' : 'Customer',
      phone: phone || '',
      address: address || ''
    };
  }

  updateLocalUserProfile(phone: string, address: string) {
    this.currentUser.update(user => {
      if (!user) return null;
      return { ...user, phone, address };
    });
  }

  private decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      const base64Url = payload.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64Url)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  }
}

