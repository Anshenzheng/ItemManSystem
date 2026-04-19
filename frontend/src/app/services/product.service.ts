import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:8080/api/products';

  constructor(private http: HttpClient) { }

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  getProductByCode(productCode: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/code/${productCode}`);
  }

  searchProducts(keyword?: string): Observable<Product[]> {
    const params = keyword ? { keyword } : {};
    return this.http.get<Product[]>(`${this.apiUrl}/search`, { params });
  }

  getLowStockProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/low-stock`);
  }

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/categories`);
  }

  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  updateProduct(id: number, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }

  updateStock(id: number, quantity: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/stock`, { quantity });
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  countProducts(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.apiUrl}/count`);
  }
}
