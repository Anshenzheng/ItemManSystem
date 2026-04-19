import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:8080/api/orders';

  constructor(private http: HttpClient) { }

  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl);
  }

  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`);
  }

  getOrderByOrderNo(orderNo: string): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/orderNo/${orderNo}`);
  }

  getOrdersByDateRange(startDate: string, endDate: string): Observable<Order[]> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    return this.http.get<Order[]>(`${this.apiUrl}/date-range`, { params });
  }

  createOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, order);
  }

  cancelOrder(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/cancel`, {});
  }

  deleteOrder(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getTodayOrderCount(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.apiUrl}/today/count`);
  }

  getTodaySales(): Observable<{ sales: number }> {
    return this.http.get<{ sales: number }>(`${this.apiUrl}/today/sales`);
  }
}
