import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private http = inject(HttpClient);

  processPayment(orderId: number, method: 'CashOnDelivery' | 'Visa' | 'MasterCard'): Observable<any> {

    return this.http.post(`${API_URL}/Payments`, {
      orderID: orderId,
      method: method
    });
  }
}
