import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, InventorySummary, Notification, DashboardData } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private apiUrl = 'http://localhost:8080/api/inventory';
  private dashboardUrl = 'http://localhost:8080/api/dashboard';

  constructor(private http: HttpClient) { }

  getAllInventory(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  getLowStockProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/low-stock`);
  }

  getLowStockCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/low-stock/count`);
  }

  hasLowStockProducts(): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/low-stock/check`);
  }

  searchInventory(keyword?: string): Observable<Product[]> {
    const params = keyword ? { keyword } : {};
    return this.http.get<Product[]>(`${this.apiUrl}/search`, { params });
  }

  getInventorySummary(): Observable<InventorySummary> {
    return this.http.get<InventorySummary>(`${this.apiUrl}/summary`);
  }

  getDashboardData(): Observable<DashboardData> {
    return this.http.get<DashboardData>(this.dashboardUrl);
  }

  getNotifications(): Observable<Notification> {
    return this.http.get<Notification>(`${this.dashboardUrl}/notifications`);
  }
}
