import { Component, OnInit } from '@angular/core';
import { DashboardData, Product } from '../models/models';
import { InventoryService } from '../services/inventory.service';
import { OrderService } from '../services/order.service';
import { ProductService } from '../services/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  dashboardData?: DashboardData;
  lowStockProducts: Product[] = [];
  recentOrders: any[] = [];
  loading = true;

  constructor(
    private inventoryService: InventoryService,
    private orderService: OrderService,
    private productService: ProductService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.loading = true;

    this.inventoryService.getDashboardData().subscribe({
      next: (data) => {
        this.dashboardData = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });

    this.productService.getLowStockProducts().subscribe({
      next: (data) => {
        this.lowStockProducts = data;
      }
    });

    this.orderService.getAllOrders().subscribe({
      next: (data) => {
        this.recentOrders = data.slice(0, 10);
      }
    });
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
}
