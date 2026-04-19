import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Order } from '../models/models';
import { OrderService } from '../services/order.service';
import { AppService } from '../services/app.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  loading = false;
  showDetail = false;
  selectedOrder: Order | null = null;

  filterForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    private appService: AppService
  ) {
    this.filterForm = this.fb.group({
      startDate: [''],
      endDate: ['']
    });
  }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.orderService.getAllOrders().subscribe({
      next: (data) => {
        this.orders = data;
        this.filteredOrders = [...data];
        this.loading = false;
      },
      error: () => {
        this.appService.error('加载订单列表失败');
        this.loading = false;
      }
    });
  }

  applyDateFilter(): void {
    const startDate = this.filterForm.get('startDate')?.value;
    const endDate = this.filterForm.get('endDate')?.value;

    if (!startDate || !endDate) {
      this.filteredOrders = [...this.orders];
      return;
    }

    this.loading = true;
    this.orderService.getOrdersByDateRange(startDate, endDate).subscribe({
      next: (data) => {
        this.filteredOrders = data;
        this.loading = false;
      },
      error: () => {
        this.appService.error('筛选订单失败');
        this.loading = false;
      }
    });
  }

  clearFilter(): void {
    this.filterForm.reset();
    this.filteredOrders = [...this.orders];
  }

  viewDetail(order: Order): void {
    this.selectedOrder = order;
    this.showDetail = true;
  }

  closeDetail(): void {
    this.showDetail = false;
    this.selectedOrder = null;
  }

  cancelOrder(order: Order): void {
    if (!confirm(`确定要取消订单「${order.orderNo}」吗？取消后库存将恢复。`)) {
      return;
    }

    this.orderService.cancelOrder(order.id!).subscribe({
      next: () => {
        this.appService.success('订单已取消，库存已恢复');
        this.loadOrders();
        if (this.showDetail && this.selectedOrder?.id === order.id) {
          this.closeDetail();
        }
      },
      error: (err) => {
        this.appService.error(err.error?.message || '取消订单失败');
      }
    });
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'COMPLETED':
        return 'badge-success';
      case 'CANCELLED':
        return 'badge-danger';
      default:
        return 'badge-primary';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'COMPLETED':
        return '已完成';
      case 'CANCELLED':
        return '已取消';
      default:
        return status;
    }
  }
}
