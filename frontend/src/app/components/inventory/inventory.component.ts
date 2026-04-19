import { Component, OnInit } from '@angular/core';
import { Product, InventorySummary } from '../models/models';
import { InventoryService } from '../services/inventory.service';
import { AppService } from '../services/app.service';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  lowStockProducts: Product[] = [];
  inventorySummary?: InventorySummary;
  searchKeyword = '';
  loading = false;
  showOnlyLowStock = false;

  constructor(
    private inventoryService: InventoryService,
    private appService: AppService
  ) { }

  ngOnInit(): void {
    this.loadInventory();
    this.loadLowStockProducts();
    this.loadSummary();
  }

  loadInventory(): void {
    this.loading = true;
    this.inventoryService.getAllInventory().subscribe({
      next: (data) => {
        this.products = data;
        this.applyFilters();
        this.loading = false;
      },
      error: () => {
        this.appService.error('加载库存数据失败');
        this.loading = false;
      }
    });
  }

  loadLowStockProducts(): void {
    this.inventoryService.getLowStockProducts().subscribe({
      next: (data) => {
        this.lowStockProducts = data;
      },
      error: () => {
        console.error('加载低库存商品失败');
      }
    });
  }

  loadSummary(): void {
    this.inventoryService.getInventorySummary().subscribe({
      next: (data) => {
        this.inventorySummary = data;
      },
      error: () => {
        console.error('加载库存汇总失败');
      }
    });
  }

  searchProducts(): void {
    this.applyFilters();
  }

  toggleLowStockFilter(): void {
    this.showOnlyLowStock = !this.showOnlyLowStock;
    this.applyFilters();
  }

  applyFilters(): void {
    let result = [...this.products];

    if (this.showOnlyLowStock) {
      result = result.filter(p => this.isLowStock(p));
    }

    if (this.searchKeyword.trim()) {
      const keyword = this.searchKeyword.toLowerCase();
      result = result.filter(
        p => p.name.toLowerCase().includes(keyword) ||
             p.productCode.toLowerCase().includes(keyword) ||
             (p.category && p.category.toLowerCase().includes(keyword))
      );
    }

    this.filteredProducts = result;
  }

  isLowStock(product: Product): boolean {
    return (product.stock || 0) <= (product.lowStockThreshold || 10);
  }

  getStockStatus(product: Product): { label: string; class: string } {
    const stock = product.stock || 0;
    const threshold = product.lowStockThreshold || 10;

    if (stock <= 0) {
      return { label: '缺货', class: 'badge-danger' };
    } else if (stock <= threshold) {
      return { label: '库存紧张', class: 'badge-warning' };
    } else {
      return { label: '正常', class: 'badge-success' };
    }
  }

  getInventoryValue(product: Product): number {
    return (product.purchasePrice || 0) * (product.stock || 0);
  }

  refresh(): void {
    this.loadInventory();
    this.loadLowStockProducts();
    this.loadSummary();
  }
}
